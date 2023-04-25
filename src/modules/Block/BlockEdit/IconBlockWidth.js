import React, {useCallback, useState} from "react";
import {Tooltip} from "components/Tooltip";
import SetWidthButton from "./setWidthButton";
import {FolioActions} from "reducers/folio";
import {IconWidth} from "icons/IconWidth";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import {setBlockConfig} from "actions/folio";

const widthOptions = [
  {
    label: "1/3",
    value: 4,
  },
  {
    label: "1/2",
    value: 6,
  },
  {
    label: "2/3",
    value: 8,
  },
  {
    label: "Full width",
    value: 12,
  },
  {
    label: "Span",
    value: 0,
  },
];

const IconBlockWidth = ({index}) => {
  const [visible, onChangeVisible] = useState(false);
  const dispatch = useDispatch();

  const cols = useSelector((state) => state.folio.structure[index].cols);
  const [selected, setSelected] = useState(cols);

  const background = useSelector(
    (state) => state.folio.structure[index].props.background
  );

  const handleVisible = useCallback((vis) => onChangeVisible(vis), [onChangeVisible]);
  const onSetBlockWidth = useCallback(
    (cols) => {
      dispatch(FolioActions.setBlockWidth({index, cols, background}));
      dispatch(setBlockConfig(index));
      setSelected(cols);
      handleVisible(false);
    },
    [background, dispatch, handleVisible, index]
  );

  return (
    <Tooltip
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisible}
      overlay={
        <TooltipWrapper>
          <TooltipHeader>Set Block Width</TooltipHeader>
          {widthOptions.map((item) => (
            <SetWidthButton
              key={`button-width-${item.value}`}
              label={item.label}
              value={item.value}
              onSetWidth={onSetBlockWidth}
              selected={item.value === selected}
            />
          ))}
        </TooltipWrapper>
      }
    >
      <div>
        <IconWidth />
      </div>
    </Tooltip>
  );
};
const TooltipWrapper = styled.div`
  text-align: center;
  opacity: 0.87;
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: 0.25px;
  width: 183px;
  padding: 8px 1px;
  display: flex;
  flex-direction: column;
`;
const TooltipHeader = styled.div`
  margin-bottom: 16px;
  color: ${({theme}) => theme.colors.lightText5};
  letter-spacing: 0.25px;
  font-family: ${({theme}) => theme.fonts.fontFamily.helveticaNeueMedium};
`;

IconBlockWidth.propTypes = {
  index: PropTypes.number.isRequired,
};

export default IconBlockWidth;
