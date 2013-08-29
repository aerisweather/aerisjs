define([
  'aeris/controller',
  'base/layers/infobox',
  'aeris/util',
  'vendor/handlebars',
  'vendor/text!aeris/builder/route/view/waypointinfo.html.handlebars'
], function(Controller, InfoBox, _, Handlebars, template) {

  /**
   * Controls an InfoBox view related to a
   * a waypoint.
   *
   * @class
   * @param {Object} opt_options
   * @constructor
   */
  var WaypointInfoController = function(opt_options) {
    var options = _.extend({}, opt_options);

    this.builder_ = options.builder;

    this.route_ = this.builder_.getRoute();

    this.waypoint_ = options.waypoint;

    this.options_ = _.extend({}, opt_options.controls);


    /**
     * @type {aeris.maps.Map}
     * @private
     */
    this.map_ = options.map;

    this.ui = {
      lat: '.aeris-lat',
      lon: '.aeris-lon',
      btnDirections: '.aeris-input-followdirections',
      btnDelete: '.aeris-btn-delete'
    };

    this.events = {
      'click btnDelete': this.deleteWaypoint,
      'change btnDirections': this.setFollowDirections
    };

    this.infoBoxEvents_ = {
      close: this.onclose_
    };

    this.waypointEvents_ = {
      'remove': this.close
    }

    this.template_ = Handlebars.compile(template);

    Controller.apply(this, arguments);
  };

  _.inherits(WaypointInfoController, Controller);


  WaypointInfoController.prototype.render = function() {
    // Render HTML
    var data = _.extend(this.waypoint_.toJSON(), {
      totalDistance: this.route_.distanceTo(this.waypoint_),
      isMetric: this.options_.metric
    });
    var html = this.template_(data);
    this.$el.html(html);

    // Create the InfoBox map overlay
    this.infoBox_ = new InfoBox(this.waypoint_.getLatLon(), this.el, {
      hideMarker: true      // Prevent double-marker syndrome
    });
    this.infoBox_.setMap(this.map_);

    // Turn on the engines
    this.bindUIElements();
    this.undelegateEvents();
    this.delegateEvents();
  };


  WaypointInfoController.prototype.close = function() {
    this.infoBox_.remove();
  };


  /**
   * Called when the {aeris.maps.layers.InfoBox} layer closes.
   * Cleanup.
   * @private
   */
  WaypointInfoController.prototype.onclose_ = function() {
    this.$el.empty().remove();

    this.undelegateEvents();
    this.trigger('close');

    this.waypoint_.deselect();
  };


  WaypointInfoController.prototype.delegateEvents = function() {
    Controller.prototype.delegateEvents.apply(this, arguments);

    if (this.infoBox_) {
      this.listenTo(this.infoBox_, this.infoBoxEvents_, this);
    }
    this.listenTo(this.waypoint_, this.waypointEvents_, this);
  };


  WaypointInfoController.prototype.undelegateEvents = function() {
    Controller.prototype.undelegateEvents.apply(this, arguments);

    this.stopListening();
  };



  WaypointInfoController.prototype.deleteWaypoint = function() {
    this.builder_.removeWaypoint(this.waypoint_);
    this.close();

    return false;
  };


  WaypointInfoController.prototype.setFollowDirections = function() {
    this.waypoint_.set({
      followDirections: this.ui.btnDirections.is(':checked')
    });
  };


  return WaypointInfoController;
});
