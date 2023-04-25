import React, {memo, useContext, useMemo} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import get from "lodash/get";
import MediaReduxWrapper from "modules/Block/Wrappers/Media";
import {defaultMediaAvatarElement, defaultMediaElement} from "config/consts";
import {Masonry} from "components/Masonry";
import {MasonryItemStyled, MasonryStyled} from "modules/Block/Elements/Masonry/styled";
import {BlockContext} from "../../context";

const maxMediaElements = 15;

const Item = memo(({index, pathToContent, pathToProps}) => {
  return (
    <MediaReduxWrapper
      pathToContent={pathToContent}
      path={`${pathToContent}[${index}]`}
      currentIndex={index}
      pathToProps={pathToProps}
      maxElements={maxMediaElements}
    />
  );
});

export const MasonryElement = memo(({pathToProps, isAdaptive, padding}) => {
  const {index: blockIndex, fraction} = useContext(BlockContext);

  const pathToContent = useMemo(() => `structure[${blockIndex}].content.media`, [
    blockIndex,
  ]);

  const content = useSelector((state) => get(state.folio, pathToContent, []));
  const props = useSelector((state) => get(state.folio, pathToProps, {}));
  const notEmpty = useMemo(() => content.some(({src}) => src), [content]);

  const items = useMemo(
    () =>
      (notEmpty
        ? content
        : [
            props.type === "avatar"
              ? defaultMediaAvatarElement(props.shape)
              : defaultMediaElement,
          ]
      ).slice(0, maxMediaElements),
    [content, notEmpty, props.shape, props.type]
  );

  return (
    <MasonryStyled>
      <Masonry
        columns={isAdaptive ? 1 : props.columns[`c${fraction}`]}
        fraction={fraction}
        isAdaptive={isAdaptive}
        padding={padding}
      >
        {items.map((item, i) => {
          if (!item.src && notEmpty) return null;
          return (
            <MasonryItemStyled
              key={`masonry-element-${blockIndex}-${i}`}
              padding={fraction === 12 || fraction === 0 ? "12px" : "8px"}
            >
              <Item pathToContent={pathToContent} pathToProps={pathToProps} index={i} />
            </MasonryItemStyled>
          );
        })}
      </Masonry>
    </MasonryStyled>
  );
});

MasonryElement.propTypes = {
  pathToProps: PropTypes.string.isRequired,
  isAdaptive: PropTypes.bool,
  padding: PropTypes.string,
};

MasonryElement.defaultProps = {
  isAdaptive: false,
  padding: "12px",
};
export default MasonryElement;
