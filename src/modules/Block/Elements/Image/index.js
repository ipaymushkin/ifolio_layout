import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled, {css} from "styled-components";
import PropTypes from "prop-types";
import {defaultStaticImg, imageMaxHeight, imageToScreenRelation} from "config/consts";
import {switchShape} from "utils/switchShape";
import IconGenerator from "components/IconGenerator";
import {addQueryParam} from "utils/addQueryParams";
import {isSvgOrGif} from "utils/isSvgOrGif";
import {getImageWidth} from "utils/getImageWidth";
import CropImageComponent from "./CropImage";

const ImageRender = memo(
  ({
    source,
    alt,
    staticPath,
    fixedSize,
    ignoreMaxHeight,
    isHero,
    isTurntable,
    type,
    fit,
  }) => {
    const styles = useMemo(() => {
      let stylesObj = {
        width: "100%",
      };
      if (fit && !fixedSize && !ignoreMaxHeight && !isHero && !isTurntable) {
        stylesObj.maxHeight = imageMaxHeight;
      }
      return stylesObj;
    }, [fit, fixedSize, ignoreMaxHeight, isHero, isTurntable]);

    if (staticPath) {
      return (
        <img
          src={defaultStaticImg}
          alt={alt}
          style={{...styles}}
          id={staticPath}
          loading="lazy"
        />
      );
    }
    if (typeof source === "function") {
      const Source = source;

      return <Source />;
    }

    return <img src={source} alt={alt} style={{...styles}} loading="lazy" />;
  }
);

const CroppedImage = memo(
  ({
    source,
    alt,
    crop,
    staticPath,
    ignoreMaxHeight,
    isHero,
    isTurntable,
    fixedSize,
    fit,
    aspect,
  }) => {
    const ref = useRef(null);
    const timer = useRef(null);
    const [height, setHeight] = useState(0);

    const updateSize = useCallback(() => {
      if (ref.current) {
        const box = ref.current.getBoundingClientRect();
        if (aspect) {
          setHeight(box.width / aspect);
        } else {
          const relation = crop.height / crop.width;
          if (fit) {
            const relationHeight = window.innerHeight * imageToScreenRelation;
            setHeight(
              ignoreMaxHeight || box.width * relation < relationHeight
                ? box.width * relation
                : relationHeight
            );
          } else {
            setHeight(box.width * relation);
          }
        }
      }
    }, [aspect, crop.height, crop.width, fit, ignoreMaxHeight]);

    useEffect(() => {
      if (ref.current) {
        updateSize();
        window.addEventListener("resize", () => {
          clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            clearTimeout(timer.current);
            updateSize();
          }, 100);
        });
      }
    }, [crop, updateSize]);

    useEffect(() => {
      return () => {
        clearTimeout(timer.current);
        window.removeEventListener("resize", updateSize);
      };
    }, [updateSize]);

    return (
      <CropImageComponent
        id={staticPath}
        ignoreMaxHeight={ignoreMaxHeight}
        height={height}
        crop={crop}
        source={source}
        alt={alt}
        ref={ref}
        isHero={isHero}
        isTurntable={isTurntable}
        fixedSize={fixedSize}
        fit={fit}
        aspect={aspect}
      />
    );
  }
);

const ImageContent = memo(
  ({
    cropConfig,
    source,
    alt,
    iconParamsConfig,
    staticPath,
    fixedSize,
    ignoreMaxHeight,
    isHero,
    isTurntable,
    fit,
    aspect,
    type,
  }) => {
    if (Object.keys(iconParamsConfig).length > 0) {
      return (
        <IconWrapper>
          <IconGenerator
            src={source}
            fill={iconParamsConfig.fill}
            border={iconParamsConfig.border}
            color={iconParamsConfig.color}
            borderWidth={iconParamsConfig.borderWidth}
            iconWidth={iconParamsConfig.iconWidth}
            staticPath={staticPath}
          />
        </IconWrapper>
      );
    } else if (Object.keys(cropConfig).length > 0) {
      return (
        <CroppedImage
          source={source}
          alt={alt}
          crop={cropConfig}
          staticPath={staticPath}
          ignoreMaxHeight={ignoreMaxHeight}
          isHero={isHero}
          isTurntable={isTurntable}
          fixedSize={fixedSize}
          fit={fit}
          aspect={aspect}
        />
      );
    }
    return (
      <ImageRender
        source={source}
        alt={alt}
        staticPath={staticPath}
        fixedSize={fixedSize}
        ignoreMaxHeight={ignoreMaxHeight}
        isHero={isHero}
        isTurntable={isTurntable}
        aspect={aspect}
        type={type}
        fit={fit}
      />
    );
  }
);

