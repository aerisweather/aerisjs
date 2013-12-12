define([
  'aeris/util',
  'base/marker',
  'gmaps/route/errors/jsonparseerror',
  'aeris/errors/validationerror'
], function(_, Marker, JSONParseError, ValidationError) {
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

    Marker.call(this, attrs, opt_options);


    /**
     * @event reset
     */
    /**
     * @event select
     * @property {Object} model The selected waypoint.
     * @property {Object} options Options passed to Backbone.Model#set.
     */
    /**
     * @event deselect
     * @property {Object} model The deselected waypoint.
     * @property {Object} options Options passed to Backbone.Model#set.
     */
    this.initializeSelectEvents_();
  };
  _.inherits(Waypoint, Marker);


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
   * @override
   */
  Waypoint.prototype.validate = function(attrs) {
    if (!_.isNumber(attrs.distance) || attrs.distance < 0) {
      return new ValidationError(attrs.distance + ' is not a valid waypoint distance');
    }
    if (!this.isPathValid_(attrs.path)) {
      return new ValidationError(attrs.path + ' is not a valid waypoint path');
    }
    if (!_.isBoolean(attrs.followDirections)) {
      return new ValidationError(attrs.followDirections + ' is not a valid followDirections option');
    }
    if (!_.isString(attrs.travelMode)) {
      return new ValidationError(attrs.travelMode + ' is not a valid travelMode options');
    }
    return Marker.prototype.validate.apply(this, arguments);
  };


  /** @private */
  Waypoint.prototype.isPathValid_ = function(path) {
    var hasLength = path && path.length !== 0;
    var isEmptyArray = _.isArray(path) && !hasLength;
    var hasValidLatLon = hasLength && this.isValidLatLon_(path[0]);

    return isEmptyArray || hasValidLatLon;
  };


  /** @private */
  Waypoint.prototype.isValidLatLon_ = function(latLon) {
    var isLatLonTwoNumbers = latLon && latLon.length === 2 &&
      _.isNumber(latLon[0]) && _.isNumber(latLon[1]);

    return _.isArray(latLon) && isLatLonTwoNumbers;
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
    return this.collection;
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
