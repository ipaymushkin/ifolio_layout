import React, {memo, useContext, useEffect, useMemo} from "react";
import {useTurntable} from "../../hooks/useTurntable";
import BlockContainer from "./BlockContainer";
import {WidgetWrapper} from "./styled";
import TextReduxWrapper from "./Wrappers/Text";
import MediaReduxWrapper from "./Wrappers/Media";
import ChartReduxWrapper from "./Wrappers/Chart";
import Turntable from "./Elements/Turntable";
import SliderSlick from "./Elements/Slider";
import MasonryElement from "./Elements/Masonry";
import SocialBlock from "./Elements/Social";
import {BlockContext} from "./context";

const MediaGenerator = memo(({elementProps, pathToProps, isAdaptive, isTurntable}) => {
  const {setCounter, getCounter, isParallax, index} = useContext(BlockContext);
  const {widget, props} = elementProps;

  const fullPropsPath = useMemo(() => `${pathToProps}.props`, [pathToProps]);

  if (widget === "text" || widget === "contact") {
    setCounter("text");
    return (
      <TextReduxWrapper
        path={`structure[${index}].content.text[${getCounter("text")}]`}
        type={props?.type}
        color={isParallax && "white"}
        position={isParallax && "center"}
      />
    );
  } else if (widget === "media") {
    setCounter(widget);
    const count = getCounter(widget);
    const pathToContent = `structure[${index}].content.${widget}`;
    return (
      <MediaReduxWrapper
        path={`${pathToContent}[${count}]`}
        pathToProps={fullPropsPath}
        pathToLayout={`structure[${index}].layout`}
        pathToContent={pathToContent}
        currentIndex={count}
        isAdaptive={isAdaptive}
        isTurntable={isTurntable}
        isParallax={isParallax}
      />
    );
  } else if (widget === "chart") {
    setCounter(widget);
    return <ChartReduxWrapper chartIndex={getCounter(widget)} isAdaptive={isAdaptive} />;
  } else if (widget === "turntable") {
    setCounter("text", 2);
    setCounter("media", 2);
    setCounter("colors");
    return (
      <Turntable
        textIndex={getCounter("text")}
        mediaIndex={getCounter("media")}
        colorIndex={getCounter("colors")}
        pathToProps={fullPropsPath}
        pathToLayout={`structure[${index}].layout`}
        isTurntable={isTurntable}
        isAdaptive={isAdaptive}
      />
    );
  } else if (widget === "slider") {
    return <SliderSlick pathToProps={fullPropsPath} isAdaptive={isAdaptive} />;
  } else if (widget === "masonry") {
    return <MasonryElement pathToProps={fullPropsPath} isAdaptive={isAdaptive} />;
  } else if (widget === "social") {
    const length = elementProps.props.type.length;
    setCounter("text", length);
    const pathToContent = `structure[${index}].content.text`;
    return (
      <SocialBlock
        textIndex={getCounter("text") - length + 1}
        pathToProps={fullPropsPath}
        pathToContent={pathToContent}
      />
    );
  }
  return null;
});

const IterateContent = memo(({layout, pathToProps, isAdaptive}) => {
  const {
    fraction,
    isMobile,
    adaptiveCols,
    blockWidth,
    adaptiveWidth,
    onlyPreview,
  } = useContext(BlockContext);

  const {
    elementProps,
    contentArr,
    isTurntableContainer,
    containerIsAdaptive,
  } = useMemo(() => {
    const elementPropsObj = {
      cols: 12,
    };
    const contentArray = [];

    let containerIsAdaptiveBool = isAdaptive;
    if (!isMobile && containerIsAdaptiveBool && layout.props) {
      if (adaptiveCols && layout.props.ignoreAdaptiveCols) {
        containerIsAdaptiveBool = blockWidth < adaptiveWidth;
      }
    }

    let isTurntableCont = false;

    Object.keys(layout).forEach((key) => {
      const value = layout[key];

      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          isTurntableCont = item.widget === "turntable";
          const params = {
            layout: JSON.stringify(item),
            pathToProps: `${pathToProps}.content[${idx}]`,
            isAdaptive: containerIsAdaptiveBool,
          };
          contentArray.push(<IterateComponent {...params} />);
        });
      } else {
        elementPropsObj[key] = value;
      }
    });
    return {
      elementProps: elementPropsObj,
      contentArr: contentArray,
      isTurntableContainer: isTurntableCont,
      containerIsAdaptive: containerIsAdaptiveBool,
    };
  }, [
    adaptiveCols,
    adaptiveWidth,
    blockWidth,
    isAdaptive,
    isMobile,
    layout,
    pathToProps,
  ]);

  const params = useMemo(() => {
    const obj = {};
    if (elementProps.props && elementProps.props.fixedWidth) {
      obj.fixedWidth = elementProps.props.fixedWidth[`c${fraction}`];
    }
    if (elementProps.props && elementProps.props.autoWidth) {
      obj.autoWidth = elementProps.props.autoWidth[`c${fraction}`];
    }
    if (layout.align) {
      obj.align = layout.align;
    }
    return obj;
  }, [elementProps.props, fraction, layout.align]);

  const isTurntable = useMemo(() => elementProps.widget === "turntable", [
    elementProps.widget,
  ]);

  const ref = useTurntable(isTurntableContainer);

  return (
    <BlockContainer
      flow={elementProps.flow}
      cols={elementProps.cols[`c${fraction}`] || elementProps.cols}
      rightGap={!containerIsAdaptive && isTurntable ? 16 : 0}
      bottomGap={containerIsAdaptive && isTurntable ? 16 : 0}
      needAlignItems={isTurntable}
      isTurntable={isTurntable}
      onlyPreview={onlyPreview}
      isAdaptive={isAdaptive}
      ref={ref}
      {...params}
    >
      {contentArr}
      {contentArr.length === 0 && (
        <WidgetWrapper widget={elementProps.widget}>
          <MediaGenerator
            elementProps={elementProps}
            pathToProps={pathToProps}
            isAdaptive={containerIsAdaptive}
            isTurntable={isTurntable}
          />
        </WidgetWrapper>
      )}
    </BlockContainer>
  );
});

export const IterateComponent = memo(
  ({layout: layoutConfig, pathToProps, isAdaptive}) => {
    const {refreshCounter} = useContext(BlockContext);

    const widget = useMemo(() => {
      try {
        return JSON.parse(layoutConfig)?.widget;
      } catch (error) {
        return "";
      }
    }, [layoutConfig]);

    useEffect(() => {
      if (widget === "text" || widget === "contact") {
        refreshCounter("text");
      }
    }, [widget, refreshCounter]);

    if (!layoutConfig) return null;

    const layout = JSON.parse(layoutConfig);

    if (!layout) return null;

    return (
      <IterateContent layout={layout} pathToProps={pathToProps} isAdaptive={isAdaptive} />
    );
  }
);
