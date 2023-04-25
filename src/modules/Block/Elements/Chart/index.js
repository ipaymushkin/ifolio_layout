import React, {useEffect} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import ChartJs from "chart.js";
import MediaController from "modules/Block/Elements/MediaController";
import {IconChart} from "icons/IconChart";
import {show} from "redux-modal";

const Chart = ({path, config}) => {
  const chartConfig = JSON.parse(config);

  const dispatch = useDispatch();

  const canvasId = `chart-${path}`;

  useEffect(() => {
    if (chartConfig) {
      new ChartJs(document.getElementById(canvasId).getContext("2d"), chartConfig);
    }
  }, [canvasId, chartConfig]);

  const onChartBuilderOpen = () => {
    dispatch(show("chart-builder", {path, config}));
  };

  return (
    <>
      <MediaController
        bottomHandler={[{icon: IconChart, action: onChartBuilderOpen}]}
        topHandler={[]}
      />
      <ChartStyled>
        <ChartContainer id={canvasId} />
      </ChartStyled>
    </>
  );
};

const ChartStyled = styled.div`
  width: 100%;
`;
const ChartContainer = styled.canvas`
  width: 100%;
`;

Chart.propTypes = {
  path: PropTypes.string.isRequired,
  config: PropTypes.string.isRequired,
};

export default Chart;
