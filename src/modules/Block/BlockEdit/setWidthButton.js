import React, {memo, useCallback} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const SetWidthButton = memo(({value, label, onSetWidth, selected}) => {
  const onSetBlockWidth = useCallback(() => {
    onSetWidth && onSetWidth(value);
  }, [onSetWidth, value]);

  return (
    <Wrap value={value} onClick={onSetBlockWidth}>
      <ButtonWrapper value={value} data-value={value} selected={selected}>
        {label}
      </ButtonWrapper>
    </Wrap>
  );
});

const ButtonWrapper = styled.button`
  cursor: pointer;
  background: ${({selected}) => (selected ? "#25bec8" : "#c5d9e8")};
  outline: none;
  border: 0;
  padding: 0 10px;
  position: relative;
  height: 28px;
  font-family: ${({theme}) => theme.fonts.helveticaNeueBold};
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  letter-spacing: 0.25px;
  color: #ffffff;
  text-align: ${({value}) => (value === 0 ? "center" : "left")};
  width: ${({value}) => (value === 0 ? "100%" : `${value * (100 / 12)}%`)};
`;

const Wrap = styled.div`
  cursor: pointer;
  background: rgba(197, 217, 232, 0.25);
  margin: ${({value}) => (value === 0 ? "8px 0" : "0 24px 8px 24px")};
  text-align: left;
  &:hover {
    ${ButtonWrapper} {
      background: rgb(37, 190, 200, 0.6);
    }
  }
`;

SetWidthButton.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onSetWidth: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default SetWidthButton;