const Image = memo(
  ({
    source = defaultStaticImg,
    size,
    alt,
    shape,
    border,
    borderColor,
    crop,
    fixedSize,
    iconParams,
    staticPath,
    fraction,
    isAdaptive,
    ignoreMaxHeight,
    isHero,
    isTurntable,
    aspect,
    fit,
    type,
  }) => {
    const [height, setHeight] = useState(0);
    const ref = useRef(null);
    const timer = useRef(null);
    const [query, setQuery] = useState(100);

    const cropConfig = useMemo(() => JSON.parse(crop), [crop]);

    const iconParamsConfig = useMemo(() => JSON.parse(iconParams), [iconParams]);

    const notCropped = useMemo(() => crop === "[]" || crop === "{}" || !crop, [crop]);

    const src = useMemo(() => {
      if (height === 0 && !staticPath && Object.keys(iconParamsConfig).length === 0) {
        return defaultStaticImg;
      } else if (isSvgOrGif(source) || Object.keys(iconParamsConfig).length > 0) {
        return source;
      }
      return addQueryParam(source, "width", query);
    }, [height, iconParamsConfig, query, source, staticPath]);

    const updateSize = useCallback(
      (isInit) => {
        const screenRel =
          Math.ceil((window.screen.width / window.innerWidth) * 100) / 100;
        const {width} = ref.current.getBoundingClientRect();
        setQuery(width === 0 ? 100 : getImageWidth(width * screenRel));
        if (fixedSize && notCropped) {
          if (aspect) {
            setHeight(Math.round(width / aspect));
          } else {
            const relationHeight = window.innerHeight * imageToScreenRelation;
            setHeight(
              ignoreMaxHeight || Math.round((width * fixedSize) / 100) < relationHeight
                ? Math.round((width * fixedSize) / 100)
                : relationHeight
            );
          }
        } else if (isInit) {
          setHeight(1);
        }
      },
      [aspect, fixedSize, ignoreMaxHeight, notCropped]
    );

    const onResize = useCallback(
      (isInit = false, time = 250) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          clearTimeout(timer.current);
          updateSize(isInit);
        }, time);
      },
      [updateSize]
    );

    useEffect(() => {
      onResize(false, 50);
    }, [source, updateSize, isAdaptive, fraction, onResize]);

    useEffect(() => {
      updateSize(true);
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(timer.current);
      };
    }, [onResize, updateSize]);

    return (
      <ImageStyled
        ref={ref}
        propsRef={ref}
        size={size}
        shape={shape}
        border={border}
        borderColor={borderColor}
        fixedSize={fixedSize}
        isHero={isHero}
        height={height}
        notCropped={notCropped}
        isTurntable={isTurntable}
      >
        <ImageContent
          cropConfig={cropConfig}
          iconParamsConfig={iconParamsConfig}
          alt={alt}
          source={src}
          staticPath={staticPath}
          fixedSize={fixedSize}
          ignoreMaxHeight={ignoreMaxHeight}
          isHero={isHero}
          isTurntable={isTurntable}
          fit={fit}
          aspect={aspect}
          type={type}
        />
      </ImageStyled>
    );
  }
);

const IconWrapper = styled.div`
  width: 124px;
  height: 124px;
`;

const ImageStyled = styled(
  ({
    shape,
    border,
    borderColor,
    /* needPadding,*/ fixedSize,
    propsRef,
    height,
    notCropped,
    isHero,
    isTurntable,
    // fit,
    ...props
  }) => {
    return <div {...props} ref={propsRef} />;
  }
)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: ${({size}) => size};
  height: ${({size, fixedSize, height, notCropped, isHero}) => {
    return isHero ? "100%" : fixedSize && notCropped ? height + "px" : size;
  }};
  border: ${(props) => props.border}px solid ${({theme}) => theme.colors.main};
  border-color: ${({borderColor}) => borderColor};
  overflow: hidden;
  border-radius: ${(props) => switchShape(props.shape)};
  position: ${({fixedSize}) => (fixedSize ? "relative" : "")};
    //padding-bottom: ${({needPadding, fixedSize}) =>
      needPadding ? `${fixedSize}%` : ""};
  ${({shape}) =>
    shape === "circle"
      ? css`
          max-width: ${({size}) => size};
          max-height: ${({size}) => size};
          width: 100%;
          height: 100%;
        `
      : css``} 
  img {
    ${({fixedSize, isHero, isTurntable}) => {
      if (fixedSize || isHero || isTurntable) {
        return `
          height: 100%;
          width: 100%;
          object-fit: cover;
        `;
      }
      return `
        display: block;
        margin: 0 auto;
        object-fit: cover;
      `;
    }}
    text-align: center;
    position: ${({fixedSize}) => (fixedSize ? "absolute" : "")};
    right: ${({fixedSize}) => (fixedSize ? "0" : "")};
    left: ${({fixedSize}) => (fixedSize ? "0" : "")};
    top: ${({fixedSize}) => (fixedSize ? "0" : "")};
    bottom: ${({fixedSize}) => (fixedSize ? "0" : "")};   
  }
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    img {
      max-height: unset !important;
    }
  }
  @media print {
    page-break-inside: avoid;
    position: relative;
  }
`;

Image.propTypes = {
  source: PropTypes.string,
  size: PropTypes.string,
  alt: PropTypes.string,
  shape: PropTypes.oneOf(["rectangle", "square", "circle", ""]),
  border: PropTypes.number,
  borderColor: PropTypes.string,
  crop: PropTypes.string,
  iconParams: PropTypes.string,
  fixedSize: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  fraction: PropTypes.number,
  isAdaptive: PropTypes.bool,
  ignoreMaxHeight: PropTypes.bool,
};

Image.defaultProps = {
  source: defaultStaticImg,
  size: "100%",
  alt: "img",
  shape: "",
  border: 0,
  crop: "{}",
  iconParams: "{}",
  fixedSize: false,
  fraction: 12,
  isAdaptive: false,
  ignoreMaxHeight: false,
};

export default Image;
