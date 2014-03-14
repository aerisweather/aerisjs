define([
  'aeris/util',
  'aeris/builder/maps/core/helpers/renderer'
], function(_, Renderer) {
  /**
   * Helper for rendering view in the info panel region.
   *
   * @class InfoPanelRenderer
   * @namespace aeris.builder.maps.infopanel.helpers
   * @extends aeris.builder.maps.core.Renderer
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   * @param {Marionette.Region} options.region Info Panel region.
   * @param {aeris.Events} options.eventHub Application event hub.
  */
  var InfoPanelRenderer = function(options) {
    /**
     * @property eventHub_
     * @private
     * @type {aeris.Events}
    */
    this.eventHub_ = options.eventHub;


    Renderer.call(this, options);
  };
  _.inherits(InfoPanelRenderer, Renderer);


  /**
   * @method show
   */
  InfoPanelRenderer.prototype.show = function(controller) {
    Renderer.prototype.show.call(this, controller);

    if (this.isActive_) {
      this.eventHub_.trigger('info:show', controller);

      this.triggerEventWhenControllerCloses_(controller);
    }
  };


  /**
   * @method triggerEventWhenControllerCloses_
   * @private
   * @param {aeris.application.controllers.ControllerInterface} controller
   */
  InfoPanelRenderer.prototype.triggerEventWhenControllerCloses_ = function(controller) {
    this.listenToOnce(controller, 'close', function() {
      if (this.isActive_) {
        this.eventHub_.trigger('info:close');
      }
    });
  };


  return InfoPanelRenderer;
});
/**
 * @for aeris.maps.event.EventHub
 */
/**
 * An info panel view has been rendered
 * in the info panel region.
 *
 * @event info:show
 * @param {aeris.application.controller.ControllerInterface} controller The rendered controller.
 */
/**
 * The info panel region has been closed.
 *
 * @event info:close
 */
