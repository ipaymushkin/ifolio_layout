import React, {forwardRef, memo, useContext, useMemo} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {css} from "styled-components";
import {generateBackground} from "../../utils/generateBlockBackground";
import {getCropperQueryString} from "../../utils/getCropperQueryString";
import {ExpandBlock} from "./ExpandBlock";
import {BlockContext} from "./context";

const BlockContentWrapper = memo(
  forwardRef(
    (
      {
        background: backgroundProps,
        content,
        layout,
        adaptiveWidth,
        blockName,
        onlyPreview,
        noPadding,
        scriptConfig,
      },
      ref
    ) => {
      const {index, isEdit, isSpan, blockId, fraction, isAdaptive} = useContext(
        BlockContext
      );

      const background = useMemo(() => {
        const obj = {...backgroundProps};
        if (obj.type === "image" && obj.crop) {
          obj.src = obj.src + getCropperQueryString(obj.crop);
        }
        return obj;
      }, [backgroundProps]);

      const params = useMemo(() => {
        const obj = {};
        if (adaptiveWidth) {
          obj["data-adaptive-width"] = adaptiveWidth;
          obj["data-adaptive"] = false;
        }
        return obj;
      }, [adaptiveWidth]);

      return (
        <BlockWrapper
          ref={ref}
          propsRef={ref}
          data-block-id={blockId}
          data-block-name={blockName}
          {...params}
          width={fraction}
          isAdaptive={isAdaptive}
          index={index}
          isSpan={isSpan}
          isEdit={isEdit}
        >
          <BlockContent index={index} background={background} isSpan={isSpan}>
            {isSpan && (
              <ExpandBlock
                background={background}
                isEdit={isEdit}
                scriptConfig={scriptConfig}
                index={index}
              />
            )}
            {content}
            <LayoutWrapper
              isEdit={isEdit}
              background={!isSpan ? background : {}}
              onlyPreview={onlyPreview}
              noPadding={noPadding}
            >
              {layout}
            </LayoutWrapper>
          </BlockContent>
        </BlockWrapper>
      );
    }
  )
);

const BlockWrapper = styled(
  ({width, index, isAdaptive, propsRef, isSpan, isEdit, ...props}) => (
    <div {...props} ref={propsRef} />
  )
)`
  width: ${({width}) => (width === 0 ? "100%" : `${width * (100 / 12)}%`)};
  padding: ${({isSpan, isEdit}) => (isEdit ? "7px" : isSpan ? "0 7px" : "7px")};
  display: flex;
  flex-direction: column;
  // position: relative;
  z-index: ${({index}) => 1000 - index};
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    width: 100%;
  }
  @media print {
    page-break-inside: avoid;
    display: block;
    float: left;
    position: relative;
  }
`;

const BlockContent = styled.div`
  position: relative;
  height: 100%;
  // z-index: ${({index}) => 1000 - index};
  background-color: ${({background, isSpan}) =>
    background.type === "color" && background.src
      ? background.src
      : background.type === "image" && isSpan
      ? "transparent"
      : "#fff"};
  box-shadow: ${({isSpan}) =>
    isSpan ? "none" : "rgba(164, 198, 225, 0.27) 0 2px 6px 0"};
  box-shadow: ${({background}) => (background.src === "transparent" ? "none" : "")};
`;

const LayoutWrapper = styled.div`
  padding: ${({onlyPreview, noPadding}) =>
    onlyPreview ? "0" : noPadding ? "0" : "20px 20px 28px"};
  height: ${({isEdit}) => (isEdit ? "calc(100% - 37px)" : "100%")};
  position: relative;
  ${({background}) =>
    background.type === "image"
      ? css`
          &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
            opacity: ${background.opacity};
            background: ${({background}) => generateBackground(background)};
            background-size: cover;
          }
        `
      : css`
          background: ${({background}) => generateBackground(background)};
          background-size: cover;
        `};
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    padding: 0;
    height: 100%;
  }
`;

BlockContentWrapper.propTypes = {
  background: PropTypes.object.isRequired,
  content: PropTypes.element,
  layout: PropTypes.element.isRequired,
  expand: PropTypes.element,
  adaptiveWidth: PropTypes.number,
  blockName: PropTypes.string,
  noPadding: PropTypes.bool,
  scriptConfig: PropTypes.any,
};

BlockContentWrapper.defaultProps = {
  content: <></>,
  expand: <></>,
  adaptiveWidth: 0,
  blockName: "block",
  noPadding: false,
};

export default BlockContentWrapper;
