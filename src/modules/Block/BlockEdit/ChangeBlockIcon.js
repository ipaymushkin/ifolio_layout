import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {show} from "redux-modal";
import {IconBlockLayout} from "icons/IconBlockLayout";

const ChangeBlockIcon = ({index}) => {
  const dispatch = useDispatch();

  const onOpenModal = useCallback(() => {
    dispatch(
      show("layout-select", {
        index,
      })
    );
  }, [dispatch, index]);

  return (
    <div style={{height: "30px", width: "30px"}} onClick={onOpenModal}>
      <IconBlockLayout />
    </div>
  );
};

ChangeBlockIcon.propTypes = {
  index: PropTypes.number.isRequired,
};
export default ChangeBlockIcon;
