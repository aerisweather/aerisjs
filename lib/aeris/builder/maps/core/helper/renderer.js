define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * Shows and closes views within a region.
   * Can be activated and deactivated.
   *
   * @class aeris.builder.maps.core.Renderer
   * @mixes aeris.Events
   *
   * @constructor
   *
   * @param {Object} options
   * @param {Marionette.Region} options.region
   */
  var Renderer = function(options) {
    /**
     * @type {Marionette.Region}
     * @private
     */
    this.region_ = options.region;

    /**
     * @type {boolean}
     * @private
     */
    this.isActive_ = false;

    Events.call(this);
  };
  _.extend(Renderer.prototype, Events.prototype);


  /**
   * @param {aeris.application.controller.ControllerInterface} view
   */
  Renderer.prototype.show = function(view) {
    if (this.isActive_) {
      this.region_.show(view);
    }
  };

  /**
   * Close the info panel view.
   */
  Renderer.prototype.close = function() {
    if (this.isActive_) {
      this.region_.close();
    }
  };


  /**
   * Tell the info renderer to start
   * rendering views.
   */
  Renderer.prototype.activate = function() {
    this.isActive_ = true;
  };


  /**
   * Tell the info renderer to stop
   * rendering views.
   */
  Renderer.prototype.deactivate = function() {
    this.isActive_ = false;
  };


  return Renderer;
});
