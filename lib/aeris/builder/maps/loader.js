define([
  'aeris/util',
  'aeris/config',
  'aeris/promise',
  'loader/abstractloader',
  'mapbuilder/mapappbuilder'
], function(_, aerisConfig, Promise, AbstractLoader, MapAppBuilder) {
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
    var options = _.extend({
      builder: MapAppBuilder
    }, opt_options);

    /**
     * @private
     * @type {aeris.builder.AppBuilder}
     */
    this.Builder_ = options.builder;

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

    this.setMapStrategy_();

    this.loadAerisDependencies_().
      done(this.buildApp_, this).
      done(function() {
        promiseToLoad.resolve();
      });

    return promiseToLoad;
  };


  MapAppLoader.prototype.setMapStrategy_ = function() {
    var requireConfig = {};
    requireConfig[this.config_.mapType] = 'strategy';

    require.config(requireConfig);
  };


  /**
   * @private
   * @return {aeris.Promise}
   */
  MapAppLoader.prototype.loadAerisDependencies_ = function() {
    return this.require([
      'packages/' + this.config_.mapType,
      'packages/maps'
    ]);
  };


  /**
   * Run the MapApp Builder
   * @return {aeris.Promise}
   * @private
   */
  MapAppLoader.prototype.buildApp_ = function() {
    var builder = new this.Builder_(this.config_);
    return builder.build();
  };


  return MapAppLoader;
});
