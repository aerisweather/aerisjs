define([
  'aeris/util'
], function(_) {
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


  return MapCanvas;
});
