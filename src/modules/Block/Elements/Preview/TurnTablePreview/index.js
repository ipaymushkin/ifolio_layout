import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {Icon} from "components/Icon";
import TitlePreview from "../TitlePreview";
import ImagePreviewIcon from "icons/ImagePreviewIcon";

const TurnTablePreview = () => {
  return (
    <Wrapper>
      <Item>
        <Icon icon={ImagePreviewIcon} size={50} color={"#25BEC8"} />
        <TitlePreview />
      </Item>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #defafa;
  margin-right: 12px;
  width: 100%;
  height: 100%;
  padding: 12px;
  :last-child {
    margin-right: 0;
  }
`;

TurnTablePreview.propTypes = {
  data: PropTypes.object,
};

export default TurnTablePreview;
