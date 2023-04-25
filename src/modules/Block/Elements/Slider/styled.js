import styled from "styled-components";
import {imageMaxHeight} from "../../../../config/consts";

export const SliderStyled = styled.div`
  width: calc(100% - 16px);
  padding: 0 8px;
  position: relative;
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    padding: 0;
    width: 100%;
  }
`;
export const SlideStyled = styled.div`
  position: relative;
  padding: ${({isParallax}) => (isParallax ? "0" : "0 12px")};
  width: ${({slidesToShow}) => 100 / slidesToShow}%;

  &:focus {
    outline: none;
  }

  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    width: 100%;
  }
  @media print {
  }
`;
