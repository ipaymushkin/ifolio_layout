import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import styled, {css} from "styled-components";
import CropImage from "./Elements/Image/CropImage";
import {ExpandBackgroundImage} from "./styled";
import {createWidgetPath, setScriptConfig} from "../Static/utils";
import {getCropperQueryString} from "../../utils/getCropperQueryString";

const ExpandBlock = memo(({background, isEdit, scriptConfig, index}) => {
  const timer = useRef(null);
  const ref = useRef(null);
  const [options, setOptions] = useState({
    left: 0,
    width: 0,
  });

  const updateSize = useCallback(() => {
    const propsRef = ref.current.closest("div[data-block-id]");
    if (propsRef) {
      const {width} = propsRef.getBoundingClientRect();
      let paddingLeft = 7;
      try {
        paddingLeft = parseInt(
          window.getComputedStyle(propsRef, null).getPropertyValue("padding-left")
        );
      } catch (e) {
        //
      }
      setOptions({
        left: (document.body.clientWidth - width + paddingLeft * 2) / 2,
        width: document.body.clientWidth,
      });
    }
  }, []);

  useEffect(() => {
    updateSize();
  }, [updateSize]);

  const onResize = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clearTimeout(timer.current);
      updateSize();
    }, 250);
  }, [updateSize]);

  useEffect(() => {
    onResize();
  }, [updateSize, onResize]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer.current);
    };
  }, [onResize, updateSize]);

  const isCropped = useMemo(
    () => background.crop && Object.keys(background.crop).length > 0,
    [background.crop]
  );

  const isImage = useMemo(() => background.type === "image", [background.type]);

  const spanContent = useMemo(() => {
    let spanInner = null;
    if (isImage) {
      if (isCropped) {
        let path;
        if (scriptConfig) {
          path = createWidgetPath("cropper", index, "background");
          setScriptConfig({
            config: scriptConfig,
            path,
            widget: "cropper",
            props: {
              src: background.src + getCropperQueryString(background.crop),
              w: background.crop.width,
              h: background.crop.height,
              isBlockBackground: true,
            },
          });
        }
        spanInner = (
          <CropImage
            source={background.src}
            crop={background.crop}
            ignoreMaxHeight={true}
            isBackground={true}
            id={path}
          />
        );
      } else {
        let path;
        if (scriptConfig) {
          path = createWidgetPath("image", index, "background");
          setScriptConfig({
            config: scriptConfig,
            path,
            widget: "image",
            props: {
              src: background.src,
              isBlockBackground: true,
            },
          });
        }
        spanInner = (
          <ExpandBackgroundImage id={path} src={!scriptConfig && background.src} />
        );
      }
    }
    return spanInner;
  }, [background.crop, background.src, index, isCropped, isImage, scriptConfig]);

  return (
    <Expand
      background={background}
      isEdit={isEdit}
      left={options.left}
      width={options.width}
      data-expand
      propsRef={ref}
    >
      {spanContent}
    </Expand>
  );
});

ExpandBlock.propTypes = {
  background: PropTypes.object.isRequired,
  isEdit: PropTypes.bool,
  scriptConfig: PropTypes.any,
  index: PropTypes.number,
};

ExpandBlock.defaultProps = {
  isEdit: false,
};

const Expand = styled(({width, left, background, isEdit, propsRef, ...props}) => (
  <div {...props} ref={propsRef} />
))`
  position: absolute;
  left: ${({left}) => -left}px;
  width: ${({width}) => width}px;
  top: ${({isEdit}) => (isEdit ? "37px" : 0)};
  height: ${({isEdit}) => (isEdit ? "calc(100% - 37px)" : "100%")};
  background: #ffffff;
  z-index: -1;
  ${({background}) =>
    background.type === "color" &&
    css`
      background: ${background.src};
    `};
  ${({background}) =>
    background.type === "image" &&
    css`
      opacity: ${background.opacity};
    `};
  @media all and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    top: 0;
    height: 100%;
  }
`;
export {ExpandBlock};
