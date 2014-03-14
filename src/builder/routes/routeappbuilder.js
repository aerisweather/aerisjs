define([
  'aeris/util',
  'aeris/promise',
  'aeris/builder/appbuilder',
  'wire!aeris/builder/routes/config/context'
], function(_, Promise, BaseAppBuilder, context) {
  /**
   *
   * @class RouteAppBuilder
   * @namespace aeris.builder.route
   * @extends aeris.builder.AppBuilder
   *
   * @constructor
   * @param {aeris.builder.routes.options.RouteBuilderOptions} config MapBuilder configuration.
   * @param {aeris.builder.routes.options.RouteBuilderOptions} opt_builderOptions
   *        An injectable configuration instance.
   */
  var RouteAppBuilder = function(config, opt_builderOptions) {
    // Pull in builderOptions instance form wired config
    var builderOptions = opt_builderOptions || context.builderOptions;

    BaseAppBuilder.call(this, config, builderOptions);
  };
  _.inherits(RouteAppBuilder, BaseAppBuilder);


  RouteAppBuilder.prototype.build = function() {
    var buildPromise = new Promise();

    try {
      this.options_.isValid();

      context.routeApp.start(this.options_);

      buildPromise.resolve();
    }
    catch (e) {
      buildPromise.reject(e);
    }

    return buildPromise;
  };


  return RouteAppBuilder;
});
