define([
  'aeris/util',
  'aeris/geolocate/html5geolocateservice',
  'aeris/geolocate/freegeoipgeolocateservice'
], function(_, HTML5GeolocateService, FreeGeoIPGeolocateService) {
  /**
   * Helper for creating a supported {aeris.geolocate.GeolocateServiceInterface}
   *
   * @class GeolocateServiceResolver
   * @namespace aeris.geolocate
   *
   * @constructor
   *
   * @param {Object=} opt_options
   * @param {function():aeris.geolocate.GeolocateServiceInterface} opt_options.GeolocateService
   *        Defaults to {aeris.geolocate.HTML5GeolocateService}.
   * @param {function():aeris.geolocate.GeolocateServiceInterface} opt_options.FallbackGeolocateService
   *        Defaults to {aeris.geolocate.FreeGeoIPGeolocateService}.
   * @param {aeris.geolocate.options.GeolocateServiceOptions} opt_options.geolocateServiceOptions
  */
  var GeolocateServiceResolver = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      GeolocateService: HTML5GeolocateService,
      FallbackGeolocateService: FreeGeoIPGeolocateService,
      geolocateServiceOptions: {}
    });

    /**
     * @property GeolocateService_
     * @private
     * @type {function():aeris.geolocate.GeolocateServiceInterface}
    */
    this.GeolocateService_ = options.GeolocateService;


    /**
     * @property FallbackGeolocateService_
     * @private
     * @type {function():aeris.geolocate.GeolocateServiceInterface}
    */
    this.FallbackGeolocateService_ = options.FallbackGeolocateService;


    /**
     * @property geolocateServiceOptions_
     * @private
     * @type {aeris.geolocate.options.GeolocateServiceOptions}
    */
    this.geolocateServiceOptions_ = options.geolocateServiceOptions;
  };


  /**
   * Return an instance of the GeolocateService option,
   * or, if it's not supported, the FallbackGeolocateService
   *
   * @method resolveService
   * @return {aeris.geolocate.GeolocateServiceInterface}
   */
  GeolocateServiceResolver.prototype.resolveService = function() {
    return this.GeolocateService_.isSupported() ?
      new this.GeolocateService_(this.geolocateServiceOptions_) :
      new this.FallbackGeolocateService_(this.geolocateServiceOptions_);
  };


  return GeolocateServiceResolver;
});
