define([
  'aeris/util',
  'application/module/module'
], function(_, Module) {
  /**
   * Initializes logic for the map Info Panel views.
   *
   * @class aeris.builder.infopanel.module.InfoPanelModule
   * @extends aeris.application.module.Module
   *
   * @constructor
   *
   * @param {Object} options
   * @param {Object} options.infoRenderer Required.
  */
  var InfoPanelModule = function(options) {
    /**
     * The object responsible to
     * rendering views to the info panel.
     */
    this.infoRenderer_ = options.infoRenderer;


    Module.apply(this, arguments);


    this.addInitializer(this.startRenderer_);
  };
  _.inherits(InfoPanelModule, Module);


  /**
   * Startup the infoPanel renderer.
   *
   * @param builderOptions
   * @private
   */
  InfoPanelModule.prototype.startRenderer_ = function(builderOptions) {
    this.infoRenderer_.activate();
  };


  return InfoPanelModule;
});
