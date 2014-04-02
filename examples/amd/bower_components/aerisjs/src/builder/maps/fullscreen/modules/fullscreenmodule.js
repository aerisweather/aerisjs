define([
  'aeris/util',
  'aeris/application/modules/module'
], function(_, Module) {
  /**
   * Initializes logic for functionality related to
   * fullscreen controls.
   *
   * @class FullscreenModule
   * @namespace aeris.builder.maps.fullscreen.modules
   * @extends aeris.application.modules.Module
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   * @param {aeris.application.controllers.ControllerInterface} options.fullscreenController
   *        Controller for entering and exiting fullscreen mode.
   * @param {aeris.application.controllers.ControllerInterface} options.fullscreenBtnController
   *        Controller for the button to trigger fullscreen mode.
   * @param {aeris.Events} options.eventHub Application event hub.
  */
  var FullscreenModule = function(options) {
    /**
     * @property fullscreenController_
     * @private
     * @type {aeris.application.controllers.ControllerInterface}
    */
    this.fullscreenController_ = options.fullscreenController;

    /**
     * @property fullscreenBtnController_
     * @type {aeris.application.controllers.ControllerInterface}
     * @private
     */
    this.fullscreenBtnController_ = options.fullscreenBtnController;

    /**
     * @property eventHub
     * @private
     * @type {aeris.Events}
    */
    this.eventHub_ = options.eventHub;


    Module.call(this, options);

    this.addInitializer(this.renderFullscreenUIControls_);
    this.addInitializer(this.setFullscreenElement_);
  };
  _.inherits(FullscreenModule, Module);


  /**
   * @property renderFullscreenUIControls_
   * @private
   */
  FullscreenModule.prototype.renderFullscreenUIControls_ = function() {
    this.eventHub_.trigger('mapControls:ready', this.fullscreenBtnController_, 'fullscreen');
  };


  /**
   * @method setFullscreenElement_
   * @private
  */
  FullscreenModule.prototype.setFullscreenElement_ = function(builderOptions) {
    this.fullscreenController_.setElement(builderOptions.get('el'));
  };


  return FullscreenModule;
});
