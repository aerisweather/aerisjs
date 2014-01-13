define([
  'aeris/util',
  'errors/invalidargumenterror',
  'vendor/jquery',
  'application/controller/layoutcontroller',
  'strategy/route/waypoint'
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
   * @param {aeris.maps.gmaps.route.RouteBuilder} options.routeBuilder
   * @param {Object=} options.ui
   * @param {aeris.Events} options.eventHub
   * @param {aeris.application.controller.ControllerInterface}  options.SaveRouteController
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
     * @type {aeris.Events}
     * @private
     */
    this.eventHub_ = options.eventHub;

    /**
     * @type {aeris.application.controller.ControllerInterface}
     * @private
     */
    this.SaveRouteController_ = options.SaveRouteController;

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


    LayoutController.call(this, options);


    this.declareUI(
      'collapseBtn',
      'controlsRegion',
      'followDirectionsToggleBtn',
      'undoBtn',
      'redoBtn',
      'clearBtn',
      'saveBtn',
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
    this.bindUIEvent('click', 'saveBtn', this.openSaveRouteForm_, this);
    this.bindUIEvent('click', 'returnRouteBtn', this.renderReturnRoute, this);
    this.bindUIEvent('click', 'collapseBtn', this.toggleShow, this);
    this.bindUIEvent('change', 'followDirectionsToggleBtn', this.toggleFollowDirections, this);
    this.bindUIEvent('change', 'latLonInputs', this.setStartingWaypoint, this);
    this.bindUIEvent('keydown', 'latLonInputs', this.handleLatLonKeyPress_, this);

    this.$el.addClass(this.openStateClass_);
  };
  _.inherits(RouteControlsController, LayoutController);


  /** @override */
  RouteControlsController.prototype.onRender = function() {
    this.bindRouteBuilderToUICommands_();
    this.bindUIToRouteState_();
  };


  /** @private */
  RouteControlsController.prototype.bindRouteBuilderToUICommands_ = function() {
    this.listenTo(this.routeBuilder_, {
      'command': this.setCommandUIState
    });
    this.setCommandUIState();
  };


  /** @private */
  RouteControlsController.prototype.bindUIToRouteState_ = function() {
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
   * Render the distance of the
   * route.
   *
   * @private
   */
  RouteControlsController.prototype.renderRouteDistance_ = function() {
    var METERS_PER_MILE = 1609.34;
    var miles = this.routeBuilder_.getRoute().distance / METERS_PER_MILE;

    this.ui.distance.html(miles.toFixed(1));
  };


  /**
   * Sets the enabled/disabled
   * state of the route command buttons (undoBtn, redo, clear).
   */
  RouteControlsController.prototype.setCommandUIState = function() {
    this.setUIEnabled(this.ui.undoBtn, this.routeBuilder_.canUndo());
    this.setUIEnabled(this.ui.redoBtn, this.routeBuilder_.canRedo());
    this.setUIEnabled(this.ui.clearBtn, this.routeBuilder_.getRoute().getWaypoints().length);
  };


  /**
   * Marks a UI element as either enabled or disabled
   *
   * @param {jQuery} ui
   * @param {Boolean} isEnabled
   */
  RouteControlsController.prototype.setUIEnabled = function(ui, isEnabled) {
    if (isEnabled) {
      this.enableUI(ui)
    }
    else {
      this.disableUI(ui);
    }
  };


  /**
   * Marks a UI element as disabled
   *
   * @param {jQuery} ui
   */
  RouteControlsController.prototype.disableUI = function(ui) {
    if (!ui.length) { return; }

    if (ui.prop('tagName').toLowerCase() === 'button') {
      ui.attr('disabled', true);
    }
    ui.addClass('aeris-disabled');
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


  /** @public */
  RouteControlsController.prototype.clearRoute = function() {
    this.routeBuilder_.resetRoute();
  };

  /** @public */
  RouteControlsController.prototype.openSaveRouteForm_ = function() {
    var controller = this.createSaveRouteController_();

    this.eventHub_.trigger('modal:view', controller);
  };


  /**
   * @returns {aeris.application.controller.ControllerInterface}
   * @private
   */
  RouteControlsController.prototype.createSaveRouteController_ = function() {
    return new this.SaveRouteController_();
  };


  /**
   * @private
   * @return {Object}
   */
  RouteControlsController.prototype.getExportedRoutePoints_ = function() {
    return this.routeBuilder_.getRoute().toJSON();
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
