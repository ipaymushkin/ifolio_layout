import React, {forwardRef, memo} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
// import TextEditorQuill from "components/TextEditorQuill";
import TextEditorQuill from "components/TextEditorQuill";

const Text = memo(
  forwardRef(
    (
      {text, isEdit, onChange, onBlur, onlyPreview, type, color, position, isHero},
      ref
    ) => {
      return (
        <TextStyled isEdit={isEdit} isHero={isHero} ref={ref}>
          <TextEditorQuill
            onChange={onChange}
            value={text}
            disabled={!isEdit}
            onBlur={onBlur}
            onlyPreview={onlyPreview}
            type={type}
            color={color}
            position={position}
          />
        </TextStyled>
      );
    }
  )
);

const TextStyled = styled.div`
  position: relative;
  width: 100%;
  border: 1px dashed ${({isEdit}) => (isEdit ? "#d8d8d8" : "transparent")};

  ${({isHero}) => {
    if (isHero) {
      return {
        ".ql-editor": {
          wordWrap: "normal",
          overflowX: "auto",
        },
      };
    }
  }}

  @media print {
    border: 0;
  }
`;

Text.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  isEdit: PropTypes.bool,
  onBlur: PropTypes.func,
  onlyPreview: PropTypes.bool,
  type: PropTypes.string,
  color: PropTypes.string,
  position: PropTypes.string,
  isHero: PropTypes.bool,
};

Text.defaultProps = {
  text: "",
  isEdit: true,
  onChange: () => null,
  onBlur: () => null,
  onlyPreview: false,
  type: "",
  color: "",
  position: "left",
};

export default Text;
