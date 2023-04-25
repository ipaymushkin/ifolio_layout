import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ImagePreviewIcon from "icons/ImagePreviewIcon";
import ChartPreviewIcon from "icons/ChartPreviewIcon";
import {Icon} from "components/Icon";
import {AvatarIcon, AvatarIconRect} from "icons/AvatarIcon";

const ImagePreview = ({type, shape, data}) => {
  const _renderIcon = (type) => {
    switch (type) {
      case "image":
        return <Icon icon={ImagePreviewIcon} color={"#25BEC8"} size={50} />;
      case "gallery":
        return <Icon icon={ImagePreviewIcon} color={"#25BEC8"} size={50} />;
      case "chart":
        return <Icon icon={ChartPreviewIcon} color={"#25BEC8"} size={50} />;
      case "avatar":
        if (data.shape === "rectangle") {
          return <Icon icon={AvatarIconRect} color={"#25BEC8"} size={50} />;
        }
        return <Icon icon={AvatarIcon} color={"#25BEC8"} size={50} />;
      default:
        return <Icon icon={ImagePreviewIcon} color={"#25BEC8"} size={50} />;
    }
  };

  return (
    <Wrapper shape={shape} type={type}>
      {_renderIcon(type)}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({type}) => (type === "avatar" ? "transparent" : "#defafa")};
  width: ${({shape}) => (shape === "circle" ? "70px" : "100%")};
  height: ${({shape}) => (shape === "circle" ? "70px" : "100%")};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({shape}) => (shape === "circle" ? "50%" : "0")};
`;

ImagePreview.propTypes = {
  type: PropTypes.string.isRequired,
  shape: PropTypes.string,
  data: PropTypes.object,
};

ImagePreview.defaultProps = {
  shape: "",
  data: {},
};

export default ImagePreview;
