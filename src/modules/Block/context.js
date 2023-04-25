import React from "react";

export const BlockContext = React.createContext({
  isEdit: false,
  index: 0,
  isTemplate: false,
  fraction: 0,
  isSpan: false,
  blockId: 0,
  getCounter: () => null,
  setCounter: () => null,
  refreshCounter: () => null,
  isMobile: false,
  adaptiveCols: 0,
  adaptiveWidth: 0,
  blockWidth: 0,
  onlyPreview: false,
  isParallax: false,
});
