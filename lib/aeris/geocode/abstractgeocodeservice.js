define([
  'aeris/util',
  'geocode/config',
  'errors/invalidconfigerror',
  'errors/unimplementedmethoderror'
], function(_, rjsConfig, InvalidConfigError, UnimplementedMethodError) {
  /**
   * @class aeris.geocode.AbstractGeocodeService
   * @constructor
   *
   * @param {Object=} opt_config Configuration can also be set in RequireJS config,
   *                            via the config['geocode/config'] configuration property.
   * @property {string} opt_config.apiId Id or key for the geocoding service api.
   */
  var AbstractGeocodeService = function(opt_config) {
    /**
     * Config object
     *
     * @type {Object}
     * @protected
     */
    this.config_ = opt_config || rjsConfig;
  };


  /**
   * @abstract
   * @param {string} location The location to geocode.
   * @return {aeris.Promise} A promise to return a lat/lon for the
   *                        geocoded location.
   */
  AbstractGeocodeService.prototype.geocode = function(location) {
    throw new UnimplementedMethodError('GeocodeService object must implement a `geocode` method');
  };


  return AbstractGeocodeService;
});
