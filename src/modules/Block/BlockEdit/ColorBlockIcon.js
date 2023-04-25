import React, {useCallback, useState, useEffect} from "react";
import {ColorPicker} from "components/ColorPicker";
import {IconChangeColor} from "icons/IconChangeColor";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {Tooltip} from "components/Tooltip";
import {FolioActions} from "reducers/folio";
import PropTypes from "prop-types";
import ClearIcon from "icons/ClearIcon";
import {Icon} from "components/Icon";
import Checkbox from "components/Checkbox";
import ImagePicker from "components/ImagePicker";
import {setBlockConfig} from "actions/folio";

const DEFAULT_COLOR = "white";

const ColorBlockIcon = ({index}) => {
  const [visible, onChangeVisible] = useState(false);
  const dispatch = useDispatch();

  const handleVisible = useCallback((vis) => onChangeVisible(vis), [onChangeVisible]);

  const {src, type} = useSelector(
    (state) => state.folio.structure[index].props.background
  );

  const onSetBlockColor = useCallback(
    (color) => {
      dispatch(FolioActions.setBlockColor({index, color, type: "color"}));
      dispatch(setBlockConfig(index));
      //handleVisible(false);
    },
    [dispatch, index]
  );

  const [checked, setChecked] = useState(type === "image" && src);

  const pathToContent = `structure[${index}].props.background`;
  const pathToProps = `[${index}].layout`;

  const handleCheck = () => {
    setChecked(!checked);

    if (type === "image" && src) {
      dispatch(FolioActions.setBlockColor({index, color: DEFAULT_COLOR, type: "color"}));
      dispatch(setBlockConfig(index));
    }
  };

  return (
    <Tooltip
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisible}
      overlay={
        <TooltipWrapper>
          <TooltipHeader>
            <Heading>Set block background</Heading>
            <Close onClick={() => handleVisible(false)}>
              <Icon icon={ClearIcon} color={"#676E8A"} />
            </Close>
          </TooltipHeader>
          <Content>
            <Section>
              <Data>
                <ColorPicker
                  value={type === "color" ? src : ""}
                  onChange={onSetBlockColor}
                />
              </Data>
            </Section>
            <Section>
              <Data>
                <BackgroundImageWrapper>
                  <Checkbox
                    label={"Background image"}
                    onChange={handleCheck}
                    checked={checked}
                    theme={{
                      fontSize: "13px",
                    }}
                    type={"custom"}
                  />
                  {checked && (
                    <ImagePicker
                      setTooltipVisibile={handleVisible}
                      pathToProps={`${pathToProps}.props`}
                      pathToContent={pathToContent}
                      path={pathToContent}
                      blockIndex={index}
                    />
                  )}
                </BackgroundImageWrapper>
              </Data>
            </Section>
          </Content>
        </TooltipWrapper>
      }
    >
      <IconChangeColor />
    </Tooltip>
  );
};

const TooltipWrapper = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const BackgroundImageWrapper = styled.div``;

const Content = styled.div``;

const Section = styled.div`
  margin-bottom: 10px;
`;

const Data = styled.div``;

const Close = styled.div``;

const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Heading = styled.div`
  color: ${({theme}) => theme.colors.lightText5};
  font-size: 14px;
  opacity: 0.87;
  letter-spacing: 0.25px;
  font-family: ${({theme}) => theme.fonts.fontFamily.helveticaNeueMedium};
`;

ColorBlockIcon.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ColorBlockIcon;
