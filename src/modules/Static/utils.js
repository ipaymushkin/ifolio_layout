export const getCrop = (item) =>
  !item.crop || Array.isArray(item.crop) ? {} : item.crop;

export const createWidgetPath = (name, blockIdx, chartIdx) =>
  `${name}_${blockIdx}_${chartIdx}`;

export const setScriptConfig = ({config, widget, path, props}) => [
  (config[widget] = {...config[widget], [path]: props}),
];
