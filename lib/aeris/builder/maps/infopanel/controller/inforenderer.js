define([
  'aeris/util',
  'aeris/events'
], function(_, Events) {
  /**
   * Listens to events thrown by an event hub,
   * and renders data attached to event.
   *
   * @class aeris.builder.maps.infopanel.listener.InfoRenderer
   * @extends aeris.Events
   *
   * @constructor
   *
   * @param {Object} options
   * @param {Marionette.Region} options.infoPanelRegion Required.
   */
  var InfoRenderer = function(options) {
    /**
     * Region in which to render the
     * info panel view.
     *
     * @type {Marionette.Region}
     * @private
     */
    this.infoPanelRegion_ = options.infoPanelRegion;


    /**
     * Whether the infoRenderer is
     * rendering views.
     *
     * @type {boolean}
     * @private
     */
    this.isActive_ = false;

    Events.call(this);
  };
  _.extend(InfoRenderer.prototype, Events.prototype);


  /**
   * Render model data in the info panel,
   * and show the view.
   *
   * @param {Backbone.Model} data
   */
  InfoRenderer.prototype.showView = function(view) {
    if (this.isActive_) {
      this.infoPanelRegion_.show(view);
    }
  };

  /**
   * Close the info panel view.
   */
  InfoRenderer.prototype.close = function() {
    if (this.isActive_) {
      this.infoPanelRegion_.close();
    }
  };


  /**
   * Tell the info renderer to start
   * rendering views.
   */
  InfoRenderer.prototype.activate = function() {
    this.isActive_ = true;
  };


  /**
   * Tell the info renderer to stop
   * rendering views.
   */
  InfoRenderer.prototype.deactivate = function() {
    this.isActive_ = false;
  };


  return InfoRenderer;
});
