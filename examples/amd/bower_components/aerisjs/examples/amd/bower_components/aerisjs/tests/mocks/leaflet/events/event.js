define([
  'leaflet'
], function(Leaflet) {
  var LeafletEvent = function(evt) {
    return _.defaults(evt, {
      originalEvent: {
        shiftKey: false
      },
      containerPoint: Leaflet.point(123, 456),
      layerPoint: Leaflet.point(987, 654)
    });
  };


  return LeafletEvent;
});
