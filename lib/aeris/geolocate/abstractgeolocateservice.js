define([
  'aeris/util'
], function(_) {
  /**
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.enableHighAccuracy
   * @param {number} opt_options.timeout
   * @param {number} opt_options.maximumAge
   *
   * @class aeris.geolocate.AbstractGeolocateService
   * @abstract
   * @constructor
   */
  var AbstractGeolocateService = function(opt_options) {
    var options = _.extend({
      enableHighAccuracy: false,
      maximumAge: 30000,
      timeout: 10000
    }, opt_options);

    /**
     * Geolocation options.
     *
     * @type {Object}
     * @protected
     */
    this.options_ = options;
  };


  /**
   * @return {aeris.Promise} A promise to retrieve the user's current position.
   *                        Promise resolves with a {aeris.geolocate.GeolocatePosition} object.
   *                        Promise rejects with a {aeris.geolocate.GeolocateError} object.
   */
  AbstractGeolocateService.prototype.getCurrentPosition = _.abstractMethod;


  /**
   * @param {Function} onsuccess A callback for when the user's position changes.
   *                           Receives a {aeris.geolocate.GeolocatePosition} object.
   * @param {Function} onerror An error callback.
   *                           Receives a {aeris.geolocate.GeolocateError} object.
   * @param {Object=} opt_options
   * @param {number=} opt_options.interval Interval at which to check for a changed location.
   *                                        This will be ignored if using the native HTML5 geolocation
   *                                        API.
   */
  AbstractGeolocateService.prototype.watchPosition = _.abstractMethod;


  /**
   * Stop watching for a changed position.
   */
  AbstractGeolocateService.prototype.clearWatch = _.abstractMethod;


  /**
   * @return {Boolean} Whether the geolocation service is supported.
   */
  AbstractGeolocateService.prototype.isSupported = _.abstractMethod();


  return AbstractGeolocateService;
});
