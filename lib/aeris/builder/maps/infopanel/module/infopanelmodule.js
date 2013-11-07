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
  */
  var InfoPanelModule = function(options) {


    Module.apply(this, arguments);


    this.addInitializer(this.startupInfoPanel);
  };
  _.inherits(InfoPanelModule, Module);


  InfoPanelModule.prototype.startupInfoPanel_ = function(builderOptions) {
    this.infoPanelController_.startLi
  };


  return InfoPanelModule;
});
