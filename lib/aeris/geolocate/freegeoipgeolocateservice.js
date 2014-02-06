define([
  'ai/util',
  'ai/promise',
  'ai/geolocate/options/freegeoipserviceoptions',
  'ai/geolocate/results/geolocateposition',
  'ai/geolocate/errors/geolocateserviceerror'
], function(_, Promise, FreeGeoIPServiceOptions, GeolocatePosition, GeolocateServiceError) {
  /**
   * @publicApi
   * @class FreeGeoIPGeolocateService
   * @namespace aeris.geolocate
   * @implements aeris.geolocate.GeolocateServiceInterface
   * @constructor
   * 
   * @param {aeris.geolocate.options.FreeGeoIPServiceOptions} opt_options
   */
  var FreeGeoIPGeolocateService = function(opt_options) {
    var options = new FreeGeoIPServiceOptions(opt_options);


    /**
     * The url of the FreeGeoIP API.
     * @type {string}
     * @private
     * @property url_
     */
    this.url_ = 'http://freegeoip.net/json/' + options.ip_address;

    /**
     * @type {aeris.JSONP}
     * @private
     * @property jsonp_
     */
    this.jsonp_ = options.jsonp;

    /**
     * The interval timer id
     * returned by window.setInterval.
     *
     * Saved, so we can clear it later.
     *
     * @type {number}
     * @private
     * @property watchId_
     */
    this.watchId_ = null;

    /**
     * The most recent results returned from the API.
     * @type {aeris.geolocate.results.GeolocatePosition}
     * @property lastPosition_
     */
    this.lastPosition_;
  };


  /**
   * @method getCurrentPosition
   */
  FreeGeoIPGeolocateService.prototype.getCurrentPosition = function() {
    var promise = new Promise();

    this.jsonp_.get(
      this.url_,
      {},
      _.bind(this.resolve_, this, promise)
    );

    return promise;
  };


  /**
   * @method watchPosition
   */
  FreeGeoIPGeolocateService.prototype.watchPosition = function(onSuccess, onError, opt_options) {
    var options = _.extend({
      interval: 3000
    }, opt_options);
    var self = this;

    onSuccess || (onSuccess = function() {});
    onError || (onError = function() {});

    var updatePosition = function() {
      self.getCurrentPosition().
        done(function(res) {
          // Only call callback if the
          // position has changed.
          if (
            !self.lastPosition_ ||
            !_.isEqual(res, self.lastPosition_)
          ) {
            onSuccess(res);
            self.lastPosition_ = res;
          }
        }).
        fail(onError);
    };

    this.watchId_ = window.setInterval(updatePosition, options.interval);
    updatePosition();
  };


  /**
   * @method clearWatch
   */
  FreeGeoIPGeolocateService.prototype.clearWatch = function() {
    if (_.isNull(this.watchId_)) { return; }

    window.clearInterval(this.watchId_);
    this.lastPosition_ = null;
  };


  /**
   * @method isSupported
   */
  FreeGeoIPGeolocateService.isSupported = function() {
    return true;
  };


  /**
   * Resolve a geolocation service promise with data returned
   * from FreeGeoIP.
   *
   * @param {aeris.Promise} promise
   * @param {Object} data
   * @private
   * @method resolve_
   */
  FreeGeoIPGeolocateService.prototype.resolve_ = function(promise, data) {
    if (!data || !_.isNumber(data.latitude) || !_.isNumber(data.longitude)) {
      promise.reject(new GeolocateServiceError({
        code: GeolocateServiceError.POSITION_UNAVAILABLE,
        message: 'FreeGeoIP returned unexpected data.'
      }));
    }
    else {
      promise.resolve(new GeolocatePosition({
        latLon: [data.latitude, data.longitude]
      }));
    }
  };


  return _.expose(FreeGeoIPGeolocateService, 'aeris.geolocate.FreeGeoIPGeolocateService');
});
