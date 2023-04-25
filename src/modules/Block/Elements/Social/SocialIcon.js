import React from "react";
import PropTypes from "prop-types";
import TwitterIcon from "icons/social/TwitterIcon";
import LinkedinIcon from "icons/social/LinkedinIcon";
import InstagramIcon from "icons/social/InstagramIcon";
import FacebookIcon from "icons/social/FacebookIcon";
import {Icon} from "components/Icon";

const _renderSocialIcon = (type) => {
  switch (type) {
    case "twitter":
      return TwitterIcon;
    case "linkedin":
      return LinkedinIcon;
    case "instagram":
      return InstagramIcon;
    case "facebook":
      return FacebookIcon;
    default:
      return null;
  }
};

const SocialIcon = ({type}) => {
  return <Icon color={"#00C4CC"} icon={_renderSocialIcon(type)} size={40} />;
};

SocialIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SocialIcon;
