define([
  'aeris/util'
], function(_) {
  /**
   * Listens to events thrown by an event hub,
   * and renders data attached to event.
   *
   * @class aeris.builder.maps.infopanel.listener.InfoListener
   *
   * @constructor
   *
   * @param {Object} options
   * @param {Function} options.InfoPanelController Required.
   * @param {Marionette.Region} options.infoPanelRegion Required.
   */
  var InfoRenderer = function(options) {
    /**
     * Constructor for the info panel view
     * controller.
     *
     * Must define render/close methods.
     *
     * @type {Backbone.View}
     * @private
     */
    this.InfoPanelController_ = options.InfoPanelController;


    /**
     * Region in which to render the
     * info panel view.
     *
     * @type {Marionette.Region}
     * @private
     */
    this.infoPanelRegion_ = options.infoPanelRegion;
  };


  InfoRenderer.prototype.showData = function(data) {
    var infoPanel = new this.InfoPanelController_({
      model: data
    });

    this.infoPanelRegion_(infoPanel);
  };

  InfoRenderer.prototype.close = function() {
    this.infoPanelRegion_.close();
  };


  return InfoListener;
});
