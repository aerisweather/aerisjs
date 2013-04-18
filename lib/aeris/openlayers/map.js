define(["aeris", "base/map", "./mapoptions"],
function(aeris, Map, MapOptions) {

  aeris.Map = function(div, options) {
    Map.call(this, div, options);
  };
  aeris.inherits(aeris.Map, Map);

  aeris.extend(aeris.Map.prototype, {
    apiMapClass:     OpenLayers.Map,
    mapOptionsClass: MapOptions,

    createMap: function(div) {
      return new this.apiMapClass(div);
    },

    toLatLon: function(val) {
      if (val instanceof Array) {
        val = new OpenLayers.LonLat(val[1], val[0]);
        val.transform(new OpenLayers.Projection("EPSG:4326"),
                      new OpenLayers.Projection("EPSG:900913"));
      }
      return val;
    }
  });

  return aeris.Map;
});
