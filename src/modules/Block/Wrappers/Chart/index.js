import React, {memo, useContext, useMemo} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import get from "lodash/get";
import {lineConfig} from "config/chartConfigs";
// import Chart from "modules/Block/Elements/Chart";
import Chart from "modules/Block/Elements/ChartNew";
import {BlockContext} from "../../context";

const ChartReduxWrapper = memo(({chartIndex, isAdaptive}) => {
  const {index: blockIndex, fraction, isEdit, isMobile} = useContext(BlockContext);

  const customList = useSelector((state) =>
    get(state.folio.structure, `[${blockIndex}].content.custom`, [])
  );

  const {config, chartPosition} = useMemo(() => {
    let counter = 0,
      config = lineConfig,
      chartPosition = -1;
    customList.forEach(({type, props}, idx) => {
      if (type === "chart") {
        if (chartIndex === counter) {
          config = props;
          chartPosition = idx;
        }
        counter++;
      }
    });
    if (chartPosition === -1) chartPosition = chartIndex;
    return {config, chartPosition};
  }, [chartIndex, customList]);

  return (
    <Chart
      path={`structure[${blockIndex}].content.custom[${chartPosition}]`}
      config={JSON.stringify(config)}
      blockIndex={blockIndex}
      fraction={fraction}
      isEdit={isEdit && !isMobile}
      isAdaptive={isAdaptive}
    />
  );
});

ChartReduxWrapper.propTypes = {
  chartIndex: PropTypes.number.isRequired,
  isAdaptive: PropTypes.bool,
};

ChartReduxWrapper.defaultProps = {
  isAdaptive: false,
};

export default ChartReduxWrapper;
