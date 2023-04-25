import React, {useCallback, useRef} from "react";
import PropTypes from "prop-types";
import styled, {css} from "styled-components";
import {v4 as uuidv4} from "uuid";
import {ButtonLayout} from "components/ButtonLayout";
import {IconCrop} from "icons/IconCrop";
import {IconMediaAdd} from "icons/IconMediaAdd";
import {Desktop, Mobile} from "utils/mediaQueries";
import {IconEdit} from "icons/IconEdit";
import {useDispatch} from "react-redux";
import {show} from "redux-modal";
import {useHelperContext} from "../../../../hooks/useHelper";
import checkIsVideo from "../../../../utils/checkIsVideo";

const MediaController = ({
  topHandler,
  bottomHandler,
  rightHandler,
  padding,
  size,
  isEdit,
  mediaOptions,
  cropperOptions,
  isTurntable,
  disabledForMobile,
  controllerMargin,
  isChart,
  isHero,
}) => {
  const identify = useRef(uuidv4());
  const dispatch = useDispatch();

  const showSlideEditMenu = useCallback(() => {
    dispatch(show("slide-edit-menu", {mediaOptions, cropperOptions}));
  }, [cropperOptions, dispatch, mediaOptions]);

  useHelperContext("adding-media-container");
  useHelperContext("editing-charts-container");

  return (
    <>
      <MediaControllerStyled size={size} padding={padding} isChart={isChart}>
        <Desktop>
          {generateButtons({
            isEdit,
            topHandler,
            bottomHandler,
            rightHandler,
            identify: identify.current,
            isTurntable,
            controllerMargin,
            isChart,
            cropperOptions,
          })}
        </Desktop>
        <Mobile>
          {isEdit && !disabledForMobile && (
            <ElementHandlerMobileWrapper isHero={isHero}>
              <ButtonLayout
                icon={IconEdit}
                size={32}
                padding={0}
                onClick={showSlideEditMenu}
              />
              {/* {generateButtons({
                isEdit,
                topHandler,
                bottomHandler,
                identify: identify.current,
              })}*/}
            </ElementHandlerMobileWrapper>
          )}
        </Mobile>
      </MediaControllerStyled>
    </>
  );
};

const renderButtonLayout = ({icon, action = () => null, element, highlighted}) => {
  if (element) return element;
  return (
    <ButtonLayout
      icon={icon}
      size={32}
      padding={0}
      onClick={action}
      highlighted={highlighted}
    />
  );
};

const generateButtons = ({
  isEdit,
  topHandler,
  bottomHandler,
  rightHandler = [],
  identify,
  isTurntable,
  controllerMargin,
  isChart,
  cropperOptions,
}) => {
  if (isEdit) {
    return (
      <>
        <ElementHandlerTopWrapper
          isTurntable={isTurntable}
          controllerMargin={controllerMargin}
        >
          {topHandler.map((item, i) => {
            if (checkIsVideo(cropperOptions.src)) {
              return null;
            }
            return (
              <ButtonWrapper
                key={`${identify}-top${i}`}
                data-helper={isChart && "editing-charts-container"}
                isChart={isChart}
              >
                {renderButtonLayout(item)}
              </ButtonWrapper>
            );
          })}
        </ElementHandlerTopWrapper>
        <ElementHandlerBottomWrapper
          isTurntable={isTurntable}
          controllerMargin={controllerMargin}
        >
          {bottomHandler.map((item, i) => (
            <ButtonWrapper
              key={`${identify}-bottom${i}`}
              data-helper={"adding-media-container"}
            >
              {renderButtonLayout(item)}
            </ButtonWrapper>
          ))}
        </ElementHandlerBottomWrapper>
        <ElementHandlerRightWrapper>
          {rightHandler.map((item, i) => (
            <ButtonWrapper
              key={`${identify}-right${i}`}
              data-helper={item.helperSelector}
            >
              {renderButtonLayout(item)}
            </ButtonWrapper>
          ))}
        </ElementHandlerRightWrapper>
      </>
    );
  }
  return null;
};

const MediaControllerStyled = styled.div`
  position: absolute;
  top: 50%;
  transform: ${({isChart}) => (isChart ? "translate(50px, -50%)" : "translate(0, -50%)")};
  left: ${({isChart}) => (isChart ? "-50%" : "0")};
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70px;
  //overflow: hidden;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  padding: ${(props) => props.padding}px;
  z-index: 4;
  pointer-events: none;
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    align-items: flex-start;
    justify-content: flex-end;
  }
  @media print {
    display: none;
  }
`;
const ElementHandlerWrapper = styled.div`
  position: absolute;
  display: flex;
  right: 50%;
  transform: translate(50%, 0);
`;
const ElementHandlerTopWrapper = styled(ElementHandlerWrapper)`
  top: ${({isTurntable, controllerMargin}) =>
    controllerMargin || controllerMargin === 0
      ? controllerMargin + "px"
      : isTurntable
      ? "4px"
      : "14px"};
  z-index: 1;
`;

const ElementHandlerBottomWrapper = styled(ElementHandlerWrapper)`
  bottom: ${({isTurntable, controllerMargin}) =>
    controllerMargin || controllerMargin === 0
      ? controllerMargin + "px"
      : isTurntable
      ? "4px"
      : "14px"};
  z-index: 1;
`;

const ElementHandlerRightWrapper = styled(ElementHandlerWrapper)`
  z-index: 1;
  flex-direction: column;
  bottom: 10px;
  right: 30px;
  > div {
    margin-top: 10px;
  }
  > div:first-child {
    margin-top: 0;
  }
`;

const ButtonWrapper = styled.div`
  margin: 0 4px;
  pointer-events: all;
  ${({isChart}) =>
    isChart
      ? css`
          margin-top: -40px;
        `
      : null}
`;

const ElementHandlerMobileWrapper = styled.div`
  padding-top: 15px;
  padding-right: 25px;
  z-index: 1;
  pointer-events: all;
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    ${({isHero}) =>
      isHero
        ? css`
            position: absolute;
            padding: 0;
            right: 10px;
            bottom: 10px;
          `
        : null};
  }
`;
MediaController.propTypes = {
  topHandler: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.func,
      action: PropTypes.func,
      element: PropTypes.element,
    })
  ),
  bottomHandler: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.func,
      action: PropTypes.func,
      element: PropTypes.element,
    })
  ),
  padding: PropTypes.number,
  size: PropTypes.string,
  isEdit: PropTypes.bool,
  mediaOptions: PropTypes.object,
  cropperOptions: PropTypes.object,
  disabledForMobile: PropTypes.bool,
};

MediaController.defaultProps = {
  topHandler: [{icon: IconCrop}],
  bottomHandler: [{icon: IconMediaAdd}],
  padding: 0,
  size: "100%",
  isEdit: true,
  mediaOptions: {},
  cropperOptions: {},
  disabledForMobile: false,
};

export default MediaController;
