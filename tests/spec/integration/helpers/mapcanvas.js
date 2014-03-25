define(function() {
  var MapCanvas = function(opt_id) {
    var mapCanvas = document.createElement('div');
    var id = opt_id || 'MAP_CANVAS_ID';
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
