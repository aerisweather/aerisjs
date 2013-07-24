define(['aeris'], function(aeris) {

  /**
   * @fileoverview Google Maps utility methods and helpers.
   */


  aeris.provide('aeris.maps.gmaps.utils');


  return aeris.maps.gmaps.utils = {
    /**
     * Convert an array of latitude and longitude to Google's Lat/Lng object.
     *
     * @param {Array.<number>} latLon
     * @return {google.maps.LatLng}
     */
    arrayToLatLng: function(latLon) {
      if (latLon instanceof Array) {
        latLon = new google.maps.LatLng(latLon[0], latLon[1]);
      }
      return latLon;
    },


    /**
     * Converts a {google.maps.LatLng} object
     * to a plain array
     *
     * @param {google.maps.LatLng} latLng
     * @return {Array.<number>}
     */
    latLngToArray: function(latLng) {
      if (latLng.lat && latLng.lng) {
        return [latLng.lat(), latLng.lng()];
      }
      return latLng;
    },


    /**
     * Converts a path array to
     * an array of {google.maps.LatLng} objects.
     *
     * @param {Array.<Array.<number>>} path
     * @return {Array.<google.maps.LatLng>}
     */
    pathToLatLng: function(path) {
      var latLng = [];
      for (var i = 0; i < path.length; i++) {
        latLng.push(new google.maps.LatLng(path[i][0], path[i][1]));
      }

      return latLng;
    },


    /**
     * Converts an array of {google.maps.LatLng} objects
     * to a plain path array.
     *
     * @param {Array.<google.maps.LatLng>} latLng
     * @return {Array.<Array.<number>>}
     */
    latLngToPath: function(latLng) {
      path = [];
      for (var i = 0; i < latLng.length; i++) {
        path.push([latLng[i].lat(), latLng[i].lng()]);
      }

      return path;
    }
  };

});
