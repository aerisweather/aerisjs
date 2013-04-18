define(["aeris", "base/map", "./mapoptions"], function(aeris) {

  aeris.provide("aeris.maps.openlayers.Map");

  aeris.maps.openlayers.Map = function(div, options) {
    aeris.maps.Map.call(this, div, options);
  };
  aeris.inherits(aeris.maps.openlayers.Map, aeris.maps.Map);

  aeris.extend(aeris.maps.openlayers.Map.prototype, {
    apiMapClass:     OpenLayers.Map,
    mapOptionsClass: aeris.maps.openlayers.MapOptions,

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

  return aeris.maps.openlayers.Map;
});
