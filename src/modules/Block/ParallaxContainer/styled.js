import React from "react";
import styled, {css} from "styled-components";

export const BlockWrapper = styled(({width, index, isSpan, isEdit, ...props}) => (
  <div {...props} />
))`
  width: ${({width}) => (width === 0 ? "100%" : `${width * (100 / 12)}%`)};
  padding: ${({isSpan, isEdit}) => (isEdit ? "7px" : isSpan ? "0" : "7px")};
  display: flex;
  flex-direction: column;
  position: relative;
  // z-index: ${({index}) => 1000 - index};
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    width: 100%;
  }
  @media print {
    page-break-inside: avoid;
    display: block;
    position: relative;
    float: left;
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  ${({autoHeight}) =>
    autoHeight &&
    css`
      height: auto !important;
    `}
  ${({isSpan}) =>
    isSpan &&
    css`
      width: 100vw;
      left: 50%;
      right: 50%;
      transform: translate(-50%, 0);
    `}
  @media print {
    width: 100%;
    right: 0;
    left: auto;
    transform: none;
  }
`;

export const BlockContent = styled.div`
  position: relative;
  height: 100%;
  box-shadow: ${({isSpan}) =>
    isSpan ? "none" : "rgba(164, 198, 225, 0.27) 0 2px 6px 0"};
`;

export const SlideParallax = styled.div`
  height: auto !important;
  width: 100%;
`;

export const ChildContent = styled.div`
  position: relative;
`;
export const MediaContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  //bottom: -3px;
  @media print {
    transform: none !important;
  }
`;

export const LayoutWrapper = styled.div`
  padding: 45px;
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    padding: 0;
  }
  ${({isSpan}) =>
    isSpan &&
    css`
      margin: auto;
      width: 100%;
      @media screen and (max-width: ${({theme}) => theme.breakpoints.values.xl}px) {
        max-width: 100%;
        min-width: 100%;
      }
      @media screen and (min-width: ${({theme}) => theme.breakpoints.values.xl}px) {
        max-width: calc(80vw - 14px);
        min-width: 1246px;
      }
      @media print {
        max-width: 100%;
        min-width: 100%;
      }
    `}
`;

export const ParallaxImage = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;
