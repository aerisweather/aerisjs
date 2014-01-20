define([
  'ai/util'
], function(_) {
  /**
   * @class aeris.geolocate.GeolocateServiceInterface
   * @interface
   *
   * @param {aeris.geolocate.options.GeolocateServiceOptions=} opt_options
   */
  var GeolocateServiceInterface = function(opt_options) {};


  /**
   * @return {aeris.Promise} A promise to retrieve the user's current position.
   *                        Promise resolves with a {aeris.geolocate.results.GeolocatePosition} object.
   *                        Promise rejects with a {aeris.geolocate.GeolocateError} object.
   */
  GeolocateServiceInterface.prototype.getCurrentPosition = _.abstractMethod;


  /**
   * @param {Function} onsuccess A callback for when the user's position changes.
   *                           Receives a {aeris.geolocate.results.GeolocatePosition} object.
   * @param {Function} onerror An error callback.
   *                           Receives a {aeris.geolocate.GeolocateError} object.
   * @param {Object=} opt_options
   * @param {number=} opt_options.interval Interval at which to check for a changed location.
   *                                        This will be ignored if using the native HTML5 geolocation
   *                                        API.
   */
  GeolocateServiceInterface.prototype.watchPosition = _.abstractMethod;


  /**
   * Stop watching for a changed position.
   */
  GeolocateServiceInterface.prototype.clearWatch = _.abstractMethod;


  /**
   * @static
   * @return {Boolean} Whether the geolocation service is supported.
   */
  GeolocateServiceInterface.isSupported = _.abstractMethod;


  return GeolocateServiceInterface;
});
