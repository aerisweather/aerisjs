define([
  'ai/util',
  'ai/application/module/application'
], function(_, Application) {
  /**
   *
   * @class RouteApp
   * @namespace aeris.builder.routes.routeapp
   * @extends aeris.application.module.Application
   *
   * @constructor
   * @override
   */
  var RouteApp = function() {
    Application.apply(this, arguments);
  };
  _.inherits(RouteApp, Application);


  /**
   * @override
   * @method filterChildModules_
   */
  RouteApp.prototype.filterChildModules_ = function(modules, builderOptions) {
    // Don't start controls, if they're turned off
    if (!builderOptions.get('controls').routes) {
      delete modules.routeBuilderModule;
    }

    return modules;
  };


  return RouteApp;
});
