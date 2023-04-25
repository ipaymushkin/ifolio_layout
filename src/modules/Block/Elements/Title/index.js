import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Title = ({size, family, title, color, align}) => {
  return (
    <TitleStyled size={size} family={family} align={align}>
      <TitleEditorContainer>
        <TitleStyledSpan color={color}>{title}</TitleStyledSpan>
      </TitleEditorContainer>
    </TitleStyled>
  );
};

const TitleStyled = styled.div`
  position: relative;
  font-size: ${(props) => props.size};
  font-family: ${(props) => props.family};
  color: ${(props) => props.color};
  text-align: ${(props) => props.align};
  width: 100%;
  border: 1px dashed #d8d8d8;
`;
const TitleStyledSpan = styled.span`
  font-size: ${(props) => props.size};
  font-family: ${(props) => props.family};
  color: ${(props) => props.color};
`;
const TitleEditorContainer = styled.div`
  padding: 3px 0;
`;

Title.propTypes = {
  size: PropTypes.string,
  family: PropTypes.string,
  title: PropTypes.any,
  color: PropTypes.string,
  align: PropTypes.string,
};

Title.defaultProps = {
  size: "24px",
  family: "Avenir-heavy",
  title: "block title here",
  color: "#155a9f",
  align: "center",
};

export default Title;
