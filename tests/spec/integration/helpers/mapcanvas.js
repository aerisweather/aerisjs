define([
  'aeris/util'
], function(_) {
  /**
   * @class MockMapCanvas
   * @param {string} opt_id Element id attribute.
   * @return {HTMLElement}
   * @constructor
   */
  var MapCanvas = function(opt_id) {
    var mapCanvas = document.createElement('div');
    var id = opt_id || _.uniqueId('MAP_CANVAS_ID_');
    mapCanvas.setAttribute('id', id);
    mapCanvas.style.height = '100px';

    document.body.appendChild(mapCanvas);

    mapCanvas.remove = function() {
      mapCanvas.parentNode.removeChild(mapCanvas);
    };

    return mapCanvas;
  };

  // Clean up map canvas elements
  afterEach(function() {
    $('[id^=MAP_CANVAS_ID_]').remove();
  });



  return MapCanvas;
});
