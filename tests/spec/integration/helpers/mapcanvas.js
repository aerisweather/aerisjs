define(function() {
  var MapCanvas = function(id) {
    var mapCanvas = document.createElement('div');
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
