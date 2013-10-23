define([
  'aeris/util',
  'mapbuilder/core/module/module'
], function(_, BaseModule) {
  /**
   *
   * @class aeris.builder.routes.routebuilder.RouteBuilderModule
   * @extends aeris.builder.core.module.Module
   *
   * @constructor
   * @override
   *
   * @param {aeris.builder.routes.routebuilder.controller.ControlsController} options.controlsController
   */
  var RouteBuilderModule = function(options) {
    BaseModule.call(this, options);

    /**
     * Controller for RouteBuilder UI controls view.
     *
     * @type {aeris.builder.routes.routebuilder.controller.ControlsController}
     */
    this.controlsController_ = options.controlsController;
  };
  _.inherits(RouteBuilderModule, BaseModule);


  /**
   * Render RouteBuilder controls
   *
   * @override
  */
  RouteBuilderModule.prototype.render = function() {
    BaseModule.prototype.render.apply(this, arguments);

    this.region_.show(this.controlsController_);
  };


  return RouteBuilderModule;
});
