define(function() {
  /**
   * @param {Object} error Error object.
   * @class aeris.geolocate.GeolocateError
   * @constructor
   */
  var GeolocateError = function(error) {
    /**
     * Error message
     * @member {string} message
     */

    /**
     * Error code.
     * @member {number} code
     */

    /**
     * Permission denied error code: (1)
     * The user did not allow Geolocation.
     * @member {number} PERMISSION_DENIED
     */
    error.PERMISSION_DENIED = 1;

    /**
     * Position unavailable error code: (2)
     * It is not possible to get the current location
     * @member {number} POSITION_UNAVAILABLE
     */
    error.POSITION_UNAVAILABLE = 2;

    /**
     * Timeout error code: (3)
     * The geolocation operation timed out.
     * @member {number} TIMEOUT
     */
    error.TIMEOUT = 3;

    return error;
  };

  GeolocateError.PERMISSION_DENIED = 1;
  GeolocateError.POSITION_UNAVAILABLE = 2;
  GeolocateError.TIMEOUT = 3;

  return GeolocateError;
});
