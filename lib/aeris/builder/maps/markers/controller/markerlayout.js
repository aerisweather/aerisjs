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
   * @param {Backbone.View} options.controlsController Required.
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
     * Controller for marker UI controls.
     *
     * @type {Backbone.View}
     * @private
     */
    this.controlsController_ = options.controlsController;


    /**
     * Controller for rendering
     * marker data details.
     *
     * @type {Function} {Backbone.View} constructor.
     */
    this.MarkerDataController_ = options.MarkerDataController;


    /**
     * The rendered marker data view controller.
     *
     * @property markerDataView_
     * @type {?Backbone.View}
     */
    this.markerDataView_ = null;


    LayoutController.apply(this, arguments);
  };
  _.inherits(MarkerLayout, LayoutController);


  /**
   * @override
   */
  MarkerLayout.prototype.onRender = function() {
    // Render the controls immediately
    this.markerControls.show(this.controlsController_);


    // Bind event hub events.
    this.listenTo(this.eventHub_, {
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
    // Close any existing marker data view.
    if (this.markerDataView_) {
      this.markerDataView_.close();
      this.markerDataView_ = null;
    }

    // Construct and render the new view.
    this.markerDataView_ = new this.MarkerDataController_({
      model: markerData
    });
    this.markerDetails.show(this.markerDataView_);
  };


  return MarkerLayout;
});
