import React from "react";
import styled from "styled-components";

const DescriptionPreview = () => {
  return (
    <Wrapper>
      <Line />
      <Line />
      <Line />
      <Line />
      <Line />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow: hidden;
  flex: 0 1 auto;
`;

const Line = styled.div`
  height: 1px;
  width: 100%;
  background-color: #91a1c3;
  margin-bottom: 6px;

  :last-child {
    margin-bottom: 0;
  }
`;

export default DescriptionPreview;
