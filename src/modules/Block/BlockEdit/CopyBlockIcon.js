import {FolioActions} from "reducers/folio";
import React, {useCallback} from "react";
import {IconBlockDuplicate} from "icons/IconBlockDuplicate";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {duplicateBlockConfig} from "actions/folio";

const CopyBlockIcon = ({index}) => {
  const dispatch = useDispatch();

  const onCopyBlock = useCallback(() => {
    dispatch(FolioActions.copyBlock(index));
    dispatch(duplicateBlockConfig(index));
  }, [dispatch, index]);

  return (
    <div style={{height: "30px", width: "30px"}} onClick={onCopyBlock}>
      <IconBlockDuplicate />
    </div>
  );
};

CopyBlockIcon.propTypes = {
  index: PropTypes.number.isRequired,
};
export default CopyBlockIcon;
