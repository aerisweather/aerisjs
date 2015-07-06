define([
  'aeris/util',
  'leaflet'
], function(_, Leaflet) {
  /**
   * Utility methods for the Aeris Leaflet maps strategy.
   *
   * @class aeris.maps.leaflet.util
   * @static
   */
  var util = {
    /**
     * @method toAerisLatLong
     * @param {L.LatLng} leafletLatLng
     * @return {aeris.maps.LatLon}
     */
    toAerisLatLon: function(leafletLatLng) {
      var wrappedLatLng = leafletLatLng.wrap();
      return [wrappedLatLng.lat, wrappedLatLng.lng];
    },

    /**
     * @method toAerisBounds
     * @param {L.LatLngBounds} leafletBounds
     * @return {aeris.maps.Bounds}
     */
    toAerisBounds: function(leafletBounds) {
      var sw = leafletBounds.getSouthWest();
      var ne = leafletBounds.getNorthEast();
      return [
        util.toAerisLatLon(sw),
        util.toAerisLatLon(ne)
      ];
    },

    /**
     * @param {aeris.maps.LatLon} aerisLatLon
     * @return {L.LatLng}
     */
    toLeafletLatLng: function(aerisLatLon) {
      return new Leaflet.LatLng(aerisLatLon[0], aerisLatLon[1]);
    },

    /**
     * @param {aeris.maps.Bounds} aerisBounds
     * @return {L.LatLngBounds}
     */
    toLeafletBounds: function(aerisBounds) {
      var sw = new Leaflet.LatLng(aerisBounds[0][0], aerisBounds[0][1]);
      var ne = new Leaflet.LatLng(aerisBounds[1][0], aerisBounds[1][1]);

      return new Leaflet.LatLngBounds(sw, ne);
    }
  };

  return util;
});
