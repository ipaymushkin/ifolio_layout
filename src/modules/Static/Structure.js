import React from "react";
import {DndContainer} from "pages/Folio/styled";
import BlockContentWrapper from "modules/Block/BlockWrapper";
import {prepareStructureBlock} from "utils/prepareData";
import {iterate} from "modules/Static/iterate";
import {
  BlockWrapper,
  BlockContent,
  ContentWrapper,
  SlideParallax,
  MediaContent,
  ParallaxImage,
  ChildContent,
  LayoutWrapper,
} from "modules/Block/ParallaxContainer/styled";
import {SliderWrapper} from "components/Slider/styled";
import {defaultStaticImg, MAX_SLIDES_COUNT, parallaxSliderClassName} from "config/consts";
import {getCropperQueryString} from "utils/getCropperQueryString";
import {createWidgetPath, setScriptConfig} from "modules/Static/utils";
import {getTextFromDelta} from "utils/getTextFromDelta";
import CropImage from "modules/Block/Elements/Image/CropImage";

const ParallaxContainer = ({
  fraction,
  index,
  content,
  layout,
  scriptConfig,
  blockName,
  blockId,
  enableParallax = false,
}) => {
  const path = createWidgetPath("parallax", index, "0");
  setScriptConfig({
    config: scriptConfig,
    path,
    props: {enableParallax},
    widget: "parallax",
  });
  const isSpan = fraction === 0;
  const showControls = content.media.filter(({src}) => src).length > 1;
  return (
    <BlockWrapper
      width={fraction}
      index={index}
      data-block-id={blockId}
      data-block-name={blockName}
      isSpan={isSpan}
    >
      <BlockContent isSpan={isSpan}>
        <ContentWrapper
          isSpan={isSpan}
          id={path}
          className={`swiper-container ${parallaxSliderClassName}`}
          autoHeight={true}
        >
          <SliderWrapper isParallax={true} height={0} className="swiper-wrapper">
            {content.media.map((element, idx) => {
              let {src, crop} = element;
              if (!src) return null;
              const imgPath = `${path}-${idx}`;
              const isCropped = crop && Object.keys(crop).length > 0;
              // if (!isCropped) {
              setScriptConfig({
                config: scriptConfig,
                path: imgPath,
                widget: "image",
                props: {src: src + getCropperQueryString(crop), isParallax: true},
              });
              // } else {
              //   setScriptConfig({
              //     config: scriptConfig,
              //     path,
              //     widget: "cropper",
              //     props: {
              //       src: src + getCropperQueryString(crop),
              //       w: crop.width,
              //       h: crop.height,
              //       ignoreMaxHeight: true,
              //     },
              //   });
              // }
              return (
                <SlideParallax
                  height={0}
                  data-parallax={path}
                  key={`${path}-${idx}`}
                  className="swiper-slide"
                >
                  <MediaContent id={imgPath}>
                    {isCropped ? (
                      <CropImage
                        source={defaultStaticImg}
                        crop={crop}
                        ignoreMaxHeight={true}
                        isParallax={true}
                      />
                    ) : (
                      <ParallaxImage src={defaultStaticImg} />
                    )}
                  </MediaContent>
                  <ChildContent>
                    <LayoutWrapper isSpan={isSpan}>{layout[idx]}</LayoutWrapper>
                  </ChildContent>
                </SlideParallax>
              );
            })}
          </SliderWrapper>
          {showControls && (
            <>
              <div className="swiper-pagination" />
              <div className="swiper-button-next" />
              <div className="swiper-button-prev" />
            </>
          )}
        </ContentWrapper>
      </BlockContent>
    </BlockWrapper>
  );
};

const Block = ({config: blockConfig, index, scriptConfig}) => {
  const config = prepareStructureBlock(blockConfig);
  const {cols, props, content} = config;
  const counter = {};

  const {adaptiveCols, adaptiveWidth, noPadding} = props;

  const background =
    !props.background || Array.isArray(props.background) ? {} : props.background;

  let isAdaptive = false;
  if (adaptiveCols) {
    isAdaptive = cols !== 0 && cols <= adaptiveCols;
  }

  const createLayout = (isParallax) => (
    <>
      {iterate(
        {
          layout: config.layout,
          content,
          counter,
          index,
          scriptConfig,
          isAdaptive,
          needColsAttribute: !!adaptiveWidth,
          blockCols: cols,
          isParallax,
        },
        props
      )}
    </>
  );

  const dataParams = {
    blockId: config.id,
    blockName: getTextFromDelta(content.text[0]) || config.name,
  };

  if (props.isParallax !== undefined) {
    return (
      <ParallaxContainer
        fraction={cols}
        index={index}
        content={content}
        layout={new Array(MAX_SLIDES_COUNT)
          .fill(0)
          .map(() => createLayout(props.isParallax))}
        scriptConfig={scriptConfig}
        enableParallax={props.isParallax}
        {...dataParams}
      />
    );
  }

  return (
    <BlockContentWrapper
      layout={createLayout()}
      fraction={cols}
      background={background}
      index={index}
      isAdaptive={isAdaptive}
      adaptiveWidth={adaptiveWidth}
      noPadding={noPadding}
      scriptConfig={scriptConfig}
      {...dataParams}
    />
  );
};

export const StructureStatic = ({template, config: scriptConfig = {}}) => {
  return (
    <DndContainer>
      {template.map((config, idx) => {
        return (
          <Block
            key={`block-${idx}`}
            index={idx}
            config={config}
            scriptConfig={scriptConfig}
          />
        );
      })}
    </DndContainer>
  );
};
