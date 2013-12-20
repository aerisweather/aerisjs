define([
  'aeris/util',
  'application/module/module'
], function(_, Module) {
  /**
   * @class aeris.builder.maps.core.RendererModule
   * @extends aeris.application.module.Module
   *
   * @constructor
   * @override
   */
  var RendererModule = function(options) {
    /**
     * @type {aeris.builder.maps.core.helper.Renderer}
     * @private
     */
    this.renderer_ = options.renderer;

    Module.apply(this, arguments);


    this.addInitializer(this.activateRenderer_);
  };
  _.inherits(RendererModule, Module);


  /** @private */
  RendererModule.prototype.activateRenderer_ = function() {
    this.renderer_.activate();
  };


  return RendererModule;
});
