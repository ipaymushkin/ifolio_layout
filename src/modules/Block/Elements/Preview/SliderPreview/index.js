import React from "react";
import styled from "styled-components";
import {Icon} from "components/Icon";
import ImagePreviewIcon from "icons/ImagePreviewIcon";
import ArrowIcon from "components/Icons/ArrowIcon";
import PropTypes from "prop-types";
import {AvatarIcon} from "icons/AvatarIcon";

const SliderPreview = ({data}) => {
  const _renderIcons = ({slidesToShow, shape}) => {
    return new Array(slidesToShow).fill(0).map((item, i) => (
      <Preview shape={shape}>
        <Icon
          key={i}
          icon={shape === "circle" ? AvatarIcon : ImagePreviewIcon}
          color={"#25BEC8"}
          size={50}
        />
      </Preview>
    ));
  };

  return (
    <Wrapper>
      <Arrow>
        <Icon icon={ArrowIcon} color={"#25BEC8"} />
      </Arrow>
      <Slider>{_renderIcons(data)}</Slider>
      <Arrow>
        <Icon icon={ArrowIcon} color={"#25BEC8"} rotate={180} />
      </Arrow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow: hidden;
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Arrow = styled.div`
  flex: 0 0 auto;
`;

const Slider = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  justify-content: space-between;
`;

const Preview = styled.div`
  background-color: ${({shape}) => (shape === "circle" ? "transparent" : "#defafa")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  margin: 5px;
`;

SliderPreview.propTypes = {
  data: PropTypes.object,
};

export default SliderPreview;
