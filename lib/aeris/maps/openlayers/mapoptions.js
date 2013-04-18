define(["aeris", "base/mapoptions"], function(aeris) {

  aeris.provide("aeris.maps.openlayers.MapOptions");

  aeris.maps.openlayers.MapOptions = function(aerisMap, options) {
    aeris.maps.MapOptions.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.openlayers.MapOptions, aeris.maps.MapOptions);

  aeris.extend(aeris.maps.openlayers.MapOptions.prototype, {
    setBaseLayer: function(layer) {
      layer.setMap(this.map);
    },

    setCenter: function(center) {
      this.map.setCenter(center);
    },

    setZoom: function(zoom) {
      this.map.zoomTo(zoom);
    }
  });

  return aeris.maps.openlayers.MapOptions;
});
