define([
  'aeris/util',
  'vendor/jquery',
  'vendor/marionette/itemview'
], function(_, $, ItemView) {
  /**
   *
   * @class aeris.builder.routes.routebuilder.controller.ControlsController
   * @extends Marionette.ItemView
   *
   * @constructor
   * @override
   */
  var ControlsController = function(options) {
    /**
     * @type {aeris.maps.gmaps.route.RouteBuilder}
     * @private
     */
    this.routeBuilder_ = options.routeBuilder;


    /**
     * DOM UI alias definitions
     *
     * @override
     */
    this.ui = options.ui;


    /**
     * DOM Events
     *
     * @override
     */
    this.events = {};
    this.events['click ' + this.ui.undo] = this.undo;
    this.events['click ' + this.ui.redo] = this.redo;
    this.events['click ' + this.ui.clear] = _.bind(this.routeBuilder_.resetRoute, this.routeBuilder_, null);
    this.events['click ' + this.ui.collapse] = this.toggleShow;
    this.events['change' + this.ui.followDirections] = this.toggleFollowDirections;
    this.events['change ' + this.ui.latLonInputs] = this.setStartingWaypoint;
    this.events['keydown ' + this.ui.latLonInputs] = this.handleLatLonKeyPress_;


    /**
     * Application state.
     *
     * @type {aeris.builder.maps.core.model.State}
     * @private
     */
    this.state_ = options.state;


    /**
     * @type {aeris.maps.Map}
     * @private
     */
    this.map_ = null;


    this.mapEvents_ = {
      'click': function(latLon) {
        this.routeBuilder_.addWaypoint(latLon);
      }
    };


    ItemView.call(this, options);


    // Listen to state
    this.listenTo(this.state_, {
      'change:map': function(state, map) {
        this.setMap_(map);
      }
    });

    // Listen to RouteBuilder
    this.listenTo(this.routeBuilder_, {
      'command': this.setCommandUIState
    });

    // Listen to Route
    this.listenTo(this.routeBuilder_.getRoute(), {
      // Use throttle, or this will be caused once
      // for every event called.
      'change:distance': this.renderRouteDistance_,
      'add remove reset change:position': this.renderStartingLatLon_
    });

    // Listen to RouteRenderer
    this.listenTo(this.routeBuilder_.getRenderer(), {
      'path:click path:dragend': function(latLon, waypoint) {
        var index = this.routeBuilder_.getRoute().indexOf(waypoint);
        this.routeBuilder_.addWaypoint(latLon, { at: index });
      }
    });

  };
  _.inherits(ControlsController, ItemView);


  /**
   * @override
   */
  ControlsController.prototype.onRender = function() {
    this.setCommandUIState();
  };


  /**
   * @override
   */
  ControlsController.prototype.onClose = function() {
    this.stopListening();
  };


  /**
   * Set the map to associate with this controller.
   *
   * @param {aeris.maps.Map} map
   * @private
   */
  ControlsController.prototype.setMap_ = function(map) {
    // Set Route Renderer's map
    this.routeBuilder_.getRenderer().setMap(map);

    // Unbind old map events
    if (this.map_) {
      this.stopListening(this.map_);
    }

    // Set new map
    this.map_ = map;

    // Bind new map events
    if (this.map_) {
      this.listenTo(this.map_, this.mapEvents_);
    }
  };


  /**
   * Render the distance of the
   * route.
   *
   * @private
   */
  ControlsController.prototype.renderRouteDistance_ = function() {
    var miles = this.routeBuilder_.getRoute().distance / 1000;

    this.ui.distance.html(miles.toFixed(1));
  };


  /**
   * Delegates to the RouteBuilder to add
   * a waypoint to the route.
   *
   * @param {Array.<number>} latLon
   * @param {Object} opt_options See aeris.maps.gmaps.route.RouteBuilder#addWaypoint options.
   */
  ControlsController.prototype.addWaypoint = function(latLon, opt_options) {
    this.routeBuilder_.addWaypoint(latLon, opt_options);
  };


  /**
   * Sets the enabled/disabled
   * state of the route command buttons (undo, redo, clear).
   */
  ControlsController.prototype.setCommandUIState = function() {
    this.setUIState(this.ui.undo, this.routeBuilder_.canUndo());
    this.setUIState(this.ui.redo, this.routeBuilder_.canRedo());
    this.setUIState(this.ui.clear, this.routeBuilder_.getRoute().getWaypoints().length);
  };


  /**
   * Marks a UI element as disabled
   *
   * @param {jQuery} ui
   * @return {jQuery} chainable.
   */
  ControlsController.prototype.disableUI = function(ui) {
    if (ui.prop('tagName').toLowerCase() === 'button') {
      ui.attr('disabled', true);
    }
    ui.addClass('aeris-disabled');

    return ui;
  };


  /**
   * Marks a UI element as enabled
   *
   * @param {jQuery} ui
   * @return {jQuery} chainable.
   */
  ControlsController.prototype.enableUI = function(ui) {
    if (ui.prop('tagName').toLowerCase() === 'button') {
      ui.removeAttr('disabled');
    }
    ui.removeClass('aeris-disabled');

    return ui;
  };


  /**
   * Marks a UI element as either enabled or disabled
   *
   * @param {jQuery} ui
   * @param {Boolean} isEnabled
   * @return {jQuery} chainable.
   */
  ControlsController.prototype.setUIState = function(ui, isEnabled) {
    var method = isEnabled ? this.enableUI : this.disableUI;

    return method(ui);
  };


  /**
   * Undo command
   */
  ControlsController.prototype.undo = function() {
    if (this.routeBuilder_.canUndo()) {
      this.routeBuilder_.undo();
    }
  };


  /**
   * Redo commdn
   */
  ControlsController.prototype.redo = function() {
    if (this.routeBuilder_.canRedo()) {
      this.routeBuilder_.redo();
    }
  };


  /**
   * Shows or hides the view.
   */
  ControlsController.prototype.toggleShow = function() {
    this.ui.controlsRegion.toggle(200);
  };


  /**
   * Toggles the route's 'followDirections' property
   */
  ControlsController.prototype.toggleFollowDirections = function() {
    this.routeBuilder_.followDirections = !this.routeBuilder_.followDirections;
  };


  /**
   * Moves the first waypoint to the position
   * specified in the lat/lon input fields.
   *
   * If no waypoints exist, this will create one.
   */
  ControlsController.prototype.setStartingWaypoint = function() {
    var latLon = this.getStartingLatLon_();
    var firstWaypoint = this.routeBuilder_.getRoute().at(0);

    // Create starting waypoint
    if (!firstWaypoint) {
      this.routeBuilder_.addWaypoint(latLon);
    }

    // Move existing first waypoint
    else {
      this.routeBuilder_.moveWaypoint(firstWaypoint, latLon);
    }
  };


  /**
   * Returns the latLon of the starting
   * coordinates, taking values from the
   * user input fields.
   *
   * @return {Array.<number>} latLon coords.
   * @private
   */
  ControlsController.prototype.getStartingLatLon_ = function() {
    var getVal = function(ui) {
      var n = parseInt(ui.val());
      return _.isNaN(n) ? 0 : n;
    };
    var degreesLat = [
      getVal(this.ui.latDeg),
      getVal(this.ui.latMin),
      getVal(this.ui.latSec)
    ];
    var degreesLon = [
      getVal(this.ui.lonDeg),
      getVal(this.ui.lonMin),
      getVal(this.ui.lonSec)
    ];
    return _.degreesToLatLon([degreesLat, degreesLon]);
  };


  /**
   * Displays the lat/lon of the first
   * waypoint in the lat/lon input fields.
   */
  ControlsController.prototype.renderStartingLatLon_ = function() {
    var firstWaypoint = this.routeBuilder_.getRoute().at(0);
    var degrees;

    if (firstWaypoint) {
      degrees = _.latLonToDegrees(firstWaypoint.getLatLon());
      this.ui.latDeg.val(degrees[0][0].toFixed(0));
      this.ui.latMin.val(degrees[0][1].toFixed(0));
      this.ui.latSec.val(degrees[0][2].toFixed(0));
      this.ui.lonDeg.val(degrees[1][0].toFixed(0));
      this.ui.lonMin.val(degrees[1][1].toFixed(0));
      this.ui.lonSec.val(degrees[1][2].toFixed(0));
    }
  };


  /**
   * @param {jQuery.Event} evt
   * @private
   */
  ControlsController.prototype.handleLatLonKeyPress_ = function(evt) {
    var incr = 0;
    var $input = $(evt.currentTarget);
    var currVal = parseFloat($input.val()) || 0;
    var newVal;

    if (evt.keyCode === 38) {   // up arrow
      incr = 1;
    }
    else if (evt.keyCode === 40) {
      incr = -1;
    }

    if (incr !== 0) {
      newVal = currVal + incr;
      $input.val(newVal);
      $input.trigger('change');
    }
  };


  return ControlsController;
});
