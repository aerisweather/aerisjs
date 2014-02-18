define([
  'aeris/util',
  'aeris/application/modules/module'
], function(_, Module) {
  /**
   * Encapsulates handling of the map controls views.
   *
   * @class MapControlsModule
   * @namespace aeris.builder.maps.mapcontrols.modules
   * @extends aeris.application.modules.Module
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
     * @property controlsController_
     */
    this.controlsController_ = options.controlsController;


    /**
     * Region in which the controls view
     * should be rendered.
     *
     * @type {Marionette.Region}
     * @private
     * @property controlsRegion_
     */
    this.controlsRegion_ = options.controlsRegion;

    Module.apply(this, arguments);

    this.addInitializer(this.renderControls);
  };
  _.inherits(MapControlsModule, Module);


  /**
   * Render controls.
   * @method renderControls
   */
  MapControlsModule.prototype.renderControls = function() {
    this.controlsRegion_.show(this.controlsController_);
  };


  return MapControlsModule;
});
