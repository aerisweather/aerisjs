define(["aeris", "base/layer"], function(aeris, Layer) {

  aeris.layers.OSM = function() {
    this.layer = new OpenLayers.Layer.OSM("OSM", null, {
      transitionEffect: 'resize'
    });
  };
  aeris.inherits(aeris.layers.OSM, Layer);

  aeris.extend(aeris.layers.OSM.prototype, {
    setMap: function(map) {
      map.addLayer(this.layer);
    }
  });

  return aeris.layers.OSM;
});
