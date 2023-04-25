import React, {useCallback} from "react";
import {IconBlockDelete} from "icons/IconBlockDelete";
import {FolioActions} from "reducers/folio";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {removeBlockConfig} from "actions/folio";
import styled from "styled-components";

const DeleteBlockIcon = ({index}) => {
  const dispatch = useDispatch();

  const onRemoveBlock = useCallback(() => {
    dispatch(removeBlockConfig(index));
    dispatch(FolioActions.removeBlock(index));
  }, [dispatch, index]);

  return (
    <Wrapper
      onClick={() => {
        const deletingConfirmed = window.confirm(
          "Do you really want to delete the block?"
        );
        deletingConfirmed && onRemoveBlock();
      }}
    >
      <IconBlockDelete />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 30px;
  height: 30px;
`;

DeleteBlockIcon.propTypes = {
  index: PropTypes.number.isRequired,
};

export default DeleteBlockIcon;
