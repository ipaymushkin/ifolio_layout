import {IconButton} from "components/IconButton";
import {IconMove} from "icons/IconMove";
import {LoaderSimplified} from "../../../components/LoaderSimplified";
import ColorBlockIcon from "./ColorBlockIcon";
import CopyBlockIcon from "./CopyBlockIcon";
import DeleteBlockIcon from "./DeleteBlockIcon";
import IconBlockWidth from "./IconBlockWidth";
import LockBlockIcon from "modules/Block/BlockEdit/LockBlockIcon";
import React, {memo, useContext, useMemo} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {IconsRow} from "components/IconsRow";
import ChangeBlockIcon from "./ChangeBlockIcon";
import {Desktop} from "utils/mediaQueries";
import {sortingHandlerClassName} from "config/consts";
import {useHelperContext} from "../../../hooks/useHelper";
import {BlockContext} from "../context";

const editItems = ({
  index,
  resize,
  isParallax,
  isTemplate,
  is_lock,
  folioIsLock,
  isSpan,
  isParallaxTemplate,
  isFetching,
}) => {
  const showButtons = isTemplate || (!isTemplate && !folioIsLock);
  let icons = [
    isTemplate && {
      id: 5,
      icon: () => <LockBlockIcon index={index} is_lock={is_lock} />,
      color: "#20dac4",
      tooltipZIndex: 11,
      title: "Lock block",
      size: 26,
      padding: 4,
    },
    showButtons &&
      isSpan && {
        id: 0,
        icon: () => <ColorBlockIcon index={index} />,
        color: "#20dac4",
        tooltipZIndex: 11,
        title: "Change block color",
      },
    showButtons && {
      id: 1,
      icon: () => <IconBlockWidth index={index} />,
      color: "#20dac4",
      tooltipZIndex: 10,
      title: "Change block width",
    },
    showButtons && {
      id: 2,
      icon: () => <ChangeBlockIcon index={index} />,
      color: "#20dac4",
      title: "Change block view",
      helperSelector: "updating-block-layouts-container",
    },
    showButtons && {
      id: 3,
      icon: () => {
        if (isFetching) {
          return <LoaderSimplified width={"23px"} top={"0"} />;
        }
        return <CopyBlockIcon index={index} />;
      },
      color: "#20dac4",
      title: "Duplicate block",
    },
    showButtons && {
      id: 4,
      icon: () => {
        if (isFetching) {
          return <LoaderSimplified width={"23px"} top={"0"} />;
        }
        return <DeleteBlockIcon index={index} />;
      },
      color: "#20dac4",
      title: "Delete block",
    },
  ];

  icons = icons.filter(({id}) => {
    if ((!resize && id === 1) || id === undefined) return false;
    else if ((isParallax || isParallaxTemplate) && id === 0) return false;
    return true;
  });

  return icons;
};

const MoveControlIcon = memo(() => (
  <MoveControls className={sortingHandlerClassName}>
    <IconButton
      icon={IconMove}
      color={"#C5D9E8"}
      colorChange={"#25BEC8"}
      title="Move block"
    />
  </MoveControls>
));

const LayoutEdit = memo(
  ({resize, is_lock, folioIsLock, isParallaxTemplate, isFetching}) => {
    useHelperContext("updating-block-layouts-container");

    const {index, isTemplate, isSpan, isParallax} = useContext(BlockContext);

    const items = useMemo(() => {
      return editItems({
        index,
        resize,
        isParallax,
        isTemplate,
        is_lock,
        folioIsLock,
        isSpan,
        isParallaxTemplate,
        isFetching,
      });
    }, [
      folioIsLock,
      isSpan,
      index,
      isFetching,
      isParallax,
      isParallaxTemplate,
      isTemplate,
      is_lock,
      resize,
    ]);

    return (
      <>
        <Desktop>
          <Wrapper index={index}>
            {isTemplate || !folioIsLock ? <MoveControlIcon /> : <EmptyWrapper />}
            <LayoutControls>
              <IconsRow items={items} />
            </LayoutControls>
          </Wrapper>
        </Desktop>
      </>
    );
  }
);

const Wrapper = styled.div`
  border-bottom: 1px solid rgba(197, 217, 232, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  position: relative;
  z-index: ${({index}) => 1000 - index};
`;

const MoveControls = styled.div``;

const LayoutControls = styled.div``;

const EmptyWrapper = styled.div``;

LayoutEdit.propTypes = {
  resize: PropTypes.bool,
  isParallax: PropTypes.bool,
  is_lock: PropTypes.bool,
  folioIsLock: PropTypes.bool,
  isParallaxTemplate: PropTypes.bool,
  isFetching: PropTypes.bool,
};

LayoutEdit.defaultProps = {
  resize: true,
  isParallax: false,
  is_lock: false,
  folioIsLock: false,
  isParallaxTemplate: false,
  isFetching: false,
};

export {LayoutEdit};
