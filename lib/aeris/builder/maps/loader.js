define([
  'aeris/util',
  'aeris/config',
  'aeris/promisequeue',
  'aeris/loader/abstractloader',
  'aeris/builder/maps/mapappbuilder'
], function(_, aerisConfig, PromiseQueue, AbstractLoader, MapAppBuilder) {
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

    this.Builder_ = options.builder;

    AbstractLoader.apply(this, arguments);
  };
  _.inherits(MapAppLoader, AbstractLoader);

  /**
   * See {aeris.builder.options.MapAppBuilderOptions} for
   * additional configuration options for the MapAppBuilder.
   * All of these options can be passed to the Loader config.
   *
   * Where options ask for constructors to be passed in,
   * this loader can instead accept strings corresponding
   * to the class name.
   *
   * @override
   */
  MapAppLoader.prototype.load = function(config) {
    var pq = new PromiseQueue();

    config = this.normalizeConfig_(config);

    aerisConfig.set('strategy', config.mapType);


    // We're loading map objects here
    // so the map app builder doesn't have
    // to know what object are loaded.
    //
    // Instead, it will know them only by name
    // and attempt to load them from the global aeris
    // namespace.

    // To make things super-duper simple,
    // we're just going to pull in the entire library
    this.addPathAt_(config.mapType, 'packages');

    pq.queue(this.loadPaths_, this);
    pq.queue(_.bind(this.buildApp_, this, config));

    return pq.dequeue({ break: true }).
      done(function(loadPathsArgs, buildAppArgs) {
        // Call onload with any arguments returned by
        // builder.build() promise.
        //
        // Allows builder to expose any objects
        // it wants.
        config.onload.apply(null, buildAppArgs);
      }, this).
      fail(config.onerror, null);
  };

  /**
   * Build the MapApp
   * @param {aeris.builder.maps.MapAppBuilderOptions} config
   * @return {aeris.Promise} MapAppBuilder#build promise.
   * @private
   */
  MapAppLoader.prototype.buildApp_ = function(config) {
    var builder = new this.Builder_(config);
    return builder.build();
  };


  return MapAppLoader;
});
