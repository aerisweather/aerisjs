define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * Shows and closes views within a region.
   * Can be activated and deactivated.
   *
   * @class Renderer
   * @namespace aeris.builder.maps.core
   * @uses aeris.Events
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
     * @property region_
     */
    this.region_ = options.region;

    /**
     * @type {boolean}
     * @private
     * @property isActive_
     */
    this.isActive_ = false;

    Events.call(this);
  };
  _.extend(Renderer.prototype, Events.prototype);


  /**
   * @param {aeris.application.controllers.ControllerInterface} view
   * @method show
   */
  Renderer.prototype.show = function(view) {
    if (this.isActive_) {
      this.region_.show(view);
    }
  };

  /**
   * Close the region.
   * @method close
   */
  Renderer.prototype.close = function() {
    if (this.isActive_) {
      this.region_.close();
    }
  };


  /**
   * Tell the info renderer to start
   * rendering views.
   * @method activate
   */
  Renderer.prototype.activate = function() {
    this.isActive_ = true;
  };


  /**
   * Tell the info renderer to stop
   * rendering views.
   * @method deactivate
   */
  Renderer.prototype.deactivate = function() {
    this.isActive_ = false;
  };


  return Renderer;
});
