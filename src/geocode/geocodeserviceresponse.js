define(function() {
  /**
   * A response to a geocode service request
   *
   * @class GeocodeServiceResponse
   * @namespace aeris.geocode
   * @constructor
   */
  var GeocodeServiceResponse = function(responseObj) {
    /**
     * @type {Array.<number>|undefined} latLon Geocoded lat/Lon coordinates.
     */

    /**
     * @type {Object} status
     * @property {aeris.geocode.GeocodeServiceStatus} code Aeris error code.
     * @property {*|undefined} apiCode Code returned by the Geocoding service API.
     * @property {string} message Status message.
     */


    return responseObj;
  };

  return GeocodeServiceResponse;
});
