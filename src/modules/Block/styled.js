import styled from "styled-components";

export const WidgetWrapper = styled.div`
  margin: ${({widget}) => (widget === "turntable" ? "0" : "12px")};
  width: ${({widget}) => (widget === "turntable" ? "100%" : "calc(100% - 24px)")};
  display: flex;
  justify-content: center;
`;

export const ExpandBackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
