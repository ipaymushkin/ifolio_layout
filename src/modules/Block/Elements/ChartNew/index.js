import React, {useEffect, useRef, useCallback, memo, useMemo} from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import {show} from "redux-modal";
import {useDispatch} from "react-redux";
import MediaController from "modules/Block/Elements/MediaController";
import {IconChart} from "icons/IconChart";
import {Wrapper, ChartStyled} from "modules/Block/Elements/ChartNew/styled";
import {isIntoView} from "utils/checkElementIntoView";
import fullscreenEventListener from "./fullscreenEventListener";

require("highcharts/highcharts-more.src")(Highcharts);
require("highcharts/modules/no-data-to-display")(Highcharts);
Exporting(Highcharts);
fullscreenEventListener(Highcharts);

const Chart = memo(
  ({
    path,
    config,
    isEdit,
    blockIndex,
    fraction,
    isAdaptive,
    theme = {},
    disableHideSeries,
  }) => {
    const dispatch = useDispatch();
    const chartRef = useRef(null);

    const chart = useRef(null);
    const timer = useRef(null);
    const lastInView = useRef(false);

    useEffect(() => {
      Highcharts.setOptions(theme);
    }, [theme]);

    const setDrawLegendSymbol = useCallback((types) => {
      types.map((type) => {
        Highcharts.seriesTypes[type].prototype.drawLegendSymbol =
          Highcharts.seriesTypes.line.prototype.drawLegendSymbol;
      });
    }, []);

    const createChart = useCallback(() => {
      setDrawLegendSymbol(["area", "areaspline"]);
      if (typeof config === "object") {
        chart.current = Highcharts.chart(path, config);
      } else {
        const parsedConfig = JSON.parse(config);
        if (parsedConfig?.chart) {
          parsedConfig.chart.events = {};
          parsedConfig.chart.events.beforePrint = function () {
            // this.orgChartWidth = this.chartWidth;
            // this.orgChartHeight = this.chartHeight;
            this.orgPosition =
              document.documentElement.scrollTop || document.body.scrollTop;
          };
          parsedConfig.chart.events.afterPrint = function () {
            //  this.setSize(this.orgChartWidth, this.orgChartHeight, false);

            if (typeof Event === "function") {
              // modern browsers
              window.dispatchEvent(new Event("resize"));
            } else {
              // for IE and other old browsers
              // causes deprecation warning on modern browsers
              var evt = window.document.createEvent("UIEvents");
              evt.initUIEvent("resize", true, false, window, 0);
              window.dispatchEvent(evt);
            }
            document.body.scrollTop = this.orgPosition;
          };
        }

        chart.current = Highcharts.chart(path, parsedConfig);
      }
    }, [config, path, setDrawLegendSymbol]);

    const hideSeries = useCallback(() => {
      chart.current.series.forEach((e) => e.setVisible(false));
    }, []);

    useEffect(() => {
      createChart();
      const inViewPort = isIntoView(chartRef.current);
      lastInView.current = inViewPort;
      if (!inViewPort && !disableHideSeries) {
        hideSeries();
      }
    }, [config, createChart, disableHideSeries, hideSeries, path]);

    useEffect(() => {
      if (chart.current?.reflow) chart.current.reflow();
    }, [fraction, isAdaptive]);

    const scrollHandler = useCallback(() => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        clearTimeout(timer.current);
        const inViewPort = isIntoView(chartRef.current);
        if (inViewPort && !lastInView.current) {
          lastInView.current = true;
          createChart();
        } else if (!inViewPort && lastInView.current) {
          lastInView.current = false;
          if (!disableHideSeries) {
            hideSeries();
          }
        }
      }, 100);
    }, [createChart, disableHideSeries, hideSeries]);

    useEffect(() => {
      scrollHandler();
      window.addEventListener("scroll", scrollHandler, false);

      return () => {
        clearTimeout(timer.current);
        window.removeEventListener("scroll", scrollHandler, false);
      };
    }, [scrollHandler]);

    const onChartBuilderOpen = useCallback(() => {
      dispatch(show("chart-builder", {path, config, blockIndex}));
    }, [blockIndex, config, dispatch, path]);

    const {topHandler, bottomHandler} = useMemo(
      () => ({
        topHandler: [{icon: IconChart, action: onChartBuilderOpen}],
        bottomHandler: [],
      }),
      [onChartBuilderOpen]
    );

    return (
      <Wrapper isEdit={isEdit} ref={chartRef}>
        <MediaController
          bottomHandler={bottomHandler}
          topHandler={topHandler}
          isEdit={isEdit}
          isChart={true}
        />
        <ChartStyled id={path} />
      </Wrapper>
    );
  }
);

Chart.propTypes = {
  path: PropTypes.string.isRequired,
  config: PropTypes.string,
  isEdit: PropTypes.bool,
  blockIndex: PropTypes.number,
  fraction: PropTypes.number,
  isAdaptive: PropTypes.bool,
  disableHideSeries: PropTypes.bool,
};

Chart.defaultProps = {
  config: "{}",
  isEdit: false,
  fraction: 0,
  blockIndex: -1,
  isAdaptive: false,
  path: "path",
  disableHideSeries: false,
};

export default Chart;
