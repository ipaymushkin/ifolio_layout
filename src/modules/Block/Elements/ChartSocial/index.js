import React, {useEffect, useRef, useCallback, useState} from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import {Wrapper, ChartStyled} from "modules/Block/Elements/ChartNew/styled";
import {isIntoView} from "utils/checkElementIntoView";
import {noDataChartConfig} from "utils/NoDataChartConfig";

require("highcharts/highcharts-more.src")(Highcharts);
require("highcharts/modules/no-data-to-display")(Highcharts);
Exporting(Highcharts);

const colors = {
  Facebook: "#3b5998",
  LinkedIn: "#0077b5",
  Instagram: {
    linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
    stops: [
      [0, "#5e53c9"], // start
      [0.4, "#c8307d"], // middle
      [1, "#fb9012"], // end
    ],
  },
  Twitter: "#55acee",
};

const renderFontSize = (number) => {
  if (number >= 100000) {
    return "36px";
  } else if (number >= 10000) {
    return "42px";
  } else if (number >= 1000) {
    return "46px";
  } else if (number >= 100) {
    return "54px";
  }
  return "60px";
};

const Chart = ({data}) => {
  const chartRef = useRef(null);
  const chart = useRef(null);
  const lastInView = useRef(false);
  const path = "social-views";

  const [subtitleConfig, setSubtitleConfig] = useState({
    text: ``,
    verticalAlign: "middle",
    floating: true,
    y: 20,
    useHTML: true,
  });

  const mouseOverHandle = (data) => {
    setSubtitleConfig((state) => ({
      ...state,
      text: `
        <div style="display: flex; flex-direction: column; align-items: center">
          <span style='color: #3b5998; font-size: ${renderFontSize(
            data.y
          )}; font-family: "HelveticaNeue-heavy", Arial, sans-serif; letter-spacing: 0.35px; text-align: center;  margin-bottom: 5px;'>
            ${data.y}</span>
          <span style='font-size: 12px; color: #6a7984; font-family: "HelveticaNeue-medium", Arial, sans-serif; letter-spacing: 0.25px; text-align: center; line-height: 20px;'>
            ${data.name}
            <br/>
            ${data.percentage.toFixed(2)}%
          </span>
        </div>
`,
    }));
  };

  const createChart = useCallback(() => {
    const config =
      Object.keys(data).length > 0
        ? {
            chart: {
              type: "pie",
              margin: [0, 0, 0, 0],
              spacingTop: 0,
              spacingBottom: 0,
              spacingLeft: 0,
              spacingRight: 0,
              inverted: false,
              height: 220,
              style: {
                fontFamily: "'HelveticaNeue-light', Arial, sans-serif",
              },
            },
            subtitle: subtitleConfig,
            tooltip: false,
            credits: {enabled: false},
            exporting: {enabled: false},
            title: false,
            plotOptions: {
              pie: {
                size: "100%",
                center: [90, 90],
                innerSize: "68%",
                dataLabels: {
                  enabled: false,
                },
              },
              series: {
                cursor: "pointer",
                point: {
                  events: {
                    mouseOver: function (e) {
                      mouseOverHandle(this);
                    },
                  },
                },
              },
            },
            series: [
              {
                data: data.map(({views, source}) => ({
                  name: source,
                  y: views,
                  color: colors[source],
                })),
                showInLegend: true,
              },
            ],
            legend: false,
          }
        : noDataChartConfig;

    chart.current = Highcharts.chart(path, config);
  }, [data, subtitleConfig]);

  useEffect(() => {
    createChart();
    const inViewPort = isIntoView(chartRef.current);
    lastInView.current = inViewPort;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (chart.current) {
      chart.current.setSubtitle(subtitleConfig);
    }
  }, [subtitleConfig, data]);

  useEffect(() => {
    if (data[0]?.views) {
      const maxSource = data[0];
      const total = data.reduce(
        (accumulator, currentValue) => (accumulator += currentValue.views),
        0
      );
      const percentage = (maxSource.views * 100) / total;

      setSubtitleConfig((state) => ({
        ...state,
        text: `
      <div style="display: flex; flex-direction: column; align-items: center">
        <span style='color: #3b5998; font-size: ${renderFontSize(
          maxSource.views
        )}; font-family: "HelveticaNeue-heavy", Arial, sans-serif; letter-spacing: 0.35px; text-align: center;  margin-bottom: 5px;'>
          ${maxSource.views}</span>
        <span style='font-size: 12px; color: #6a7984; font-family: "HelveticaNeue-medium", Arial, sans-serif; letter-spacing: 0.25px; text-align: center; line-height: 20px;'>
          ${maxSource.source}
          <br/>
          ${percentage.toFixed(2)}%
        </span>
      </div>
      `,
      }));
    }
  }, [data]);

  return (
    <Wrapper ref={chartRef}>
      <ChartStyled id={path} />
    </Wrapper>
  );
};

Chart.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.array,
};

Chart.defaultProps = {
  data: [],
};

export default Chart;
