import React, {Fragment} from "react";
import BlockWrapper from "modules/Block/BlockContainer";
import {WidgetWrapper} from "modules/Block/styled";
import {defaultMediaElement, defaultTextElement} from "config/consts";
import MediaContainer from "modules/Block/Wrappers/Media/Container";
import {createWidgetPath, getCrop} from "modules/Static/utils";
import {Wrapper, ChartStyled} from "modules/Block/Elements/ChartNew/styled";
import get from "lodash/get";
import {SliderStyled, SlideStyled} from "modules/Block/Elements/Slider/styled";
import {SliderWrapper} from "components/Slider/styled";
import {MasonryItemStyled, MasonryStyled} from "modules/Block/Elements/Masonry/styled";
import {MasonryWrapper} from "components/Masonry/styled";
import quillDeltaToHtml from "utils/quillDeltaToHtml";
import {
  Wrapper as TurntableWrapper,
  Content,
  FrontSide,
  Background,
  CardContent,
  ImageWrapper,
  BackSide,
} from "modules/Block/Elements/Turntable/styled";
// import {convertDeltaToHtml} from "node-quill-converter";
import {setScriptConfig} from "modules/Static/utils";
import {getCropperQueryString} from "utils/getCropperQueryString";
import {decodeURIComponentSafe} from "utils/decodeURIComponentSafe";
import {
  IconWrapper,
  ItemWrapper,
  SocialWrapper,
} from "modules/Block/Elements/Social/styled";
import SocialIcon from "modules/Block/Elements/Social/SocialIcon";
import {handleLinkOrigin} from "utils/handleLinkOrigin";
import {isEmptyQuillDelta} from "utils/isEmptyQuillDelta";

const setCounter = (counter, type, count = 1) =>
  counter[type] === undefined ? (counter[type] = 0) : (counter[type] += count);

const generateMedia = ({
  media,
  shape,
  type,
  fixedSize = false,
  index,
  scriptConfig,
  isHero,
  aspect,
  ignoreMaxHeight,
  isTurntable = false,
  border,
  props,
}) => {
  let path = "";
  const crop = getCrop(media);
  const {iconParams} = media;
  if (media.src) {
    if (type !== "video") {
      if (!iconParams || Object.keys(iconParams).length === 0) {
        const params = {};
        if (aspect) params.aspect = aspect;
        if (Object.keys(crop).length > 0) {
          const imgIdx = Object.keys(scriptConfig["cropper"]).length;
          path = createWidgetPath("cropper", index, imgIdx);
          setScriptConfig({
            config: scriptConfig,
            path,
            widget: "cropper",
            props: {
              src: media.src + getCropperQueryString(crop),
              w: crop.width,
              h: crop.height,
              fit: media.fit || false,
              ...params,
              ignoreMaxHeight,
            },
          });
        } else {
          const imgIdx = Object.keys(scriptConfig["image"]).length;
          path = createWidgetPath("image", index, imgIdx);
          setScriptConfig({
            config: scriptConfig,
            path,
            widget: "image",
            props: {src: media.src, ignoreMaxHeight, fit: media.fit || false, ...params},
          });
        }
      } else {
        const iconIdx = Object.keys(scriptConfig["icon"]).length;
        path = createWidgetPath("icon", index, iconIdx);
        setScriptConfig({
          config: scriptConfig,
          path,
          widget: "icon",
          props: {src: media.src},
        });
      }
    }
  }

  return (
    <MediaContainer
      crop={getCrop(media)}
      iconParams={iconParams}
      isHero={isHero}
      fixedSize={fixedSize}
      shape={shape}
      config={{...props, ...media}}
      type={type}
      staticPath={path}
      scriptConfig={scriptConfig}
      ignoreMaxHeight={ignoreMaxHeight}
      isTurntable={isTurntable}
      avatarBorder={border}
      fit={media.fit || false}
      aspect={media.selectedAspect}
      index={index}
    />
  );
};

