import React, {memo, useCallback, useContext, useMemo, useState} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import MediaController from "../MediaController";
import {IconTurn} from "icons/IconTurn";
import {useDispatch, useSelector} from "react-redux";
import get from "lodash/get";
import TextReduxWrapper from "modules/Block/Wrappers/Text";
import {IconChangeColor} from "icons/IconChangeColor";
import {ColorPickerWithTooltip} from "components/ColorPicker/WithTooltip";
import {ButtonLayout} from "components/ButtonLayout";
import {FolioActions} from "reducers/folio";
import MediaReduxWrapper from "modules/Block/Wrappers/Media";
import {setBlockConfig} from "actions/folio";
import {
  Background,
  BackSide,
  CardContent,
  Content,
  FrontSide,
  ImageWrapper,
  Wrapper,
} from "./styled";
import {useMediaQuery} from "react-responsive";
import {BlockContext} from "../../context";

const generatePath = (pathToContent, index) => `${pathToContent}.media[${index}]`;

const Turntable = memo(
  ({
    textIndex,
    mediaIndex,
    pathToProps,
    pathToLayout,
    colorIndex,
    isTurntable,
    isAdaptive,
  }) => {
    const {index: blockIndex, isEdit} = useContext(BlockContext);

    const dispatch = useDispatch();

    const pathToContent = `structure[${blockIndex}].content`;
    const pathToColor = `${pathToContent}.colors.c${colorIndex}`;
    const color = useSelector((state) => get(state.folio, pathToColor, ""));

    const [flip, setFlip] = useState(false);

    const flipCard = useCallback(() => {
      setFlip((state) => !state);
    }, []);

    const isMobile = useMediaQuery({maxWidth: 768});

    const {bottomHandler, topHandler} = useMemo(
      () => ({
        bottomHandler: [
          {
            element: (
              <ColorPickerWithTooltip
                onChange={(color) => {
                  dispatch(
                    FolioActions.setElementProps({
                      path: pathToColor,
                      props: color,
                      fullUpdate: true,
                    })
                  );
                  dispatch(setBlockConfig(blockIndex));
                }}
                color={color}
                tooltipTitle={"Set block background"}
              >
                <ButtonLayout icon={IconChangeColor} size={32} padding={6} />
              </ColorPickerWithTooltip>
            ),
          },
          {icon: IconTurn, action: flipCard},
        ],
        topHandler: [],
      }),
      [blockIndex, color, dispatch, flipCard, pathToColor]
    );

    return (
      <Wrapper isEdit={isEdit}>
        <Content flip={flip} data-container={true} onClick={isMobile && flipCard}>
          <FrontSide>
            <Background>
              <MediaReduxWrapper
                pathToContent={`${pathToContent}.media`}
                isEdit={isEdit}
                path={generatePath(pathToContent, mediaIndex)}
                // pathToProps={pathToProps}
                currentIndex={mediaIndex}
                pathToAvatarShape={`${pathToProps}.avatarShape`}
                bottomHandler={[{icon: IconTurn, action: flipCard}]}
                blockIndex={blockIndex}
                pathToLayout={pathToLayout}
                isTurntable={isTurntable}
                isAdaptive={isAdaptive}
              />
            </Background>
            <CardContent data-turntable={true}>
              <ImageWrapper>
                <MediaReduxWrapper
                  pathToContent={`${pathToContent}.media`}
                  isEdit={isEdit}
                  path={generatePath(pathToContent, mediaIndex + 1)}
                  pathToProps={pathToProps}
                  currentIndex={mediaIndex + 1}
                  pathToAvatarShape={`${pathToProps}.avatarShape`}
                  placeholderType={"avatar"}
                  placeholderShape={"circle"}
                  blockIndex={blockIndex}
                  pathToLayout={pathToLayout}
                  isTurntable={isTurntable}
                  isAdaptive={isAdaptive}
                  defaultAspect={1}
                />
              </ImageWrapper>
              <TextReduxWrapper
                isEdit={isEdit}
                path={`structure[${blockIndex}].content.text[${textIndex}]`}
                blockIndex={blockIndex}
                type={"title"}
                color={"white"}
                position={"center"}
              />
            </CardContent>
          </FrontSide>
          <BackSide color={color}>
            <CardContent data-turntable={true}>
              <TextReduxWrapper
                isEdit={isEdit}
                path={`structure[${blockIndex}].content.text[${textIndex + 1}]`}
                blockIndex={blockIndex}
                type={"title"}
                color={"white"}
                position={"center"}
              />
            </CardContent>
            <Controls>
              {isEdit && (
                <MediaController
                  topHandler={topHandler}
                  bottomHandler={bottomHandler}
                  isTurntable={isTurntable}
                />
              )}
            </Controls>
          </BackSide>
        </Content>
      </Wrapper>
    );
  }
);

const Controls = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
`;

Turntable.propTypes = {
  textIndex: PropTypes.number.isRequired,
  mediaIndex: PropTypes.number.isRequired,
  pathToLayout: PropTypes.string.isRequired,
};

export default Turntable;
