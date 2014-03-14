define([
  'aeris/errors/errortypefactory'
], function(ErrorTypeFactory) {
  /**
   * @class GeolocateServiceError
   * @namespace aeris.geolocate.errors
   * @extends aeris.errors.AbstractError
   *
   * @param {Object} errorObj
   * @constructor
   */
  var GeolocateServiceError = function(errorObj) {
    var ErrorType = new ErrorTypeFactory({
      name: 'GeolocateServiceError'
    });

    var error = new ErrorType(errorObj.message);


    /**
     * Error code.
     * @member {number} code
     */
    error.code = errorObj.code;

    /**
     * Permission denied error code
     * The user did not allow Geolocation.
     * @member {number} PERMISSION_DENIED
     */
    error.PERMISSION_DENIED = GeolocateServiceError.PERMISSION_DENIED;

    /**
     * Position unavailable error code
     * It is not possible to get the current location
     * @member {number} POSITION_UNAVAILABLE
     */
    error.POSITION_UNAVAILABLE = GeolocateServiceError.POSITION_UNAVAILABLE;

    /**
     * Timeout error code
     * The geolocation operation timed out.
     * @member {number} TIMEOUT
     */
    error.TIMEOUT = GeolocateServiceError.TIMEOUT;


    return error;
  };

  GeolocateServiceError.PERMISSION_DENIED = 1;
  GeolocateServiceError.POSITION_UNAVAILABLE = 2;
  GeolocateServiceError.TIMEOUT = 3;


  return GeolocateServiceError;
});
