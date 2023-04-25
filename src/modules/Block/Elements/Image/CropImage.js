import React, {forwardRef, memo, useMemo} from "react";
import PropTypes from "prop-types";
import {defaultStaticImg, imageMaxHeight} from "config/consts";
import styled, {css} from "styled-components";

const CropImage = memo(
  forwardRef(
    (
      {
        height,
        id,
        crop,
        source,
        alt,
        ignoreMaxHeight,
        isTurntable,
        isHero,
        fixedSize,
        isParallax,
        isBackground,
        fit,
        aspect,
      },
      ref
    ) => {
      const stylesObj = useMemo(() => {
        let styles = {};
        if (!fit) {
          styles = {
            height: "100%",
            // width: !fixedSize && !isHero && !isParallax && !isBackground ? "auto" : "100%",
            width: "100%",
            objectFit: isBackground ? "contain" : "cover",
          };
        } else {
          styles = {
            width: "100%",
            objectFit: "cover",
          };
        }

        if (fit) {
          styles.maxHeight = imageMaxHeight;
        }
        return styles;
      }, [fit, isBackground]);

      return (
        <CropArea
          ref={ref}
          isTurntable={isTurntable}
          isHero={isHero}
          height={height}
          isParallax={isParallax}
          isBackground={isBackground}
          id={id}
          aspect={aspect}
        >
          <CropImageWrapper {...crop.imagePosition} isHero={isHero}>
            <img
              src={id ? defaultStaticImg : source}
              alt={alt}
              style={stylesObj}
              loading="lazy"
            />
          </CropImageWrapper>
        </CropArea>
      );
    }
  )
);

const CropImageWrapper = styled.div`
  position: relative;
  left: ${({x}) => x || 0}%;
  top: ${({y}) => y || 0}%;
  width: ${({width}) => width || 100}%;
  height: ${({height}) => height || 100}%;

  ${({isHero}) =>
    isHero &&
    css`
      position: static;
      img {
        object-fit: cover;
        //margin-left: auto;
        //margin-right: auto;
        //width: auto !important;
      }
    `};
`;

const CropArea = styled.div`
  width: 100%;
  height: ${({height, isTurntable, isHero, isParallax, isBackground, aspect}) =>
    isTurntable || isParallax || isBackground
      ? "100%"
      : isHero
      ? "100%"
      : aspect
      ? "auto"
      : height + "px"};
  position: relative;
  background-color: transparent;
  overflow: hidden;
  ${({aspect}) =>
    aspect &&
    css`
      aspect-ratio: ${aspect};
    `}
`;

CropImage.propTypes = {
  height: PropTypes.number,
  id: PropTypes.string,
  crop: PropTypes.object,
  source: PropTypes.string.isRequired,
  alt: PropTypes.string,
  ignoreMaxHeight: PropTypes.bool,
  isParallax: PropTypes.bool,
  isBackground: PropTypes.bool,
};

CropImage.defaultProps = {
  id: "",
  alt: "",
  ignoreMaxHeight: false,
  crop: {},
  isParallax: false,
  isBackground: false,
};

export default CropImage;
