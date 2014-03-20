define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'googlemaps!'
], function(_, InvalidArgumentError, gmaps) {
  return {
    /**
     * Convert an array of latitude and longitude to Google's Lat/Lng object.
     *
     * @param {aeris.maps.LatLon} latLon
     * @return {google.maps.LatLng}
     * @method arrayToLatLng
     */
    arrayToLatLng: function(latLon) {
      if (_.isArray(latLon)) {
        latLon = new gmaps.LatLng(latLon[0], latLon[1]);
      }
      return latLon;
    },


    /**
     * Converts a {google.maps.LatLng} object
     * to a plain array
     *
     * @param {google.maps.LatLng} latLng
     * @return {aeris.maps.LatLon}
     * @method latLngToArray
     */
    latLngToArray: function(latLng) {
      if (latLng.lat && latLng.lng) {
        return [latLng.lat(), latLng.lng()];
      }

      throw new InvalidArgumentError('Expecting google.maps.LatLng object. Instead got: ' + latLng);
    },


    /**
     * Converts a path array to
     * an array of {google.maps.LatLng} objects.
     *
     * @param {aeris.maps.Path} path
     * @return {Array.<google.maps.LatLng>}
     * @method pathToLatLng
     */
    pathToLatLng: function(path) {
      var latLng = [];
      for (var i = 0; i < path.length; i++) {
        latLng.push(new gmaps.LatLng(path[i][0], path[i][1]));
      }

      return latLng;
    },


    /**
     * Converts an array of {google.maps.LatLng} objects
     * to a plain path array.
     *
     * @param {Array.<google.maps.LatLng>} latLng
     * @return {aeris.maps.Path}
     * @method latLngToPath
     */
    latLngToPath: function(latLng) {
      path = [];
      for (var i = 0; i < latLng.length; i++) {
        path.push([latLng[i].lat(), latLng[i].lng()]);
      }

      return path;
    },


    /**
     * @param {google.maps.LatLngBounds} bounds
     * @return {aeris.maps.Bounds} SW and NE Corner LatLons.
     * @method boundsToArray
     */
    boundsToArray: function(bounds) {
      var swLatLon = this.latLngToArray(bounds.getSouthWest());
      var neLatLon = this.latLngToArray(bounds.getNorthEast());
      return [swLatLon, neLatLon];
    },

    /**
     * Converts an array of SW/NE coordinates
     * to a google LatLngBounds object.
     *
     * @param {aeris.maps.Bounds} bounds LatLons of SW and NE corners.
     * @return {google.maps.LatLngBounds}
     * @method arrayToBounds
     */
    arrayToBounds: function(bounds) {
      return new gmaps.LatLngBounds(
        this.arrayToLatLng(bounds[0]),
        this.arrayToLatLng(bounds[1])
      );
    }
  };

});
