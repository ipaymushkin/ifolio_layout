import React from "react";
import HeroWrapper from "pages/Folio/Hero/Container";
import MediaContainer from "modules/Block/Wrappers/Media/Container";
import {iterate} from "modules/Static/iterate";
import {HeroContentWrapper} from "modules/HeroBlock/styled";
import {createWidgetPath, getCrop, setScriptConfig} from "modules/Static/utils";
import {prepareBlock} from "utils/prepareData";
import {getCropperQueryString} from "utils/getCropperQueryString";
import {getTextFromDelta} from "utils/getTextFromDelta";

export const HeroStatic = ({hero: heroConfig, config: scriptConfig}) => {
  if (!heroConfig) return "";
  const hero = prepareBlock(heroConfig, true);
  const {props} = hero;

  const background = (
    <>
      {props.background.map((item, index) => {
        const crop = getCrop(item);
        let path;
        const widgetPath = `hero_${index}`;
        if (item.type === "image") {
          if (Object.keys(crop).length > 0) {
            const imgIdx = Object.keys(scriptConfig["cropper"]).length;
            path = createWidgetPath("cropper", widgetPath, imgIdx);
            setScriptConfig({
              config: scriptConfig,
              path,
              widget: "cropper",
              props: {
                src: item.src + getCropperQueryString(crop),
                w: crop.width,
                h: crop.height,
                isHero: true,
              },
            });
          } else {
            const imgIdx = Object.keys(scriptConfig["image"]).length;
            path = createWidgetPath("image", widgetPath, imgIdx);
            setScriptConfig({
              config: scriptConfig,
              path,
              widget: "image",
              props: {src: item.src, isHero: true},
            });
          }
        }
        return (
          <MediaContainer
            key={`hero-background-${widgetPath}`}
            crop={crop}
            avatarShape={""}
            isHero={true}
            fixedSize={false}
            shape={"square"}
            config={item}
            type={item.type}
            staticPath={path}
            scriptConfig={scriptConfig}
            index={"hero"}
          />
        );
      })}
    </>
  );

  const counter = {};

  const content = (
    <HeroContentWrapper>
      {iterate(
        {layout: hero.layout, content: hero.content, counter, scriptConfig, isHero: true},
        {shape: props.avatarShape, border: props.avatarBorder}
      )}
    </HeroContentWrapper>
  );

  return (
    <HeroWrapper
      height={props.height}
      background={background}
      content={content}
      blockId={hero.id}
      blockName={getTextFromDelta(hero.content.text[0]) || hero.name}
    />
  );
};
