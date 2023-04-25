import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ImagePreview from "./Elements/Preview/ImagePreview";
import TitlePreview from "./Elements/Preview/TitlePreview";
import DescriptionPreview from "./Elements/Preview/DescriptionPreview";
import SliderPreview from "./Elements/Preview/SliderPreview";
import TurnTablePreview from "./Elements/Preview/TurnTablePreview";

const BlockPreview = ({type: previewType, data}) => {
  let type = data.type || previewType;

  if (previewType === "slider") {
    type = previewType;
  }
  let content = <ImagePreview type={type} data={data} />;

  if (type === "title") {
    content = <TitlePreview />;
  } else if (type === "description") {
    content = <DescriptionPreview />;
  } else if (type === "slider") {
    content = <SliderPreview data={data} />;
  } else if (type === "turntable") {
    content = <TurnTablePreview />;
  } else if (type === "masonry") {
    content = "masonry";
  }

  return <Wrapper>{content}</Wrapper>;
};

const Wrapper = styled.div`
  width: 100%;
`;

BlockPreview.propTypes = {
  type: PropTypes.string,
  data: PropTypes.object,
};

BlockPreview.defaultProps = {
  data: {},
};

export default BlockPreview;
