define(["aeris", "base/layer"], function(aeris) {

  aeris.provide("aeris.maps.openlayers.layers.OSM");

  aeris.maps.openlayers.layers.OSM = function() {
    this.layer = new OpenLayers.Layer.OSM("OSM", null, {
      transitionEffect: 'resize'
    });
  };
  aeris.inherits(aeris.maps.openlayers.layers.OSM, aeris.maps.Layer);

  aeris.extend(aeris.maps.openlayers.layers.OSM.prototype, {
    setMap: function(map) {
      map.addLayer(this.layer);
    }
  });

  return aeris.maps.openlayers.layers.OSM;
});
