import React, {useCallback} from "react";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import LockCloseIcon from "icons/LockClose";
import LockOpenIcon from "icons/LockOpen";
import {FolioActions} from "reducers/folio";
import {setBlockConfig} from "actions/folio";
import styled from "styled-components";

const LockBlockIcon = ({is_lock, index}) => {
  const dispatch = useDispatch();

  const onBlockUnblock = useCallback(() => {
    dispatch(FolioActions.changeLockedProps({index}));
    dispatch(setBlockConfig(index));
  }, [dispatch, index]);

  return (
    <IconWrapper onClick={onBlockUnblock}>
      {is_lock ? <LockCloseIcon /> : <LockOpenIcon />}
    </IconWrapper>
  );
};
const IconWrapper = styled.div`
  height: 100%;
  width: 100%;
`;
LockBlockIcon.propTypes = {
  is_lock: PropTypes.bool,
  index: PropTypes.number,
};
LockBlockIcon.defaultProps = {
  is_lock: false,
  index: 0,
};

export default LockBlockIcon;
