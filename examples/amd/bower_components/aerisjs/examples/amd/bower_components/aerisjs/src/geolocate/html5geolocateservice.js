define([
  'aeris/util',
  'aeris/promise',
  'aeris/geolocate/options/html5serviceoptions',
  'aeris/geolocate/results/geolocateposition',
  'aeris/geolocate/errors/geolocateserviceerror'
], function(_, Promise, HTML5ServiceOptions, GeolocatePosition, GeolocateServiceError) {
  var root = this;

  /**
   * @publicApi
   * @class HTML5GeolocateService
   * @namespace aeris.geolocate
   * @implements aeris.geolocate.GeolocateServiceInterface
   *
   * @constructor
   * @override
   *
   * @param {aeris.geolocate.options.HTML5ServiceOptions=} opt_options
   */
  var HTML5GeolocateService = function(opt_options) {
    var options = new HTML5ServiceOptions(opt_options);

    /**
     * @type {Object}
     * @property navigatorOptions_
     */
    this.navigatorOptions_ = _.pick(options,
      'enableHighAccuracy',
      'maximumAge',
      'timeout'
    );


    /**
     * @type {Navigator} HTML5 Navigator object
     * @private
     * @property navigator_
     */
    this.navigator_ = options.navigator;


    /**
     * If the user's position is being watched,
     * this is the ID of the returned by Navigator.geolocation.watchPosition.
     *
     * Is required to clear the watch.
     *
     * @type {number}
     * @property watchId_
     */
    this.watchId_ = null;
  };


  /**
   * @method getCurrentPosition
   */
  HTML5GeolocateService.prototype.getCurrentPosition = function() {
    var promise = new Promise();
    var callback = _.bind(function(res) {
      promise.resolve(this.createPosition_(res));
    }, this);
    var errback = _.bind(function(err) {
      promise.reject(this.createGeolocateError_(err));
    }, this);


    if (!HTML5GeolocateService.isSupported()) {
      promise.reject(this.createServiceUnavailableError_());
    }
    else {
      this.navigator_.geolocation.getCurrentPosition(callback, errback, this.navigatorOptions_);
    }

    return promise;
  };


  /**
   * @method watchPosition
   */
  HTML5GeolocateService.prototype.watchPosition = function(onSuccess, onError, opt_options) {
    var self = this;

    if (!HTML5GeolocateService.isSupported()) {
      onError(this.createServiceUnavailableError_());
    }
    else {
      this.watchId_ = this.navigator_.geolocation.watchPosition(
        function(res) {
          onSuccess(self.createPosition_(res));
        },
        function(error) {
          onError(self.createGeolocateError_(error));
        },
        this.navigatorOptions_
      );
    }
  };


  /**
   * @private
   * @return {aeris.geolocate.errors.GeolocateServiceError}
   * @method createServiceUnavailableError_
   */
  HTML5GeolocateService.prototype.createServiceUnavailableError_ = function() {
    return this.createGeolocateError_({
      message: 'HTML5 Geolocation is not available.',
      code: GeolocateServiceError.POSITION_UNAVAILABLE
    });
  };


  /**
   * @method clearWatch
   */
  HTML5GeolocateService.prototype.clearWatch = function() {
    if (_.isNull(this.watchId_)) { return; }

    this.navigator_.geolocation.clearWatch(this.watchId_);
    this.watchId_ = null;
  };


  /**
   * @method isSupported
   */
  HTML5GeolocateService.isSupported = function() {
    return !!(root.navigator && root.navigator.geolocation);
  };


  /**
   * @param {Object} position Position data from the Geolocation API.
   * @return {aeris.geolocate.results.GeolocatePosition}
   * @private
   * @method createPosition_
   */
  HTML5GeolocateService.prototype.createPosition_ = function(position) {
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
   * @return {aeris.geolocate.errors.GeolocateServiceError}
   * @private
   * @method createGeolocateError_
   */
  HTML5GeolocateService.prototype.createGeolocateError_ = function(error) {
    return new GeolocateServiceError(error);
  };



  return _.expose(HTML5GeolocateService, 'aeris.geolocate.HTML5GeolocateService');
});
