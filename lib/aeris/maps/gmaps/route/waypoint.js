define([
  'aeris',
  'aeris/utils',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/errors/jsonparseerror'
], function(aeris, utils, InvalidArgumentError, JSONParseError) {

  /**
   * @fileoverview Definition of a Waypoint.
   */


  aeris.provide('aeris.maps.gmaps.route.Waypoint');


  /**
   * Create a new Waypoint
   *
   * @param {Object} opt_options An object of optional default attributes.
   * @constructor
   */
  aeris.maps.gmaps.route.Waypoint = function(opt_options) {

    var options = opt_options || {};


    /**
     * The original latitude and longitude of the waypoint.
     *
     * @type {?Array.<number>}
     */
    this.originalLatLon = options.originalLatLon || null;


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
    this.followPaths = options.followPaths !== undefined ?
                       options.followPaths : true;


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
     * The previous waypoint before reaching this waypoint. Starting waypoints
     * have no previous waypoint.
     *
     * @type {?aeris.maps.gmaps.route.Waypoint}
     */
    this.previous = options.previous || null;


    /**
     * The distance (in meters) from the previous waypoint.
     *
     * @type {number=0}
     */
    this.distance = options.distance || 0;

  };


  /**
   * Get the most accurate latitude/longitude with the suggested following
   * order: 1) geocoded, 2) original.
   *
   * @return {Array.<number>}
   */
  aeris.maps.gmaps.route.Waypoint.prototype.getLatLon = function() {
    return this.geocodedLatLon || this.originalLatLon;
  };


  /**
   * Serialize Waypoint as a JSON object
   *
   * @return {Object} Exported waypoint as JSON object
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
      originalLatLon: this.originalLatLon,
      geocodedLatLon: this.geocodedLatLon,
      followPaths: this.followPaths,
      travelMode: this.travelMode,
      path: this.path,
      distance: this.distance
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
    // Check for propery formed waypoint obj
    if (!aeris.utils.isObject(obj)) {
      throw new InvalidArgumentError('Cannot parse non-object as a route');
    }
    if (!aeris.utils.isNumber(obj.distance) || !obj.distance < 0) {
      throw new JSONParseError(obj.distance + ' is not a valid waypoint distance');
    }
    if (!obj.originalLatLon || !aeris.utils.isArray(obj.originalLatLon) || !aeris.utils.isNumber(obj.originalLatLon[0]) || obj.originalLatLon.length !== 2) {
      throw new JSONParseError(obj.originalLatLon + ' is not a valid originalLatLong');
    }
    if (!obj.geocodedLatLon || !aeris.utils.isArray(obj.geocodedLatLon) || obj.geocodedLatLon.length !== 2) {
      throw new JSONParseError(obj.geocodedLatLon + ' is not a valid geocodedLatLon');
    }
    if (obj.path !== null && (
        !aeris.utils.isArray(obj.path) || obj.path.length < 1 || !aeris.utils.isArray(obj.path[0]) || obj.path[0].length !== 2
      )
    ) {
      throw new JSONParseError(obj.path + ' is not a valid waypoint path');
    }
    if (!aeris.utils.isBoolean(obj.followPaths)) {
      throw new JSONParseError(obj.followPaths + ' is not a valid followPaths option');
    }
    if (!aeris.utils.isString(obj.travelMode)) {
      throw new JSONParseError(obj.travelMode + ' is not a valid travelMode options');
    }

    this.originalLatLon = obj.originalLatLon;
    this.geocodedLatLon = obj.geocodedLatLon;
    this.followPaths = obj.followPaths;
    this.travelMode = obj.travelMode;
    this.path = obj.path;
    this.distance = obj.distance;

    // Set previous to null
    // This may be reset by managing route
    this.previous = null;
  };

  return aeris.maps.gmaps.route.Waypoint;

});
