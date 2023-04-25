import styled from "styled-components";
import {css} from "styled-components";

export const FrontSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  //overflow: hidden;
`;

export const BackSide = styled.div`
  //position: absolute;
  //top: 0;
  position: absolute;
  top: 0;
  left: 0;
  //top: -100%;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: ${(props) => props.color || "#25bec8"};
  transform: rotateY(180deg);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  //overflow: hidden;
  z-index: 2;
  @media print {
    display: none;
  }
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  min-height: 420px;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${({flip}) => (flip ? "rotateY(180deg)" : "rotateY(0)")};
  ${FrontSide} {
    z-index: ${({flip}) => (flip ? 1 : 2)};
  }

  ${BackSide} {
    z-index: ${({flip}) => (flip ? 2 : 1)};
  }
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    min-height: 333px;
  }
  @media print {
    transform: none;
  }
`;

export const Wrapper = styled.div`
  background-color: transparent;
  width: 100%;
  height: 100%;
  perspective: 2000px;

  &:hover {
    ${Content} {
      ${({isEdit}) =>
        !isEdit &&
        css`
          transform: rotateY(180deg);
        `})
    }
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    &:hover {
      ${Content} {
        ${({isEdit}) =>
          !isEdit &&
          css`
            transform: none;
          `})
      }
  }    
    @media print {
      ${Content} {
        ${({isEdit}) =>
          !isEdit &&
          css`
            transform: none;
          `})
      }
    }
  }
`;

export const CardContent = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

export const ImageWrapper = styled.div`
  margin-bottom: 28px;
  position: relative;
  width: 200px;
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.sm}px) {
    width: 140px;
  }
`;

export const Background = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
