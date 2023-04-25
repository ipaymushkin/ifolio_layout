import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import HelperIcon from "icons/HelperIcon";

const HelpBlockIcon = ({index}) => {
  return (
    <Wrapper>
      <HelperIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div``;

HelpBlockIcon.propTypes = {
  index: PropTypes.number,
};

export default HelpBlockIcon;
