define(["aeris", "base/mapoptions"], function(aeris, MapOptions) {

  aeris.MapOptions = function(options) {
    MapOptions.call(this, options);
  };
  aeris.inherits(aeris.MapOptions, MapOptions);

  aeris.extend(aeris.MapOptions.prototype, {
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

  return aeris.MapOptions;
});
