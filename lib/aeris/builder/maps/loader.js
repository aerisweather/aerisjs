define([
  'aeris/util',
  'aeris/config',
  'aeris/promise',
  'loader/abstractloader',
  'mapbuilder/mapappbuilder',
  'loader/errors/loaderconfigerror'
], function(_, aerisConfig, Promise, AbstractLoader, MapAppBuilder, LoaderConfigError) {
  /**
   * @class aeris.builder.maps.Loader
   * @extends aeris.loader.AbstractLoader
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_options
   * @param {Function=} opt_options.builder AppBuilder constructor,
   *                                        for dependency injection.
   */
  var MapAppLoader = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      Builder: MapAppBuilder
    });

    /**
     * @private
     * @type {aeris.builder.AppBuilder}
     */
    this.Builder_ = options.Builder;

    /**
     * @private
     * @type {?Object}
     */
    this.config_ = null;


    AbstractLoader.apply(this, arguments);
  };
  _.inherits(MapAppLoader, AbstractLoader);


  /**
   * @param {Object} config
   * @override
   */
  MapAppLoader.prototype.load = function(config) {
    var promiseToLoad = new Promise();

    this.config_ = this.normalizeConfig_(config);

    this.configureApiKeys_();

    this.loadAerisDependencies_().
      done(function() {
        this.buildApp_().
          done(promiseToLoad.resolve, promiseToLoad).
          fail(promiseToLoad.reject, promiseToLoad);
      }, this).
      fail(promiseToLoad.reject, promiseToLoad);

    this.bindLoadCallbacksToPromise_(promiseToLoad);

    return promiseToLoad;
  };


  MapAppLoader.prototype.configureApiKeys_ = function() {
    var apiKeys;

    this.ensureApiKeys_();

    apiKeys = _.pick(this.config_, ['apiId', 'apiSecret']);
    aerisConfig.set(apiKeys, { validate: true });
  };


  MapAppLoader.prototype.ensureApiKeys_ = function() {
    var isApiKeysAlreadySet = !!aerisConfig.get('apiId') && !!aerisConfig.get('apiSecret');
    var isApiKeysConfigured = this.config_.apiId && this.config_.apiSecret;

    if (!isApiKeysAlreadySet && !isApiKeysConfigured) {
      throw new LoaderConfigError('An apiId and apiSecret must be provided ' +
        'in order to use the Aeris JS API');
    }
  };


  /**
   * @private
   * @return {aeris.Promise}
   */
  MapAppLoader.prototype.loadAerisDependencies_ = function() {
    return this.require([
        'packages/' + this.config_.mapType,
        'packages/maps'
      ]).
      fail(this.handleError_, this);
  };


  /**
   * Run the MapApp Builder
   * @return {aeris.Promise}
   * @private
   */
  MapAppLoader.prototype.buildApp_ = function() {
    var builder = new this.Builder_(this.getBuilderConfig_());
    return builder.build();
  };


  MapAppLoader.prototype.getBuilderConfig_ = function() {
    var notBuilderConfig = [
      'apiId',
      'apiSecret',
      'mapType',
      'onerror',
      'onload'
    ];

    return _.omit(this.config_, notBuilderConfig);
  };


  /**
   * @returns {MapAppLoader.DEFAULT_CONFIG_}
   * @private
   */
  AbstractLoader.prototype.getDefaultConfig_ = function() {
    return _.clone(MapAppLoader.DEFAULT_CONFIG_);
  };


  MapAppLoader.DEFAULT_CONFIG_ = _.extend({}, {
    mapType: 'gmaps'
  }, AbstractLoader.DEFAULT_CONFIG_);


  return MapAppLoader;
});
