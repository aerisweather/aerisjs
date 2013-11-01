define([
  'aeris/util',
  'aeris/promise',
  'aeris/builder/appbuilder',
  'wire!mapbuilder/config/context'
], function(_, Promise, BaseAppBuilder, context) {
  /**
   *
   * @class aeris.builder.maps.MapAppBuilder
   * @extends aeris.builder.AppBuilder
   *
   * @constructor
   * @param {aeris.builder.maps.options.MapAppBuilderOptions} config MapBuilder configuration.
   * @param {aeris.builder.options.AppBuilderOptions} opt_builderOptions
   *        An injectable configuration instance.
   */
  var MapAppBuilder = function(config, opt_builderOptions) {
    // Set builderOptions config
    var builderOptions = opt_builderOptions || context.builderOptions;

    BaseAppBuilder.call(this, config, builderOptions);
  };
  _.inherits(MapAppBuilder, BaseAppBuilder);


  /**
   * @override
   */
  MapAppBuilder.prototype.build = function() {
    var buildPromise = new Promise();

    context.mapApp.start(this.options_);

    buildPromise.resolve({
      state: context.appState,
      router: context.appRouter
    });

    // Call onload/onerror config options
    buildPromise.
      done(this.options_.get('onload'), window).
      fail(this.options_.get('onerror'), window);

    return buildPromise;
  };


  return MapAppBuilder;
});
