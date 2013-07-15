define(['aeris'], function(aeris) {

  /**
   * @fileoverview Google Maps utility methods and helpers.
   */


  aeris.provide('aeris.maps.gmaps.utils');


  /**
   * Convert an array of latitude and longitude to Google's Lat/Lng object.
   *
   * @param {Array.<number>} latLon
   * @return {google.maps.LatLng}
   */
  aeris.maps.gmaps.utils.arrayToLatLng = function(latLon) {
    if (latLon instanceof Array) {
      latLon = new google.maps.LatLng(latLon[0], latLon[1]);
    }
    return latLon;
  };

  return aeris.maps.gmaps.utils;

});
