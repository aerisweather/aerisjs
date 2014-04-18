define([
  'aeris/util',
  'aeris/application/modules/module'
], function(_, Module) {
  /**
   * @class RendererModule
   * @namespace aeris.builder.maps.core
   * @extends aeris.application.modules.Module
   *
   * @constructor
   * @override
   */
  var RendererModule = function(options) {
    /**
     * @type {aeris.builder.maps.core.helpers.Renderer}
     * @private
     * @property renderer_
     */
    this.renderer_ = options.renderer;

    Module.apply(this, arguments);


    this.addInitializer(this.activateRenderer_);
  };
  _.inherits(RendererModule, Module);


  /**
   * @private
   * @method activateRenderer_
   */
  RendererModule.prototype.activateRenderer_ = function() {
    this.renderer_.activate();
  };


  return RendererModule;
});