const createTextWidget = ({
  counter,
  content,
  type,
  color = "",
  position,
  index,
  scriptConfig,
  isHero,
}) => {
  setCounter(counter, "text");
  const text = content.text[counter["text"]] || defaultTextElement;
  let html,
    isHtml = false,
    path;
  if (typeof text === "string") {
    isHtml = true;
    setCounter(counter, "html");
    path = createWidgetPath("html", index, counter["html"]);
    setScriptConfig({
      config: scriptConfig,
      path,
      widget: "html",
      // props: btoa(text),
      props: Buffer.from(text).toString("base64"),
    });
  } else if (!isEmptyQuillDelta(text.text)) {
    const ops = text.text.ops.map((element) => {
      return {
        ...element,
        insert: decodeURIComponentSafe(element.insert),
      };
    });
    html = decodeURIComponentSafe(quillDeltaToHtml({ops}));
  }

  if (!isHtml && !html) return null;
  let className = `text-wrapper`;
  if (!isHtml) {
    className += ` ql-editor ql-editor-${type} ql-editor-${position} ql-editor-${color}`;
  }
  if (isHero) {
    className += ` ql-editor-is-hero-text`;
  }
  return (
    <div
      id={path}
      data-isherotext={true}
      className={className}
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
};

export const generateWidget = (
  {
    elementProps,
    counter,
    content,
    index,
    scriptConfig,
    isHero,
    blockCols = 12,
    isParallax,
  },
  widgetProps = {}
) => {
  const {widget, props = {}} = elementProps;
  if (widget) {
    if (widget === "media") {
      setCounter(counter, widget);
      const media = content.media[counter[widget]] || defaultMediaElement;
      const type = widgetProps.type || props.type || media.type;
      const shape = widgetProps.shape || props.shape || media.shape;
      return generateMedia({
        media,
        type,
        shape,
        index,
        scriptConfig,
        isHero,
        props,
        aspect:
          media.selectedAspect || (props && props.aspect ? props.aspect : undefined),
        ignoreMaxHeight: props ? props.ignoreMaxHeight : false,
        border: widgetProps.border,
      });
    } else if (widget === "text" || widget === "contact") {
      return createTextWidget({
        content,
        counter,
        type: props?.type,
        color: isParallax && "white",
        position: isParallax && "center",
        index,
        scriptConfig,
        isHero,
      });
    } else if (widget === "chart") {
      setCounter(counter, widget);
      const filteredContent = content.custom.filter(({type}) => type === widget);
      const path = createWidgetPath("chart", index, counter[widget]);
      const chartConfig = filteredContent[counter[widget]];
      setScriptConfig({
        config: scriptConfig,
        path,
        props: get(chartConfig, "props", {}),
        widget,
      });
      return (
        <Wrapper>
          <ChartStyled id={path} />
        </Wrapper>
      );
    } else if (widget === "masonry") {
      const path = createWidgetPath(widget, index, "0");
      const fraction = elementProps.cols;
      setScriptConfig({
        config: scriptConfig,
        path,
        props: {columns: elementProps.props.columns[`c${fraction}`], fraction},
        widget,
      });
      return (
        <MasonryStyled>
          <MasonryWrapper id={path}>
            {content.media.map((element, idx) => {
              if (!element.src) return "";
              return (
                <MasonryItemStyled
                  key={`masonry-element-${index}-${idx}`}
                  padding={fraction === 12 || fraction === 0 ? "12px" : "8px"}
                >
                  {generateMedia({
                    media: element,
                    type: element.type,
                    index,
                    scriptConfig,
                    isHero,
                  })}
                </MasonryItemStyled>
              );
            })}
          </MasonryWrapper>
        </MasonryStyled>
      );
    } else if (widget === "slider") {
      const path = createWidgetPath(widget, index, "0");
      const {aspect, withText} = elementProps.props;
      const slidesToShow = elementProps.props.slidesToShow[`c${blockCols}`];
      setScriptConfig({
        config: scriptConfig,
        path,
        props: {
          slidesToShow,
        },
        widget,
      });
      const filteredMedia = content.media.filter(({src}) => src);
      return (
        <SliderStyled>
          <div
            className="swiper-container"
            id={path}
            data-aspect={aspect}
            // data-no-resize={!!withText}
          >
            <SliderWrapper className={`swiper-wrapper`}>
              {filteredMedia.map((element, idx) => {
                const shape = get(elementProps, "props.shape") || element.shape;
                const type = get(elementProps, "props.type") || element.type;
                let innerContent;
                if (withText) {
                  innerContent = (
                    <BlockWrapper cols={12} flow={"vertical"}>
                      {generateMedia({
                        media: element,
                        shape,
                        type,
                        index,
                        scriptConfig,
                        isHero,
                        aspect,
                      })}
                      {createTextWidget({content, counter, type: "description"})}
                    </BlockWrapper>
                  );
                } else {
                  innerContent = generateMedia({
                    media: element,
                    shape,
                    type,
                    index,
                    scriptConfig,
                    isHero,
                    aspect,
                  });
                }
                return (
                  <SlideStyled
                    className="swiper-slide"
                    // slidesToShow={elementProps.props.slidesToShow[`c${elementProps.cols}`]}
                    slidesToShow={slidesToShow}
                    key={`slide-${index}-${idx}`}
                  >
                    {innerContent}
                  </SlideStyled>
                );
              })}
            </SliderWrapper>
            <div className="swiper-button-next" />
            <div className="swiper-button-prev" />
          </div>
        </SliderStyled>
      );
    } else if (widget === "turntable") {
      setCounter(counter, "media");
      const media1 = content.media[counter["media"]] || defaultMediaElement;

      setCounter(counter, "media");
      const media2 = content.media[counter["media"]] || defaultMediaElement;
      const shape2 =
        widgetProps.shape || props.avatarShape || props.shape || media2.shape;

      const text1 = createTextWidget({
        content,
        counter,
        type: "title",
        color: "white",
        position: "center",
      });

      const text2 = createTextWidget({
        content,
        counter,
        type: "title",
        color: "white",
        position: "center",
      });

      setCounter(counter, "colors");
      let color = "#25bec8";
      if (content.colors && content.colors[`c${counter["colors"]}`]) {
        color = content.colors[`c${counter["colors"]}`];
      }

      return (
        <TurntableWrapper isEdit={false}>
          <Content data-container={true}>
            <FrontSide>
              <Background>
                {generateMedia({
                  media: media1,
                  type: media1.type,
                  shape: "",
                  index,
                  scriptConfig,
                  isHero,
                  isTurntable: true,
                })}
              </Background>
              <CardContent data-turntable={true}>
                <ImageWrapper>
                  {generateMedia({
                    media: {
                      ...media2,
                      size: props.size,
                    },
                    type: "avatar",
                    shape: shape2,
                    index,
                    scriptConfig,
                    isHero,
                    fixedSize: 1,
                  })}
                </ImageWrapper>
                {text1}
              </CardContent>
            </FrontSide>
            <BackSide color={color}>
              <CardContent data-turntable={true}>{text2}</CardContent>
            </BackSide>
          </Content>
        </TurntableWrapper>
      );
    } else if (widget === "social") {
      const types = elementProps.props.type;
      setCounter(counter, "text");
      const texts = types.map(() => {
        const text = content.text[counter["text"]];
        setCounter(counter, "text");
        return get(text, "text.ops[0].insert", "");
      });
      const path = createWidgetPath(widget, index, "0");
      return (
        <SocialWrapper>
          {types.map((type, idx) => {
            const link = handleLinkOrigin(texts[idx]);
            if (!link) return null;
            return (
              <a
                key={path + "-" + idx}
                href={decodeURIComponent(link)}
                target={"_blank"}
                rel={"noopener noreferrer"}
              >
                <ItemWrapper>
                  <IconWrapper isEdit={false}>
                    <SocialIcon type={type} />
                  </IconWrapper>
                </ItemWrapper>
              </a>
            );
          })}
        </SocialWrapper>
      );
    }
    return null;
  }
  return null;
};

export const iterate = (
  {
    counter,
    content,
    layout,
    index = "hero",
    scriptConfig,
    isHero = false,
    isAdaptive,
    needColsAttribute,
    blockCols,
    isParallax,
  },
  props = {}
) => {
  const contentArr = [],
    elementProps = {
      cols: 12,
    };

  let containerIsAdaptive = isAdaptive;
  if (containerIsAdaptive && layout.props && layout.props.ignoreAdaptiveCols) {
    containerIsAdaptive = false;
  }

  let isTurntableContainer = false;

  Object.keys(layout).forEach((key) => {
    const value = layout[key];

    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        isTurntableContainer = item.widget === "turntable";
        contentArr.push(
          <Fragment key={`fragment-${index}-${idx}`}>
            {iterate(
              {
                layout: item,
                counter,
                content,
                index,
                scriptConfig,
                isHero,
                isAdaptive: containerIsAdaptive,
                needColsAttribute,
                blockCols,
                isParallax,
              },
              props
            )}
          </Fragment>
        );
      });
    } else {
      elementProps[key] = value;
    }
  });

  const isTurntable = elementProps.widget === "turntable";

  return (
    <BlockWrapper
      cols={elementProps.cols[`c${blockCols}`] || elementProps.cols}
      flow={elementProps.flow}
      // rightGap={isTurntable ? 16 : 0}
      // bottomGap={isTurntable ? 16 : 0}
      rightGap={0}
      bottomGap={0}
      isAdaptive={isAdaptive}
      needColsAttribute={(!isAdaptive && needColsAttribute) || isTurntable}
      isTurntable={isTurntable}
      isTurntableContainer={isTurntableContainer}
      align={layout?.align}
    >
      {contentArr}
      {contentArr.length === 0 && (
        <WidgetWrapper widget={elementProps.widget}>
          {generateWidget(
            {
              elementProps,
              counter,
              content,
              index,
              scriptConfig,
              isHero,
              blockCols,
              isParallax,
            },
            props
          )}
        </WidgetWrapper>
      )}
    </BlockWrapper>
  );
};
