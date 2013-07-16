define([
  'aeris', 'base/extension/mapextension', 'base/events/click', './waypoint',
  './addwaypointcommand'
], function(aeris) {

  /**
   * @fileoverview A Google Map extension for building a Route.
   */


  aeris.provide('aeris.maps.gmaps.route.RouteBuilder');


  /**
   * Binds click events on an aeris map
   * To waypoints UI
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtension}
   */
  aeris.maps.gmaps.route.RouteBuilder = function(aerisMap, opt_options) {
    aeris.maps.extension.MapExtension.call(this, aerisMap, opt_options);

    var options = opt_options || {};


    /**
     * A map click handler.
     *
     * @type {aeris.maps.events.Click}
     * @private
     */
    this.click_ = new aeris.maps.events.Click();


    /**
     * The Route being built.
     *
     * @type {aeris.maps.gmap.route.Route}
     * @private
     */
    this.route_ = opt_options.route || null;


    /**
     * Follow paths provided by Google Maps.
     *
     * @type {boolean}
     */
    this.followPaths = true;


    /**
     * Travel mode to use when following paths.
     * e.g. WALKING, BICYCLING, DRIVING
     *
     * @type {string}
     */
    this.travelMode = 'WALKING';


    // Set the route if it was in the options
    if (options.route)
      this.setRoute(options.route);

    // Listen to map click events
    this.click_.setMap(this.aerisMap);
    this.click_.on('click', this.handleMapClick_, this);

    // Listen to waypoint clicks
    this.route_.on('click:waypoint', this.handleWaypointClick_, this);

  };
  aeris.inherits(aeris.maps.gmaps.route.RouteBuilder,
                 aeris.maps.extension.MapExtension);


  /**
   * Handle map click events.
   *
   * @param {Array.<number>} latLon The lat/lon the click occurred at.
   * @private
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.handleMapClick_ =
      function(latLon) {

    // If a route has not been defined, the Waypoint cannot be added.
    if (!this.route_) return false;

    // Create a new Waypoint positioned where the click occurred.
    var waypoint = new aeris.maps.gmaps.route.Waypoint({
      originalLatLon: latLon,
      followPaths: this.followPaths,
      travelMode: this.travelMode
    });

    // Add the Waypoint
    var command = new aeris.maps.gmaps.route.AddWaypointCommand(this.route_,
                                                                waypoint);
    command.execute();
  };


  /**
   * Handle waypoint click events.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   *     The waypoint that was clicked.
   * @private
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.handleWaypointClick_ =
      function(waypoint) {

    // Remove the Waypoint
    /*
     * @todo
     *
    var command = new aeris.maps.gmaps.route.RemoveWaypointCommand(this.route_,
                                                                   waypoint);
    command.execute();
    */
  };


  /**
   * Set the Route being built.
   *
   * @param {aeris.maps.gmaps.route.Route} route
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.setRoute = function(route) {
    if (!(route instanceof aeris.maps.gmaps.route.Route)) {
      throw new Error("Unable to set route: invalid route.");
    }

    this.route_ = route;
  };


  return aeris.maps.gmaps.route.RouteBuilder;

});
