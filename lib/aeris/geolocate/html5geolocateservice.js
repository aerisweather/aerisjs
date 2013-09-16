define([
  'aeris/util',
  'aeris/promise',
  'geolocate/abstractgeolocateservice',
  'geolocate/geolocateposition',
  'geolocate/geolocateerror'
], function(_, Promise, AbstractGeolocateService, GeolocatePosition, GeolocateError) {
  /**
   * @override
   * @param {Object=} opt_options.navigator
   *                  Navigator object to use for geolocation.
   *                  Defaults to window.navigator.
   *
   * @class aeris.geolocate.HTML5GeolocateService
   * @extends aeris.geolocate.AbstractGeolocateService
   * @constructor
   */
  var HTML5GeolocateService = function(opt_options) {
    AbstractGeolocateService.call(this, opt_options);

    /**
     * @type {Navigator} HTML5 Navigator object
     * @private
     */
    this.navigator_ = this.options_.navigator || window.navigator;

    /**
     * If the user's position is being watch,
     * this is the ID of the returned by Navigator.geolocation.watchPosition.
     *
     * Is required to clear the watch.
     *
     * @type {number}
     */
    this.watchId_ = null;
  };

  _.inherits(HTML5GeolocateService, AbstractGeolocateService);


  /**
   * @override
   */
  HTML5GeolocateService.prototype.getCurrentPosition = function() {
    var promise = new Promise();
    var self = this;

    if (!this.isSupported()) {
      promise.reject(this.parseError_({
        message: 'HTML5 Geolocation is not available.',
        code: GeolocateError.POSITION_UNAVAILABLE
      }));
    }
    else {
      this.navigator_.geolocation.getCurrentPosition(
        function(res) {
          promise.resolve(self.parsePosition_(res));
        },
        function(err) {
          promise.reject(self.parseError_(err));
        },
        this.getOptions_()
      );
    }

    return promise;
  };

  /**
   * @override
   */
  HTML5GeolocateService.prototype.watchPosition = function(onSuccess, onError, opt_options) {
    var self = this;

    if (!this.isSupported()) {
      onError(this.parseError_({
        message: 'HTML5 Geolocation is not available.',
        code: GeolocateError.POSITION_UNAVAILABLE
      }));
    }
    else {
      this.watchId_ = this.navigator_.geolocation.watchPosition(
        function(res) {
          onSuccess(self.parsePosition_(res));
        },
        function(error) {
          onError(self.parseError_(error));
        },
        this.getOptions_()
      );
    }
  };


  /**
   * @override
   */
  HTML5GeolocateService.prototype.clearWatch = function() {
    if (_.isNull(this.watchId_)) { return; }

    this.navigator_.geolocation.clearWatch(this.watchId_);
    this.watchId_ = null;
  };


  /**
   * @override
   */
  HTML5GeolocateService.prototype.isSupported = function() {
    return !!(this.navigator_ && this.navigator_.geolocation);
  };


  /**
   * @return {Object} HTML5 geolocation options.
   * @private
   */
  HTML5GeolocateService.prototype.getOptions_ = function() {
    return _.pick(this.options_,
      'enableHighAccuracy',
      'maximumAge',
      'timeout'
    );
  };


  /**
   * @param {Object} position Position data from the Geolocation API.
   * @return {aeris.geolocate.GeolocatePosition}
   * @private
   */
  HTML5GeolocateService.prototype.parsePosition_ = function(position) {
    return new GeolocatePosition(_.extend(
      {
        latLon: [position.coords.latitude, position.coords.longitude],
        timestamp: position.timestamp || null
      },
      _.pick(position.coords,
        'altitude',
        'altitudeAccuracy',
        'accuracy',
        'heading',
        'speed'
      )
    ));
  };

  /**
   * @param {Object} error Error data from the Geolocation API.
   * @return {aeris.geolocate.GeolocateError}
   * @private
   */
  HTML5GeolocateService.prototype.parseError_ = function(error) {
    return new GeolocateError(error);
  };



  return _.expose(HTML5GeolocateService, 'aeris.geolocate.HTML5GeolocateService');
});
