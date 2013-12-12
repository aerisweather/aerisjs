define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'vendor/jquery',
  'application/controller/layoutcontroller',
  'gmaps/route/waypoint'
], function(_, InvalidArgumentError, $, LayoutController, Waypoint) {
  /**
   *
   * @class aeris.builder.routes.routebuilder.controller.RouteControlsController
   * @extends aeris.application.LayoutController
   *
   * @constructor
   * @override
   *
   * @param {Object} options
   * @param {aeris.maps.gmaps.route.RouteBuilder} options.routeBuilder Required parameter.
   * @param {Object} options.ui
   * @param {string} options.openStateClass
   * @param {string} options.closedStateClass
   */
  var RouteControlsController = function(options) {
    /**
     * @type {aeris.maps.gmaps.route.RouteBuilder}
     * @private
     */
    this.routeBuilder_ = options.routeBuilder;


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


    /**
     * @type {string}
     * @private
     */
    this.openStateClass_ = options.openStateClass;


    /**
     * @type {string}
     * @private
     */
    this.closedStateClass_ = options.closedStateClass;


    this.mapEvents_ = {
      'click': function(latLon) {
        this.routeBuilder_.addWaypoint(new Waypoint({ position: latLon }));
      }
    };


    LayoutController.call(this, options);


    this.declareUI(
      'collapseBtn',
      'controlsRegion',
      'followDirectionsToggleBtn',
      'undoBtn',
      'redoBtn',
      'clearBtn',
      'returnRouteBtn',
      'latLonInputs',
      'latDeg',
      'latMin',
      'latSec',
      'lonDeg',
      'lonMin',
      'lonSec',
      'distance'
    );

    this.bindUIEvent('click', 'undoBtn', this.undoCommand, this);
    this.bindUIEvent('click', 'redoBtn', this.redoCommand, this);
    this.bindUIEvent('click', 'clearBtn', this.clearRoute, this);
    this.bindUIEvent('click', 'returnRouteBtn', this.renderReturnRoute, this);
    this.bindUIEvent('click', 'collapseBtn', this.toggleShow, this);
    this.bindUIEvent('change', 'followDirectionsToggleBtn', this.toggleFollowDirections, this);
    this.bindUIEvent('change', 'latLonInputs', this.setStartingWaypoint, this);
    this.bindUIEvent('keydown', 'latLonInputs', this.handleLatLonKeyPress_, this);


    // Bind to state's map
    this.listenTo(this.state_, {
      'change:map': function(state, map) {
        this.setMap_(map);
      }
    });
    this.setMap_(this.state_.get('map'));

    // Listen to RouteBuilder
    this.listenTo(this.routeBuilder_, {
      'path:click path:dragend': function(latLon, waypoint) {
        var index = this.routeBuilder_.getRoute().indexOf(waypoint);
        this.routeBuilder_.addWaypoint(new Waypoint({ position: latLon }), { at: index });
      }
    });

    this.$el.addClass(this.openStateClass_);
  };
  _.inherits(RouteControlsController, LayoutController);


  /**
   * @override
   */
  RouteControlsController.prototype.onRender = function() {
    // Listen to RouteBuilder
    this.listenTo(this.routeBuilder_, {
      'command': this.setCommandUIState
    });
    this.setCommandUIState();

    // Listen to Route
    this.listenTo(this.routeBuilder_.getRoute(), {
      // Use throttle, or this will be caused once
      // for every event called.
      'change:distance': this.renderRouteDistance_,
      'add remove reset change:position': this.renderStartingLatLon_
    });
  };


  /**
   * @override
   */
  RouteControlsController.prototype.onClose = function() {
    this.stopListening();
  };


  /**
   * Set the map to associate with this controller.
   *
   * @param {aeris.maps.Map} map
   * @private
   */
  RouteControlsController.prototype.setMap_ = function(map) {
    // Set Route Renderer's map
    this.routeBuilder_.setMap(map);

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
  RouteControlsController.prototype.renderRouteDistance_ = function() {
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
  RouteControlsController.prototype.addWaypoint = function(latLon, opt_options) {
    this.routeBuilder_.addWaypoint(new Waypoint({ position: latLon }), opt_options);
  };


  /**
   * Sets the enabled/disabled
   * state of the route command buttons (undoBtn, redo, clear).
   */
  RouteControlsController.prototype.setCommandUIState = function() {
    this.setUIState(this.ui.undoBtn, this.routeBuilder_.canUndo());
    this.setUIState(this.ui.redoBtn, this.routeBuilder_.canRedo());
    this.setUIState(this.ui.clearBtn, this.routeBuilder_.getRoute().getWaypoints().length);
  };


  /**
   * Marks a UI element as either enabled or disabled
   *
   * @param {jQuery} ui
   * @param {Boolean} isEnabled
   * @return {jQuery} chainable.
   */
  RouteControlsController.prototype.setUIState = function(ui, isEnabled) {
    var method = isEnabled ? this.enableUI : this.disableUI;

    return method(ui);
  };


  /**
   * Marks a UI element as disabled
   *
   * @param {jQuery} ui
   * @return {jQuery} chainable.
   */
  RouteControlsController.prototype.disableUI = function(ui) {
    if (!ui.length) { return; }

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
  RouteControlsController.prototype.enableUI = function(ui) {
    ui.removeAttr('disabled');
    ui.removeClass('aeris-disabled');

    return ui;
  };


  /**
   * Undo command
   */
  RouteControlsController.prototype.undoCommand = function() {
    if (this.routeBuilder_.canUndo()) {
      this.routeBuilder_.undo();
    }
  };


  /**
   * Redo command
   */
  RouteControlsController.prototype.redoCommand = function() {
    if (this.routeBuilder_.canRedo()) {
      this.routeBuilder_.redo();
    }
  };


  /**
   * @public
   */
  RouteControlsController.prototype.clearRoute = function() {
    this.routeBuilder_.resetRoute();
  };


  /**
   * @public
   */
  RouteControlsController.prototype.renderReturnRoute = function() {
    this.routeBuilder_.appendReverseRoute();
  };


  /**
   * Shows or hides the view.
   */
  RouteControlsController.prototype.toggleShow = function() {
    this.$el.toggleClass(this.openStateClass_);
    this.$el.toggleClass(this.closedStateClass_);
  };


  /**
   * Toggles the route's 'followDirections' property
   */
  RouteControlsController.prototype.toggleFollowDirections = function() {
    this.routeBuilder_.followDirections = !this.routeBuilder_.followDirections;
  };


  /**
   * Moves the first waypoint to the position
   * specified in the lat/lon input fields.
   *
   * If no waypoints exist, this will create one.
   */
  RouteControlsController.prototype.setStartingWaypoint = function() {
    var latLon = this.getStartingLatLon_();
    var firstWaypoint = this.routeBuilder_.getRoute().at(0);

    // Create starting waypoint
    if (!firstWaypoint) {
      this.routeBuilder_.addWaypoint(new Waypoint({ position: latLon }));
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
  RouteControlsController.prototype.getStartingLatLon_ = function() {
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
  RouteControlsController.prototype.renderStartingLatLon_ = function() {
    var firstWaypoint = this.routeBuilder_.getRoute().at(0);
    var degrees;

    if (firstWaypoint) {
      degrees = _.latLonToDegrees(firstWaypoint.getPosition());
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
  RouteControlsController.prototype.handleLatLonKeyPress_ = function(evt) {
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


  return RouteControlsController;
});
