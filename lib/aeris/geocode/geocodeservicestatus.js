define(['aeris/util'], function(_) {
  /**
   * Possible status values provided by a {aeris.geocode.GeocodeServiceResponse}.
   *
   * @class GeocodeServiceStatus
   * @namespace aeris.geocode
   * @static
   * @readonly
   * @enum {string}
   */
  return _.expose({
    OK: 'OK',
    /**
     * The API return an unspecified error.
     * See the response message for error details.
     */
    API_ERROR: 'API_ERROR',
    /**
     * Unable to process the geocoding request.
     * See the response message for error details.
     */
    INVALID_REQUEST: 'INVALID_REQUEST',
    NO_RESULTS: 'NO_RESULTS'
  }, 'aeris.geocode.GeocodeServiceStatus');
});
