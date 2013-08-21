define([
  'aeris/controller',
  'aeris/util',
  'text!aeris/builder/route/view/controls.html.handlebars',
  'vendor/jquery',
  'vendor/handlebars',
  'vendor/helpers.handlebars'
], function(Controller, _, template, $, Handlebars) {
  /**
   * ControlsController for RouteAppBuilder
   * Manages UI Controls.
   *
   * @class
   * @constructor
   */
  var ControlsController = function(opt_options) {
    this.className = 'aeris-map-controls';

    this.ui = {
      collapse: '.aeris-btn-collapse',
      controlsRegion: '.aeris-controls-region',
      followDirections: '.aeris-btn-followDirections',
      travelMode: 'input[name=aeris-builder-travelMode]',
      undo: '.aeris-btn-undo',
      redo: '.aeris-btn-redo',
      clear: '.aeris-btn-clear',
      latLonInputs: '.aeris-section-latlon input',
      latDeg: '.aeris-input-lat-deg',
      latMin: '.aeris-input-lat-min',
      latSec: '.aeris-input-lat-sec',
      lonDeg: '.aeris-input-lon-deg',
      lonMin: '.aeris-input-lon-min',
      lonSec: '.aeris-input-lon-sec',
      distance: '.aeris-distance'
    };

    /**
     * UI Events hash
     * @type {Object}
     */
    this.events = {
      'click collapse': 'toggleShow',
      'click followDirections': 'toggleFollowDirections',
      'click undo': 'undo',
      'click redo': 'redo',
      'click clear': 'clearRoute',
      'change latLonInputs': 'setStartingWaypoint',
      'change travelMode': function() {
        var mode = this.ui.travelMode.filter(':checked').val();
        this.builder_.travelMode = mode;
      },
      'keydown latLonInputs': function(evt) {
        var incr = 0;
        var $input = $(evt.currentTarget);
        var newVal;

        if (evt.keyCode === 38) {   // up arrow
          incr = 1;
        }
        else if (evt.keyCode === 40) {
          incr = -1;
        }

        newVal = parseFloat($input.val()) + incr;
        $input.val(newVal);
        $input.trigger('change');
      }
    };


    /**
     * Events hash for listening
     * to the controller's route.
     *
     * @type {Object}
     */
    this.routeEvents_ = {
      'change:distance': this.renderDistance,
      'add': this.renderStartingLatLon,
      'remove': this.renderStartingLatLon,
      'reset': this.renderStartingLatLon,
      'change:latLon': this.renderStartingLatLon
    };


    /**
     * Event hash for listening
     * to the controller's RouteBuilder
     * @type {Object}
     */
    this.builderEvents_ = {
      'command': this.setCommandUIState
    };


    this.options_ = opt_options || {};
    this.builder_ = this.options_.builder;
    this.route_ = this.builder_.getRoute();

    this.template_ = Handlebars.compile(template);

    Controller.apply(this, arguments);
  };

  _.inherits(ControlsController, Controller);


  ControlsController.prototype.delegateEvents = function() {
    Controller.prototype.delegateEvents.apply(this, arguments);

    this.listenTo(this.route_, this.routeEvents_, this);
    this.listenTo(this.builder_, this.builderEvents_, this);
  };


  ControlsController.prototype.undelegateEvents = function() {
    Backbone.View.prototype.undelegateEvents.apply(this, arguments);

    this.stopListening();
  };

  ControlsController.prototype.render = function() {
    var data = _.extend(this.options, {
      currentTravelMode: this.builder_.travelMode
    });
    var html = this.template_(this.options_);
    this.$el.html(html);
    this.bindUIElements();
    this.delegateEvents();

    this.setCommandUIState();

    return this;
  };

  /**
   * Display the total distance of the route.
   */
  ControlsController.prototype.renderDistance = function() {
    var miles = this.options_.metric ?
      this.route_.distance / 1000 :
      this.route_.distance / 1609.34;

    this.ui.distance.html(miles.toFixed(1));
  };


  /**
   * Shows or hides the view.
   */
  ControlsController.prototype.toggleShow = function() {
    this.ui.controlsRegion.toggle(200);
  };

  /**
   * Sets the route's 'followDirections' property
   */
  ControlsController.prototype.toggleFollowDirections = function() {
    this.builder_.followDirections = !this.builder_.followDirections;
  };

  ControlsController.prototype.undo = function() {
    if (this.builder_.canUndo()) {
      this.builder_.undo();
    }
  };

  ControlsController.prototype.redo = function() {
    if (this.builder_.canRedo()) {
      this.builder_.redo();
    }
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
   * Sets the enabled/disabled
   * state of the undo/redo buttons
   */
  ControlsController.prototype.setCommandUIState = function() {
    this.setUIState(this.ui.undo, this.builder_.canUndo());
    this.setUIState(this.ui.redo, this.builder_.canRedo());
    this.setUIState(this.ui.clear, this.route_.getWaypoints().length);
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
   * Moves the first waypoint to the position
   * specified in the lat/lon input fields.
   *
   * If no waypoints exist, this will create one.
   */
  ControlsController.prototype.setStartingWaypoint = function() {
    var latLon = this.getStartingLatLon_();
    var firstWaypoint = this.route_.at(0);

    // Create starting waypoint
    if (!firstWaypoint) {
      this.builder_.addWaypoint(latLon);
    }

    // Move existing first waypoint
    else {
      this.builder_.moveWaypoint(firstWaypoint, latLon);
    }
  };


  /**
   * Displays the lat/lon of the first
   * waypoint in the lat/lon input fields.
   */
  ControlsController.prototype.renderStartingLatLon = function() {
    var firstWaypoint = this.route_.at(0);
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
   * Clears all waypoints from the route.
   */
  ControlsController.prototype.clearRoute = function() {
    this.builder_.resetRoute();
  };

  return ControlsController;
});
