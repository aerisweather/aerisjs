define([
  'aeris/util',
  'base/marker',
  'helpers/validator/pathvalidator',
  'base/polylines/polyline',
  'directions/googledirectionsservice',
  'directions/nonstopdirectionsservice',
  'strategy/route/errors/jsonparseerror',
  'strategy/route/errors/waypointnotinrouteerror',
  'errors/validationerror'
], function(_, Marker, PathValidator, Polyline, GoogleDirectionsService, NonstopDirectionsService, JSONParseError, WaypointNotInRouteError, ValidationError) {
  /**
   * A Waypoint is a marker along a route.
   * A waypoint has a path, as well as information
   * about how to get the path.
   *
   * @class aeris.maps.gmaps.route.Waypoint
   * @extends aeris.maps.Marker
   *
   * @constructor
   * @override
   *
   * @param {aeris.maps.extension.MapObjectInterface=} opt_options.polyline
   * @param {aeris.helpers.validator.PathValidator=} opt_options.pathValidator
   * @param {aeris.directions.DirectionsServiceInterface=} opt_options.directionsService
   * @param {aeris.directions.DirectionsServiceInterface=} opt_options.nonstopDirectionsService
   */
  var Waypoint = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      position: null,
      followDirections: true,
      travelMode: Waypoint.travelMode.WALKING,
      path: [],
      distance: 0,
      selected: false
    });
    var options = opt_options || {};

    /**
     * @type {aeris.maps.extension.MapObjectInterface}
     * @default {aeris.maps.polylines.Polyline}
     * @private
     */
    this.polyline_ = options.polyline || new Polyline();


    /**
     * @type {aeris.directions.DirectionsServiceInterface}
     * @default {aeris.directions.GoogleDirectionsService}
     * @private
     */
    this.directionsService_ = options.directionsService || new GoogleDirectionsService();


    /**
     * @type {aeris.directions.DirectionsServiceInterface}
     * @default {aeris.directions.NonstopDirectionsService}
     * @private
     */
    this.nonstopDirectionsService_ = options.nonstopDirectionsService || new NonstopDirectionsService();


    /**
     * @type {aeris.helpers.validator.ValidatorInterface}
     * @default {aeris.helpers.validator.PathValidator}
     * @private
     */
    this.pathValidator_ = options.pathValidator || new PathValidator();
    this.pathValidator_.setPath(attrs.path);


    Marker.call(this, attrs, options);


    /**
     * @event reset
     */
    /**
     * @event path:click
     * @param {Array.<number>} latLon
     * @param {aeris.maps.gmaps.route.Waypoint}
     */
    /**
     * @event select
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint The selected waypoint.
     * @param {Object} options Options passed to Backbone.Model#set.
     */
    /**
     * @event deselect
     * @param {aeris.maps.gmaps.route.Waypoint} waypoint The deselected waypoint.
     * @param {Object} options Options passed to Backbone.Model#set.
     */
    /**
     * When a waypoint fails retrieve directions data.
     *
     * @event directions:error
     * @param {aeris.directions.results.DirectionsResults}
     */

    this.initializePolylineBindings_();
    this.initializeSelectEvents_();
  };
  _.inherits(Waypoint, Marker);


  /**
   * @private
   */
  Waypoint.prototype.initializePolylineBindings_ = function() {
    this.updatePolyline_();

    this.listenTo(this, {
      'change:map change:path reset': this.updatePolyline_
    });

    this.listenTo(this.polyline_, {
      'click': function(latLon) {
        this.trigger('path:click', latLon, this);
      }
    });
  };


  /**
   * @private
   */
  Waypoint.prototype.initializeSelectEvents_ = function() {
    this.listenTo(this, {
      // Trigger 'select' / 'deselect' events
      'change:selected': function(model, isSelected, opts) {
        var topic = isSelected ? 'select' : 'deselect';
        this.trigger(topic, model, opts);
      }
    });
  };


  /**
   * Update a polyline to be in sync
   * with the waypoint's path.
   *
   * @private
   */
  Waypoint.prototype.updatePolyline_ = function() {
    this.polyline_.set({
      map: this.getMap(),
      path: this.get('path')
    }, { validate: true });
  };


  /**
   * @override
   */
  Waypoint.prototype.validate = function(attrs) {
    var pathError = this.validatePath_(attrs.path);

    if (pathError) { return pathError; }

    if (!_.isNumber(attrs.distance) || attrs.distance < 0) {
      return new ValidationError(attrs.distance + ' is not a valid waypoint distance');
    }

    if (!_.isBoolean(attrs.followDirections)) {
      return new ValidationError(attrs.followDirections + ' is not a valid followDirections option');
    }

    if (!_.isString(attrs.travelMode)) {
      return new ValidationError(attrs.travelMode + ' is not a valid travelMode options');
    }

    return Marker.prototype.validate.apply(this, arguments);
  };


  Waypoint.prototype.validatePath_ = function(path) {
    this.pathValidator_.setPath(path);

    if (!this.pathValidator_.isValid()) {
      return this.pathValidator_.getLastError();
    }
  };


  /** @return {number} */
  Waypoint.prototype.getDistance = function() {
    return this.get('distance');
  };


  /**
   * @param {Object} opt_options See Backbone.Model#set options.
   */
  Waypoint.prototype.select = function(opt_options) {
    this.set({ selected: true }, opt_options);
  };


  /**
   * @param {Object} opt_options See Backbone.Model#set options.
   */
  Waypoint.prototype.deselect = function(opt_options) {
    this.set({ selected: false }, opt_options);
  };


  /**
   * @param {Object} opt_options See Backbone.Model#set options.
   */
  Waypoint.prototype.toggleSelect = function(opt_options) {
    var fn = this.isSelected() ? this.deselect : this.select;

    fn.call(this, opt_options);
  };


  /** @return {Boolean} */
  Waypoint.prototype.isSelected = function() {
    return !!this.get('selected');
  };


  /** @returns {Boolean} */
  Waypoint.prototype.hasPath = function() {
    return !!this.get('path').length;
  };


  /** @return {aeris.Collection|undefined} */
  Waypoint.prototype.getRoute = function() {
    // Must check that collection contains the model.
    // See https://github.com/jashkenas/backbone/issues/2929
    var hasRoute = this.collection && this.collection.contains(this);
    return hasRoute ? this.collection : undefined;
  };


  Waypoint.prototype.getNextInRoute = function() {
    this.ensureHasRoute_();
    return this.getRoute().getNext(this);
  };


  Waypoint.prototype.getPreviousInRoute = function() {
    this.ensureHasRoute_();
    return this.getRoute().getPrevious(this);
  };

  Waypoint.prototype.ensureHasRoute_ = function() {
    if (!this.getRoute()) {
      throw new WaypointNotInRouteError();
    }
  };


  /**
   * Serialize Waypoint as a JSON object
   *
   * @return {Object} Exported waypoint as JSON object.
   */
  Waypoint.prototype.toJSON = function() {
    var baseJSON = Marker.prototype.toJSON.apply(this, arguments);

    // Limit JSON to the specified properties
    return _.pick(baseJSON,
      'position',
      'followDirections',
      'travelMode',
      'path',
      'distance'
    );
  };


  /**
   * Exports the waypoint as a JSON string
   *
   * @return {string} JSON representation of a waypoint.
   */
  Waypoint.prototype.export = function() {
    return JSON.stringify(this);
  };


  /**
   * Import a JSON string as a waypoint.
   * Replaces any existing waypoint data.
   *
   * @param {string} jsonStr JSON representation of a waypoint.
   */
  Waypoint.prototype.import = function(jsonStr) {
    var obj;
    try {
      obj = JSON.parse(jsonStr);
    }
    catch (e) {
      if (e instanceof window.SyntaxError) {
        throw new JSONParseError('Invalid JSON string');
      }

      throw e;
    }

    this.reset(obj);
  };


  /**
   * Replaces entire model with new attributes,
   * and validates.
   *
   * Triggers a 'reset' event (and DOES NOT trigger a set event)
   *
   * @param {Object|aeris.maps.gmaps.route.Waypoint || Object} obj
   * @param {Object=} opt_options Same options as Backbone.Model#set
   */
  Waypoint.prototype.reset = function(obj, opt_options) {
    var options = _.defaults(opt_options || {}, {
      silent: true,
      validate: true
    });

    obj = (obj instanceof Waypoint) ? obj.toJSON() : obj;

    this.set({
      position: obj.position,
      followDirections: obj.followDirections,
      travelMode: obj.travelMode,
      path: obj.path,
      distance: obj.distance
    }, options);

    this.trigger('reset');
  };


  /**
   * Set style on the polyine
   * for the waypoint's path.
   *
   * @param {Object} styles
   */
  Waypoint.prototype.stylePath = function(styles) {
    this.polyline_.setStyles(styles);
  };


  /**
   * @param {Array.<number>} pathStartingPosition
   * @returns {aeris.Promise}
   */
  Waypoint.prototype.setPathStartsAt = function(pathStartingPosition) {
    var promiseToFetchDirections;
    var directionsService = this.getDirectionsService_();
    var toLatLon = this.getPosition();

    this.trigger('directions:request', this);

    promiseToFetchDirections = directionsService.fetchPath(pathStartingPosition, toLatLon, {
      travelMode: this.get('travelMode')
    });

    promiseToFetchDirections.
      done(this.updateFromDirectionsResults_, this).
      done(this.triggerDirectionsComplete_, this).
      fail(this.triggerDirectionsServiceError_, this);

    return promiseToFetchDirections;
  };


  Waypoint.prototype.getDirectionsService_ = function() {
    return this.get('followDirections') ?
      this.directionsService_ :
      this.nonstopDirectionsService_;
  };


  /**
   * @param {aeris.directions.results.DirectionsResults} directionsResults
   * @private
   */
  Waypoint.prototype.updateFromDirectionsResults_ = function(directionsResults) {
    var lastPointInPath = directionsResults.path[directionsResults.path.length - 1];

    this.set({
      path: directionsResults.path,
      position: lastPointInPath,
      distance: directionsResults.distance
    }, { validate: true });
  };


  Waypoint.prototype.triggerDirectionsComplete_ = function() {
    this.trigger('directions:complete', this);
  };


  /**
   * @param {aeris.directions.results.DirectionsResults} directionsResults
   * @private
   */
  Waypoint.prototype.triggerDirectionsServiceError_ = function(directionsResults) {
    this.trigger('directions:error', this, directionsResults);
  };


  /**
   * @const
   * @static
   * @type {Object}
   */
  Waypoint.travelMode = {
    WALKING: 'WALKING',
    DRIVING: 'DRIVING',
    BICYCLING: 'BICYCLING',
    TRANSIT: 'TRANSIT'
  };


  return _.expose(Waypoint, 'aeris.maps.gmaps.route.Waypoint');
});
