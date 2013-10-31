define([
  'aeris/util',
  'mapbuilder/core/module/application'
], function(_, Application) {
  /**
   *
   * @class aeris.builder.routes.routeapp.RouteApp
   * @extends aeris.builder.maps.core.module.Application
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
