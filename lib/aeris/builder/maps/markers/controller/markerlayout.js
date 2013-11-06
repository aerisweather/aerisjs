define([
  'aeris/util',
  'application/controller/layoutcontroller'
], function(_, LayoutController) {
  /**
   * Top-level layout for the Markers module.
   *
   * @class aeris.builder.maps.markers.controller.MarkerLayout
   * @extends aeris.application.controller.LayoutController
   *
   * @constructor
   * @override
   *
   * @param {Object} options.regions See required regions.
   * @param {Function} options.MarkerDataController ({Backbone.View} constructor) Required.
   * @param {aeris.Events} options.eventHub Required.
   *
   */
  var MarkerLayout = function(options) {

    /**
     * Regions:
     *  markerControls
     *  markerDetails
     *
     * @property regions
     * @override
     */


    /**
     * Application-wide event hub
     *
     * @type {aeris.Events}
     */
    this.eventHub_ = options.eventHub;


    /**
     * Controller for rendering
     * marker data details.
     *
     * @type {Function} {Backbone.View} constructor.
     */
    this.MarkerDataController_ = options.MarkerDataController;


    LayoutController.apply(this, arguments);
  };
  _.inherits(MarkerLayout, LayoutController);


  /**
   * @override
   */
  MarkerLayout.prototype.onRender = function() {
    // Bind event hub events.
    this.listenTo(this.eventHub_, {
      // Render data on marker click
      'marker:click': function(latLon, marker) {
        this.renderMarkerData_(marker.get('data'));
      }
    });
  };


  /**
   * Render the MarkerDataController.
   *
   * @param {aeris.api.PointData} markerData
   * @private
   */
  MarkerLayout.prototype.renderMarkerData_ = function(markerData) {
    var markerDataView = new this.MarkerDataController_({
      model: markerData
    });
    this.markerDetails.show(markerDataView);

  };


  return MarkerLayout;
});
