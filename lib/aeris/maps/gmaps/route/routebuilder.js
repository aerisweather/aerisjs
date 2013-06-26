define([
  'aeris', 'base/extension/mapextension', 'base/events/click', 'aeris/promise',
  './waypoint'
], function(aeris) {

  /**
   * @fileoverview A Google Map extension for building a Route.
   */


  aeris.provide('aeris.maps.gmaps.route.RouteBuilder');


  /**
   * Create a Google Map extension used for building a Route.
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
    this.route_ = null;


    /**
     * Google's direction service used to determine a path when following paths
     * is enabled.
     *
     * @type {google.maps.DirectionsService}
     * @private
     */
    this.googleDirectionsService_ = new google.maps.DirectionsService();


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
    this.click_.on('click', this.handleClick_, this);

  };
  aeris.inherits(aeris.maps.gmaps.route.RouteBuilder,
                 aeris.maps.extension.MapExtension);


  /**
   * Handle map click events.
   *
   * @private
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.handleClick_ =
      function(latLon) {

    // Create a new Waypoint positioned where the click occurred.
    var waypoint = new aeris.maps.gmaps.route.Waypoint({
      originalLatLon: latLon,
      followPaths: this.followPaths,
      travelMode: this.travelMode
    });

    // Add the Waypoint
    this.addWaypoint(waypoint);
  };


  /**
   * Add a Waypoint to the Route.
   *
   * @param {aeris.maps.gmap.route.Waypoint} waypoint The Waypoint to add.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.addWaypoint =
      function(waypoint) {

    // If a route has not been defined, the Waypoint cannot be added.
    if (!this.route_) return false;

    // Determine the last Waypoint of the Route
    var waypoints = this.route_.getWaypoints();
    var lastWaypoint = waypoints.length > 0 ?
                       waypoints[waypoints.length - 1] :
                       null;

    if (!lastWaypoint) {
      // If this is the first Waypoint, immediately add it to the Route.
      this.route_.addWaypoint(waypoint);

    } else if (!waypoint.followPaths) {
      // If this Waypoint is not following a route, calculate the spherical
      // distance and add to the route.
      var originLatLng = this.aerisMap.toLatLon(lastWaypoint.getLatLon());
      var destinationLatLng = this.aerisMap.toLatLon(waypoint.getLatLon());
      waypoint.distance = google.maps.geometry.spherical.
          computeDistanceBetween(originLatLng, destinationLatLng);
      this.route_.addWaypoint(waypoint);

    } else {
      // The routing service is needed, so get the path and then add the
      // Waypoint to the Route.
      var route = this.getGoogleRoute(lastWaypoint, waypoint);
      var self = this;
      route.done(function(waypoint) {
        self.route_.addWaypoint(waypoint);
      });
    }
  };


  /**
   * Determine the path needed to get between two Waypoints using Google's
   * direction service.
   *
   * @param {aeris.maps.gmap.route.Waypoint} origin The origin Waypoint
   * @param {aeris.maps.gmap.route.Waypoint} destination The destination
   *                                                     Waypoint
   * @return {aeris.Promise}
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.getGoogleRoute =
      function(origin, destination) {

    // Create a new promise that will be resolved when the directions have
    // been gathered and applied to the Waypoints.
    var promise = new aeris.Promise();

    // Convert the Waypoint's lat/lon to Google's format.
    var originLatLng = this.aerisMap.toLatLon(origin.getLatLon());
    var destinationLatLng = this.aerisMap.toLatLon(destination.getLatLon());

    // Configure the request for the route
    var request = {
      origin: originLatLng,
      destination: destinationLatLng,
      travelMode: google.maps.TravelMode[destination.travelMode]
    };

    // Request the route from the Google's direction service.
    this.googleDirectionsService_.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {

        // Get the path to the destination Waypoint
        var path = destination.path = response.routes[0].overview_path;

        // Save the geocoded lat/lon to the Waypoints
        var originLatLng = path[0];
        origin.geocodedLatLon = [originLatLng.lat(), originLatLng.lng()];
        var destinationLatLng = path[path.length - 1];
        destination.geocodedLatLon = [destinationLatLng.lat(),
                                      destinationLatLng.lng()];

        // Save the distance between the Waypoints
        destination.distance = response.routes[0].legs[0].distance.value;

        // Resolve the promise that the path has been gathered.
        promise.resolve(destination);
      }
    });

    return promise;
  };


  /**
   * Set the Route being built.
   *
   * @param {aeris.maps.gmap.route.Route} route
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.setRoute = function(route) {
    this.route_ = route;
  };


  return aeris.maps.gmaps.route.RouteBuilder;

});
