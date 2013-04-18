define(["aeris", "base/map", "./mapoptions"], function(aeris) {

  aeris.provide("aeris.maps.gmaps.Map");

  aeris.maps.gmaps.Map = function(div, options) {
    aeris.maps.Map.call(this, div, options);
  };
  aeris.inherits(aeris.maps.gmaps.Map, aeris.maps.Map);

  aeris.extend(aeris.maps.gmaps.Map.prototype, {
    apiMapClass:     google.maps.Map,
    mapOptionsClass: aeris.maps.gmaps.MapOptions,

    createMap: function(div) {
      if (typeof div == 'string') {
        div = document.getElementById(div);
      }

      return new this.apiMapClass(div);
    },

    toLatLon: function(val) {
      if (val instanceof Array) {
        val = new google.maps.LatLng(val[0], val[1]);
      }
      return val;
    }
  });

  return aeris.maps.gmaps.Map;
});
