define(["aeris", "base/map", "./mapoptions"],
function(aeris, Map, MapOptions) {

  aeris.Map = function(div, options) {
    Map.call(this, div, options);
  };
  aeris.inherits(aeris.Map, Map);

  aeris.extend(aeris.Map.prototype, {
    apiMapClass:     google.maps.Map,
    mapOptionsClass: MapOptions,

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

  return aeris.Map;
});
