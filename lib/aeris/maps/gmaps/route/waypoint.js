define(['aeris'], function(aeris) {

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
     * @type {Array.<number>}
     */
    this.originalLatLon = options.originalLatLon || null;


    /**
     * The geocoded latitude and longitude, possibly a result from a routing
     * service.
     *
     * @type {Array.<number>}
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
     * @type {Array}
     */
    this.path = options.path || null;


    /**
     * The previous waypoint before reaching this waypoint. Starting waypoints
     * have no previous waypoint.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     */
    this.previous = options.previous || null;


    /**
     * The distance (in meters) from the previous waypoint.
     *
     * @type {number}
     */
    this.distance = 0;

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
   * @returns {Object} Exported waypoint as JSON object
   */
  aeris.maps.gmaps.route.Waypoint.prototype.toJSON = function() {
    var path = this.path;
    var latLon;

    if (path && path[0] instanceof google.maps.LatLng) {
      for (var i = 0, length = path.length; i < length; i++) {
        latLon = path[i];
        path[i] = [latLon.lat(), latLon.lng()];
      }
    }

    return{
      originalLatLon: this.originalLatLon,
      geocodedLatLon: this.geocodedLatLon,
      followPaths: this.followPaths,
      travelMode: this.travelMode,
      path: this.path,
      previous: this.previous,
      distance: this.distance
    };
  }

  return aeris.maps.gmaps.route.Waypoint;

});
