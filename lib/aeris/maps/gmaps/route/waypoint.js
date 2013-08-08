define([
  'aeris',
  'aeris/promise',
  'aeris/utils',
  'vendor/underscore',
  'gmaps/utils',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/errors/jsonparseerror',
  'aeris/events'
], function(aeris, Promise, utils, _, mapUtils, InvalidArgumentError, JSONParseError) {

  /**
   * @fileoverview Definition of a Waypoint.
   */


  aeris.provide('aeris.maps.gmaps.route.Waypoint');


  /**
   * Create a new Waypoint
   *
   * @param {Object} opt_options An object of optional default attributes.
   * @constructor
   * @mixes {aeris.Events}
   */
  aeris.maps.gmaps.route.Waypoint = function(opt_options) {

    var options = opt_options || {};

    aeris.Events.apply(this);

    /**
     * Unique client id.
     *
     * @type {string}
     */
    this.cid = aeris.utils.uniqueId('wp_');


    /**
     * The original latitude and longitude of the waypoint.
     *
     * @type {?Array.<number>}
     */
    this.latLon = options.latLon || null;


    /**
     * The geocoded latitude and longitude, possibly a result from a routing
     * service.
     *
     * @type {?Array.<number>}
     */
    this.geocodedLatLon = options.geocodedLatLon || null;


    /**
     * Boolean value representing if the destination to the waypoint follows
     * a path.
     *
     * @type {boolean}
     */
    this.followDirections = options.followDirections !== undefined ?
                       options.followDirections : true;


    /**
     * String representation of the travel mode to take when following a path.
     * e.g. WALKING, BICYCLING, DRIVING
     *
     * @type {string}
     */
    this.travelMode = options.travelMode || 'WALKING';


    /**
     * An array of lat/lon the represent the path to get to waypoint.
     *
     * @type {?Array}
     */
    this.path = options.path || null;


    /**
     * The distance (in meters) from the previous waypoint.
     *
     * @type {number=0}
     * @private
     */
    this.distance_ = options.distance || 0;

  };

  aeris.extend(
    aeris.maps.gmaps.route.Waypoint.prototype,
    aeris.Events.prototype
  );


  /**
   * Safely set Waypoint attributes.
   *
   * @param {Object} attrs
   */
  aeris.maps.gmaps.route.Waypoint.prototype.set = function(attrs) {
    var illegals = ['cid'];

    if (!utils.isObject(attrs)) {
      throw new InvalidArgumentError('Invalid attributes object');
    }

    for (var prop in attrs) {
      if (attrs.hasOwnProperty(prop)) {
        if (prop === 'distance') {
          this.setDistance(attrs[prop]);
          // Note that setDistance triggers it's own change:distance event
        }
        else if (!(prop in this)) {
          throw new InvalidArgumentError('Waypoint has no property \'' + prop + '\'');
        }
        else if (illegals.indexOf(prop) !== -1) {
          throw new InvalidArgumentError('Unable to change protected ' + prop + ' property');
        }
        else {
          this[prop] = attrs[prop];

          // Trigger a change:property event
          this.trigger('change:' + prop, this);
        }
      }
    }

    // Trigger a generic 'change' event
    this.trigger('change', this, {
      properties: _.keys(attrs)
    });
  };


  /**
   * Returns the waypoint's distance.
   *
   * @return {number}
   */
  aeris.maps.gmaps.route.Waypoint.prototype.getDistance = function() {
    return this.distance_;
  };


  /**
   * Sets the waypoint's distance
   *
   * @param {number} distance
   */
  aeris.maps.gmaps.route.Waypoint.prototype.setDistance = function(distance) {
    if (!aeris.utils.isNumber(distance)) {
      throw new InvalidArgumentError('Unable to set waypoint distance: distance must be a number');
    }

    var delta = distance - this.distance_;
    this.distance_ = distance;

    this.trigger('change:distance', this.getDistance(), delta);
  };


  /**
   * Get the most accurate latitude/longitude with the suggested following
   * order: 1) geocoded, 2) original.
   *
   * @return {Array.<number>}
   */
  aeris.maps.gmaps.route.Waypoint.prototype.getLatLon = function() {
    return this.geocodedLatLon || this.latLon;
  };


  /**
   * Serialize Waypoint as a JSON object
   *
   * @return {Object} Exported waypoint as JSON object.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.toJSON = function() {
    var path = this.path;
    var latLon;

    if (path && path[0].lat) {
      for (var i = 0, length = path.length; i < length; i++) {
        latLon = path[i];
        path[i] = [latLon.lat(), latLon.lng()];
      }
    }

    return {
      latLon: this.latLon,
      geocodedLatLon: this.geocodedLatLon,
      followDirections: this.followDirections,
      travelMode: this.travelMode,
      path: this.path,
      distance: this.getDistance()
    };
  };


  /**
   * Exports the waypoint as a JSON string
   *
   * @return {string} JSON representation of a waypoint.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.export = function() {
    return JSON.stringify(this);
  };


  /**
   * Import a JSON string as a waypoint.
   * Replaces any existing waypoint data.
   *
   * @param {string} jsonStr JSON representation of a waypoint.
   */
  aeris.maps.gmaps.route.Waypoint.prototype.import = function(jsonStr) {
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


  aeris.maps.gmaps.route.Waypoint.prototype.reset = function(obj) {
    var distance = obj instanceof aeris.maps.gmaps.route.Waypoint ? obj.getDistance() : obj.distance;

    // Check for propery formed waypoint obj
    if (!aeris.utils.isObject(obj)) {
      throw new InvalidArgumentError('Cannot parse non-object as a route');
    }
    if (!aeris.utils.isNumber(distance) || !distance < 0) {
      throw new JSONParseError(distance + ' is not a valid waypoint distance');
    }
    if (!obj.latLon || !aeris.utils.isArray(obj.latLon) || !aeris.utils.isNumber(obj.latLon[0]) || obj.latLon.length !== 2) {
      throw new JSONParseError(obj.latLon + ' is not a valid latLon');
    }
    if (obj.geocodedLatLon && (!aeris.utils.isArray(obj.geocodedLatLon) || obj.geocodedLatLon.length !== 2)) {
      throw new JSONParseError(obj.geocodedLatLon + ' is not a valid geocodedLatLon');
    }
    if (obj.path !== null && (
        !aeris.utils.isArray(obj.path) || obj.path.length < 1 || !aeris.utils.isArray(obj.path[0]) || obj.path[0].length !== 2
      )
    ) {
      throw new JSONParseError(obj.path + ' is not a valid waypoint path');
    }
    if (!aeris.utils.isBoolean(obj.followDirections)) {
      throw new JSONParseError(obj.followDirections + ' is not a valid followDirections option');
    }
    if (!aeris.utils.isString(obj.travelMode)) {
      throw new JSONParseError(obj.travelMode + ' is not a valid travelMode options');
    }

    this.latLon = obj.latLon;
    this.geocodedLatLon = obj.geocodedLatLon;
    this.followDirections = obj.followDirections;
    this.travelMode = obj.travelMode;
    this.path = obj.path;
    this.setDistance(distance);
  };


  return aeris.maps.gmaps.route.Waypoint;

});
