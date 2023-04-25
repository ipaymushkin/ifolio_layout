import React, {forwardRef, memo} from "react";
import PropTypes from "prop-types";
import styled, {css} from "styled-components";

const calculateWidth = ({cols, rightGap, isAdaptive, fixedWidth, autoWidth}) => {
  if (isAdaptive && !autoWidth) {
    return "100%";
  } else if (fixedWidth) {
    return fixedWidth + "px";
  } else if (autoWidth) {
    return "auto";
  } else {
    return `calc(${cols * (100 / 12)}% - ${rightGap}px)`;
  }
  // isAdaptive ? "100%" : `calc(${cols * (100 / 12)}% - ${rightGap}px)`
};

const BlockContainer = memo(
  forwardRef(
    (
      {
        flow,
        cols,
        children,
        autoWidth,
        rightGap,
        bottomGap,
        isAdaptive,
        needColsAttribute,
        needAlignItems,
        className,
        isTurntable,
        onlyPreview,
        fixedWidth,
        isTurntableContainer,
        align,
      },
      ref
    ) => {
      const dataAttrs = {};
      if (needColsAttribute) dataAttrs["data-cols"] = cols;
      if (isTurntable) dataAttrs["data-turntable-container"] = true;
      if (isTurntableContainer) dataAttrs["data-turntable-widget"] = true;
      return (
        <Wrapper
          {...dataAttrs}
          fixedWidth={fixedWidth}
          flow={flow}
          cols={cols}
          autoWidth={autoWidth}
          rightGap={rightGap}
          bottomGap={bottomGap}
          needAlignItems={needAlignItems}
          isAdaptive={isAdaptive}
          className={className}
          isTurntable={isTurntable}
          onlyPreview={onlyPreview}
          propsRef={ref}
          align={align}
        >
          {children}
        </Wrapper>
      );
    }
  )
);

const Wrapper = styled(
  ({
    cols,
    flow,
    rightGap,
    bottomGap,
    autoWidth,
    isAdaptive,
    needAlignItems,
    isTurntable,
    onlyPreview,
    fixedWidth,
    propsRef,
    align,
    ...props
  }) => {
    return <div {...props} ref={propsRef} />;
  }
)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${({flow}) => (flow === "vertical" ? "column" : "row")};
  width: ${({cols, rightGap, isAdaptive, fixedWidth, autoWidth}) =>
    calculateWidth({cols, rightGap, isAdaptive, fixedWidth, autoWidth})};
  flex: ${({autoWidth}) => autoWidth && "1"};
  margin-right: ${({rightGap}) => rightGap}px;
  min-height: 0;
  min-width: 0;
    //height: ${(height) => height};
  align-items: ${(needAlignItems) => (needAlignItems ? "stretch" : "flex-start")};
  margin-bottom: ${({bottomGap}) => bottomGap}px;

  :last-child {
    margin-right: 0;
    margin-bottom: 0;

    ${({align}) =>
      align &&
      css`
        justify-content: ${align};
      `}
  }

  ${({isTurntable}) =>
    isTurntable &&
    css`
      width: calc(
        ${({cols, onlyPreview, isAdaptive}) =>
            onlyPreview || isAdaptive ? "100%" : cols * (100 / 12)}
          %
      );
    `}
}

  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    width: ${({rightGap}) => `calc(100% - ${rightGap}px)`};
  }
`;

BlockContainer.propTypes = {
  children: PropTypes.any.isRequired,
  flow: PropTypes.string,
  cols: PropTypes.number,
  autoWidth: PropTypes.bool,
  rightGap: PropTypes.number,
  isAdaptive: PropTypes.bool,
  bottomGap: PropTypes.number,
  needAlignItems: PropTypes.bool,
  className: PropTypes.string,
  isTurntable: PropTypes.bool,
  isTurntableContainer: PropTypes.bool,
};

BlockContainer.defaultProps = {
  rightGap: 0,
  isAdaptive: false,
  bottomGap: 0,
  needAlignItems: false,
  className: "",
  cols: 12,
  isTurntable: false,
  isTurntableContainer: false,
};

export default BlockContainer;
