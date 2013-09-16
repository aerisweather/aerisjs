define([
  'aeris/util',
  'aeris/promise',
  'aeris/jsonp',
  'geolocate/abstractgeolocateservice',
  'geolocate/geolocateposition',
  'geolocate/geolocateerror'
], function(_, Promise, JSONP, AbstractGeolocateService, GeolocatePosition, GeolocateError) {
  /**
   * @override
   *
   * @param {string=} opt_options.ip_address
   *                  The IP address to locate.
   *                  If not defined, FreeGeoIP will use
   *                  the current user's IP address.
   * @param {Object=} opt_options.jsonp The JSONP service to use.
   *
   * @class aeris.geolocate.FreeGeoIPGeolocateService
   * @extends aeris.geolocate.AbstractGeolocateService
   * @constructor
   */
  var FreeGeoIPGeolocateService = function(opt_options) {
    AbstractGeolocateService.call(this, opt_options);


    /**
     * The url of the FreeGeoIP API.
     * @type {string}
     * @private
     */
    this.url_ = 'http://freegeoip.net/json/' + (this.options_.ip_address || '');

    /**
     * @type {aeris.JSONP}
     * @private
     */
    this.jsonp_ = this.options_.jsonp || JSONP;

    /**
     * The interval timer id
     * returned by window.setInterval.
     *
     * Saved, so we can clear it later.
     *
     * @type {number}
     * @private
     */
    this.watchId_ = null;

    /**
     * The most recent results returned from the API.
     * @type {aeris.geolocate.GeolocatePosition}
     */
    this.lastPosition_;
  };

  _.inherits(FreeGeoIPGeolocateService, AbstractGeolocateService);


  /**
   * @override
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
   * @override
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
   * @override
   */
  FreeGeoIPGeolocateService.prototype.clearWatch = function() {
    if (_.isNull(this.watchId_)) { return; }

    window.clearInterval(this.watchId_);
    this.lastPosition_ = null;
  };


  /**
   * @override
   */
  FreeGeoIPGeolocateService.prototype.isSupported = function() {
    return true;
  };


  /**
   * Resolve a geolocation service promise with data returned
   * from FreeGeoIP.
   *
   * @param {aeris.Promise} promise
   * @param {Object} data
   * @private
   */
  FreeGeoIPGeolocateService.prototype.resolve_ = function(promise, data) {
    if (!data || !_.isNumber(data.latitude) || !_.isNumber(data.longitude)) {
      promise.reject(new GeolocateError({
        code: GeolocateError.POSITION_UNAVAILABLE,
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
