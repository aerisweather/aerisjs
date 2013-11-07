define([
  'aeris/util',
  'application/module/module'
], function(_, Module) {
  /**
   * Encapsulates handling of the map controls views.
   *
   * @class aeris.builder.maps.mapcontrols.module.MapControlsModule
   * @extends aeris.application.module.Module
   *
   * @constructor
   * @override
   *
   * @param {Backbone.View} options.controlsController
   */
  var MapControlsModule = function(options) {
    /**
     * Controls the map controls view(s).
     *
     * @type {Backbone.View}
     * @private
     */
    this.controlsController_ = options.controlsController;


    /**
     * Region in which the controls view
     * should be rendered.
     *
     * @type {Marionette.Region}
     * @private
     */
    this.controlsRegion_ = options.controlsRegion;

    Module.apply(this, arguments);

    this.addInitializer(this.renderControls);
  };
  _.inherits(MapControlsModule, Module);


  /**
   * Render controls.
   */
  MapControlsModule.prototype.renderControls = function() {
    this.controlsRegion_.show(this.controlsController_);
  };


  return MapControlsModule;
});
