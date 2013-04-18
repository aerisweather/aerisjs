define(["aeris", "base/mapoptions"], function(aeris) {

  aeris.provide("aeris.maps.gmaps.MapOptions");

  aeris.maps.gmaps.MapOptions = function(aerisMap, options) {
    aeris.maps.MapOptions.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.gmaps.MapOptions, aeris.maps.MapOptions);

  aeris.extend(aeris.maps.gmaps.MapOptions.prototype, {
    setBaseLayer: function(layer) {
      layer.setMap(this.map);
    },

    setCenter: function(center) {
      this.map.setCenter(center);
    },

    setZoom: function(zoom) {
      this.map.setZoom(zoom);
    }
  });

  return aeris.maps.gmaps.MapOptions;
});
