import React, {memo, useMemo} from "react";
import PropTypes from "prop-types";
import Image from "modules/Block/Elements/Image";
import Video from "modules/Block/Elements/Video";
import styled, {css} from "styled-components";
import {getCropperQueryString} from "utils/getCropperQueryString";
import {defaultStaticImg} from "config/consts";

const MediaContainer = memo(
  ({
    type,
    controller,
    config,
    crop,
    shape,
    fixedSize,
    avatarShape,
    isHero,
    iconParams,
    staticPath,
    avatarBorder,
    fraction,
    isAdaptive,
    scriptConfig,
    onlyPreview,
    ignoreMaxHeight,
    isTurntable,
    aspect,
    fit,
    index,
  }) => {
    // border's width for hero = 4px and 1px for others
    const avatarBorderWidth = useMemo(() => (avatarBorder && isHero ? 4 : avatarBorder), [
      avatarBorder,
      isHero,
    ]);
    return (
      <Wrapper type={type} size={config.size} isHero={isHero}>
        <ContentWrapper type={type}>
          {controller}
          {(type === "image" || type === "gif" || type === "icon") && (
            <Image
              aspect={aspect}
              staticPath={staticPath}
              source={
                type === "gif"
                  ? config.src
                  : !config.src
                  ? config.src
                  : config.src + getCropperQueryString(crop)
              }
              shape={shape}
              size={config.size}
              crop={JSON.stringify(crop)}
              fixedSize={fixedSize}
              isTurntable={isTurntable}
              iconParams={JSON.stringify(iconParams)}
              fraction={fraction}
              isAdaptive={isAdaptive}
              ignoreMaxHeight={ignoreMaxHeight}
              isHero={isHero}
              fit={fit}
              type={type}
            />
          )}
          {type === "video" && (
            <Video
              source={config.src}
              isHero={isHero}
              thumbnail={config.thumbnail || defaultStaticImg}
              staticPath={staticPath}
              scriptConfig={scriptConfig}
              onlyPreview={onlyPreview}
              index={index}
            />
          )}
          {type === "avatar" && (
            <AvatarWrapper shape={avatarShape || shape} border={avatarBorderWidth}>
              {config.type === "video" && (
                <Video
                  source={config.src}
                  isHero={isHero}
                  thumbnail={config.thumbnail || defaultStaticImg}
                  staticPath={staticPath}
                  scriptConfig={scriptConfig}
                  onlyPreview={onlyPreview}
                  border={avatarBorderWidth}
                />
              )}
              {config.type !== "video" && (
                <Image
                  border={avatarBorderWidth}
                  staticPath={staticPath}
                  source={config.src + getCropperQueryString(crop)}
                  shape={avatarShape || shape}
                  size={config.size}
                  crop={JSON.stringify(crop)}
                  iconParams={JSON.stringify(iconParams)}
                  fixedSize={fixedSize}
                />
              )}
            </AvatarWrapper>
          )}
        </ContentWrapper>
      </Wrapper>
    );
  }
);

const Wrapper = styled(({type, isHero, ...props}) => <div {...props} />)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  ${({type}) =>
    type === "parallax"
      ? css`
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        `
      : null};
  ${({type}) =>
    type === "avatar"
      ? css`
          margin: 0 auto;
          max-width: ${({size}) => (size ? size : "236px")};
          max-height: ${({size}) => (size ? size : "236px")};
          @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
            max-width: 124px;
            max-height: 124px;
          }
        `
      : null};
  ${({isHero, type}) =>
    isHero && type === "avatar"
      ? css`
          max-width: ${({size}) => (size ? size : "200px")};
          max-height: ${({size}) => (size ? size : "200px")};
          @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
            max-width: 18vw;
            max-height: 18vw;
          }
          @media screen and (max-width: ${({theme}) => theme.breakpoints.values.sm}px) {
            max-width: 120px;
            max-height: 120px;
          }
        `
      : null};
`;
const ContentWrapper = styled(({type, ...props}) => <div {...props} />)`
  position: relative;
  width: 100%;
  ${({type}) =>
    type === "avatar"
      ? css`
          padding-bottom: 100%;
        `
      : null};
`;
const AvatarWrapper = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  ${({shape}) =>
    shape === "circle"
      ? css`
          border-radius: 50%;
          overflow: hidden;
          border: ${(props) => props.border + "px solid #FFFFFF"};
        `
      : null};
`;

MediaContainer.propTypes = {
  type: PropTypes.string,
  controller: PropTypes.element,
  config: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  crop: PropTypes.object.isRequired,
  iconParams: PropTypes.object,
  shape: PropTypes.string,
  fixedSize: PropTypes.bool.isRequired,
  avatarShape: PropTypes.string,
  isHero: PropTypes.bool.isRequired,
  staticPath: PropTypes.string,
  avatarBorder: PropTypes.number,
  fraction: PropTypes.number,
  isAdaptive: PropTypes.bool,
  scriptConfig: PropTypes.object,
  onlyPreview: PropTypes.bool,
  ignoreMaxHeight: PropTypes.bool,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

MediaContainer.defaultProps = {
  type: "",
  iconParams: {},
  shape: "",
  staticPath: "",
  avatarBorder: 0,
  fraction: 12,
  isAdaptive: false,
  onlyPreview: false,
  ignoreMaxHeight: false,
};

export default MediaContainer;
