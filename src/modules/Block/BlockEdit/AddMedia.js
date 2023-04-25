import React from "react";
import PropTypes from "prop-types";
import AddMediaIcon from "components/Icons/AddMediaIcon";

const AddMedia = ({index}) => {
  return (
    <div style={{height: "30px", width: "30px"}} onClick={() => {}}>
      <AddMediaIcon />
    </div>
  );
};

AddMedia.propTypes = {
  index: PropTypes.number.isRequired,
};
export default AddMedia;
