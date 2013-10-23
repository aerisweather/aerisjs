define([
  'aeris/util',
  'base/marker',
  'gmaps/route/errors/jsonparseerror',
  'aeris/errors/validationerror'
], function(_, Marker, JSONParseError, ValidationError) {
  /**
   * A Waypoint:
   * - Is a MapExtensionObject
   * - Has a latLon location (position)
   * - Has a path (sometimes)
   * - Is export/import-able
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
      geocodedLatLon: null,
      followDirections: true,
      travelMode: 'WALKING',
      path: null,
      distance: 0,
      selected: false
    });

    Marker.call(this, attrs, opt_options);


    /**
     * @event select
     * @property {Object} model The selected waypoint.
     * @property {Object} options Options passed to Backbone.Model#set.
     */

    this.listenTo(this, {
      // Trigger 'select' / 'deselect' events
      'change:selected': function(model, isSelected, opts) {
        var topic = isSelected ? 'select' : 'deselect';
        this.trigger(topic, model, opts);
      }
    });
  };
  _.inherits(Waypoint, Marker);


  Waypoint.prototype.validate = function(attrs) {
    if (!_.isNumber(attrs.distance) || attrs.distance < 0) {
      return new ValidationError(attrs.distance + ' is not a valid waypoint distance');
    }
    if (attrs.geocodedLatLon && (!_.isArray(attrs.geocodedLatLon) || attrs.geocodedLatLon.length !== 2)) {
      return new ValidationError(attrs.geocodedLatLon + ' is not a valid geocodedLatLon');
    }
    if (attrs.path !== null && (
      !_.isArray(attrs.path) || attrs.path.length < 1 || !_.isArray(attrs.path[0]) || attrs.path[0].length !== 2
      )
      ) {
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


  /**
   * @return {number}
   */
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


  /**
   * @return {Boolean}
   */
  Waypoint.prototype.isSelected = function() {
    return !!this.get('selected');
  };


  /**
   * Get the most accurate latitude/longitude with the suggested following
   * order: 1) geocoded, 2) original.
   *
   * @return {Array.<number>}
   */
  Waypoint.prototype.getLatLon = function() {
    return this.get('geocodedLatLon') || this.get('position');
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
      'geocodedLatLon',
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
   * @param {Object|aeris.maps.gmaps.route.Waypoint} obj
   */
  Waypoint.prototype.reset = function(obj) {
    obj = (obj instanceof Waypoint) ? obj.toJSON() : obj;

    this.set({
      position: obj.position,
      geocodedLatLon: obj.geocodedLatLon,
      followDirections: obj.followDirections,
      travelMode: obj.travelMode,
      path: obj.path,
      distance: obj.distance
    }, { silent: true, validate: true });

    this.trigger('reset');
  };


  return _.expose(Waypoint, 'aeris.maps.gmaps.route.Waypoint');
});
