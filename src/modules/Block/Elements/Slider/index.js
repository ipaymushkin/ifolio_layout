import React, {useRef, memo, useMemo, useContext} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import get from "lodash/get";
import MediaReduxWrapper from "modules/Block/Wrappers/Media";
import {defaultMediaAvatarElement, defaultMediaElement} from "config/consts";
import {Slider} from "components/Slider";
import {SliderStyled, SlideStyled} from "modules/Block/Elements/Slider/styled";
import BlockContainer from "modules/Block/BlockContainer";
import TextReduxWrapper from "modules/Block/Wrappers/Text";
import {WidgetWrapper} from "../../styled";
import {BlockContext} from "../../context";

const maxMediaElements = 10;

const Item = memo(
  ({
    isEdit,
    index,
    pathToContent,
    pathToProps,
    blockIndex,
    aspect,
    withText,
    startTextIndex,
    isAdaptive,
    fraction,
  }) => {
    const mediaComponent = (
      <MediaReduxWrapper
        pathToContent={`${pathToContent}.media`}
        isEdit={isEdit}
        path={`${pathToContent}.media[${index}]`}
        currentIndex={index}
        pathToProps={pathToProps}
        maxElements={maxMediaElements}
        defaultAspect={aspect}
        blockIndex={blockIndex}
        isAdaptive={isAdaptive}
        fraction={fraction}
      />
    );
    if (withText) {
      return (
        <BlockContainer flow={"vertical"} cols={12}>
          <WidgetWrapper>{mediaComponent}</WidgetWrapper>
          <WidgetWrapper>
            <TextReduxWrapper
              isEdit={isEdit}
              path={`${pathToContent}.text[${index + startTextIndex}]`}
              blockIndex={blockIndex}
              type={"description"}
            />
          </WidgetWrapper>
        </BlockContainer>
      );
    }
    return mediaComponent;
  }
);

export const SliderSlick = memo(({pathToProps, isAdaptive}) => {
  const {index: blockIndex, fraction, isEdit} = useContext(BlockContext);

  const ref = useRef(null);
  // const [height, setHeight] = useState(0);
  const pathToContent = useMemo(() => `structure[${blockIndex}].content`, [blockIndex]);

  const pathToContentMedia = useMemo(() => `${pathToContent}.media`, [pathToContent]);

  const content = useSelector((state) => get(state.folio, pathToContentMedia, []));
  const props = useSelector((state) => get(state.folio, pathToProps, {}));
  const aspect = useMemo(() => props.aspect || 1.33, [props.aspect]);

  const notEmpty = useMemo(() => content.some(({src}) => src), [content]);

  const items = useMemo(
    () =>
      (notEmpty
        ? content
        : [
            props.type === "avatar"
              ? defaultMediaAvatarElement(props.shape)
              : defaultMediaElement,
          ]
      ).slice(0, maxMediaElements),
    [content, notEmpty, props.shape, props.type]
  );

  const slidesToShow = useMemo(
    () => (isAdaptive ? 1 : props.slidesToShow[`c${fraction}`]),
    [fraction, isAdaptive, props.slidesToShow]
  );

  return (
    <SliderStyled isAdaptive={isAdaptive} ref={ref}>
      <Slider
        {...props}
        isAdaptive={isAdaptive}
        fraction={fraction}
        draggable={!isEdit}
        slidesToShow={slidesToShow}
        navigation={true}
        loop={!props.withText}
      >
        {items.map((item, i) => {
          if (!item.src && notEmpty) return null;
          return (
            <SlideStyled
              // height={height}
              isAdaptive={isAdaptive}
              slidesToShow={1}
              type={props.type}
              key={`slider-element-${blockIndex}-${i}`}
            >
              <Item
                isEdit={isEdit}
                pathToContent={pathToContent}
                index={i}
                pathToProps={pathToProps}
                blockIndex={blockIndex}
                aspect={aspect}
                isAdaptive={isAdaptive}
                fraction={fraction}
                withText={props.withText}
                startTextIndex={props.startTextIndex}
              />
            </SlideStyled>
          );
        })}
      </Slider>
    </SliderStyled>
  );
});

SliderSlick.propTypes = {
  pathToProps: PropTypes.string.isRequired,
  isAdaptive: PropTypes.bool,
};

SliderSlick.defaultProps = {
  isAdaptive: false,
};
export default SliderSlick;
