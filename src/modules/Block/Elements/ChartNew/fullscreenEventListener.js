const fullscreenEventListener = (H) => {
  if (!H.Fullscreen) {
    return;
  }

  const {addEvent, wrap} = H;

  H.Fullscreen.prototype.open = function () {
    const fullscreen = this;
    const {chart} = fullscreen;
    const originalWidth = chart.chartWidth;
    const originalHeight = chart.chartHeight;

    // eslint-disable-next-line no-restricted-globals
    chart.setSize(screen.width, screen.height, false);
    // @see https://github.com/highcharts/highcharts/issues/13220
    chart.pointer.chartPosition = null;

    fullscreen.originalWidth = originalWidth;
    fullscreen.originalHeight = originalHeight;

    // Handle exitFullscreen() method when user clicks 'Escape' button.
    if (fullscreen.browserProps) {
      fullscreen.unbindFullscreenEvent = addEvent(
        chart.container.ownerDocument, // chart's document
        fullscreen.browserProps.fullscreenChange,
        () => {
          // Handle lack of async of browser's fullScreenChange event.
          if (fullscreen.isOpen) {
            fullscreen.isOpen = false;
            fullscreen.close();
            chart.setSize(originalWidth, originalHeight, false);
            chart.pointer.chartPosition = null;
          } else {
            fullscreen.isOpen = true;
            fullscreen.setButtonText();
          }
        }
      );
      const promise = chart.renderTo[fullscreen.browserProps.requestFullscreen]();
      if (promise) {
        // No dot notation because of IE8 compatibility
        promise["catch"](() => {
          // eslint-disable-next-line no-alert
          alert("Full screen is not supported inside a frame.");
        });
      }
      addEvent(chart, "destroy", fullscreen.unbindFullscreenEvent);
    }
  };

  wrap(H.Fullscreen.prototype, "close", function (proceed) {
    // eslint-disable-next-line prefer-rest-params
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    const fullscreen = this;
    fullscreen.chart.setSize(fullscreen.originalWidth, fullscreen.originalHeight, false);
    fullscreen.chart.pointer.chartPosition = null;
  });
};

export default fullscreenEventListener;
