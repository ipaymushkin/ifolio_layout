import React, {useState, useCallback, memo, useContext} from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import {useDispatch, useSelector} from "react-redux";
import {Input} from "components/Input";
import {decodeURIComponentSafe} from "utils/decodeURIComponentSafe";
import {FolioActions} from "reducers/folio";
import {setBlockConfig} from "actions/folio";
import {
  SocialWrapper,
  IconWrapper,
  ItemWrapper,
} from "modules/Block/Elements/Social/styled";
import SocialIcon from "modules/Block/Elements/Social/SocialIcon";
import {handleLinkOrigin} from "utils/handleLinkOrigin";
import {BlockContext} from "../../context";

const SocialItem = memo(({type, idx, isEdit, pathToContent, blockIndex}) => {
  const dispatch = useDispatch();
  const contentText = useSelector((state) =>
    get(state.folio, `${pathToContent}[${idx}].text.ops[0].insert`, "")
  );

  const [text, changeText] = useState(decodeURIComponentSafe(contentText));

  const onSaveSocial = useCallback(() => {
    const props = {
      text: {
        ops: [{insert: encodeURIComponent(text)}],
      },
    };

    dispatch(
      FolioActions.setElementProps({
        path: `${pathToContent}[${idx}]`,
        props,
      })
    );
    if (blockIndex !== -1) dispatch(setBlockConfig(blockIndex));
  }, [blockIndex, dispatch, idx, pathToContent, text]);

  const onLinkClick = useCallback(() => {
    const link = handleLinkOrigin(text);

    window.open(link, "_blank", "noopener noreferrer");
  }, [text]);

  if (!isEdit && !text.trim()) return null;

  return (
    <ItemWrapper isEdit={isEdit}>
      <IconWrapper isEdit={isEdit} onClick={!isEdit ? onLinkClick : () => null}>
        <SocialIcon type={type} />
      </IconWrapper>
      {isEdit && (
        <Input
          placeholder={`Enter ${type} link`}
          value={text}
          onChange={changeText}
          onBlur={onSaveSocial}
        />
      )}
    </ItemWrapper>
  );
});

const SocialBlock = memo(({textIndex, pathToProps, pathToContent}) => {
  const {index: blockIndex, isEdit} = useContext(BlockContext);

  const props = useSelector((state) => get(state.folio, pathToProps, {}));
  return (
    <SocialWrapper>
      {props.type.map((type, idx) => (
        <SocialItem
          key={`social-${blockIndex}-${idx}`}
          type={type}
          idx={textIndex + idx}
          pathToContent={pathToContent}
          isEdit={isEdit}
          blockIndex={blockIndex}
        />
      ))}
    </SocialWrapper>
  );
});

SocialBlock.propTypes = {
  blockIndex: PropTypes.number,
  isEdit: PropTypes.bool,
  textIndex: PropTypes.number,
  pathToProps: PropTypes.string.isRequired,
  pathToContent: PropTypes.string.isRequired,
};

SocialBlock.defaultProps = {
  blockIndex: -1,
  isEdit: false,
  textIndex: -1,
};

export default SocialBlock;
