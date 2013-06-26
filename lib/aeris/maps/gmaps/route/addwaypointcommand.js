define(['aeris', 'gmaps/util', 'aeris/promise'], function(aeris) {

  /**
   * @fileoverview A Command to add a Waypoint to a Route.
   */


  aeris.provide('aeris.maps.gmaps.route.AddWaypointCommand');


  /**
   * Create a Command that will add a Waypoint to a Route.
   *
   * @param {aeris.maps.gmaps.route.Route} route
   *     The Route to add the Waypoint to
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   *     The Waypoint to add to the Route
   * @constructor
   */
  aeris.maps.gmaps.route.AddWaypointCommand = function(route, waypoint) {

    /**
     * The Route the Waypoint will be added to.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @private
     */
    this.route_ = route;


    /**
     * The Waypoint being added to the Route.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */
    this.waypoint_ = waypoint;


    /**
     * Google's direction service used to determine a path when following paths
     * is enabled.
     *
     * @type {google.maps.DirectionsService}
     * @private
     */
    this.googleDirectionsService_ = new google.maps.DirectionsService();

  };


  /**
   * Execute the command.
   */
  aeris.maps.gmaps.route.AddWaypointCommand.prototype.execute = function() {
    this.addWaypoint_();
  };


  /**
   * Add the Waypoint to the Route
   */
  aeris.maps.gmaps.route.AddWaypointCommand.prototype.addWaypoint_ =
      function() {

    var lastWaypoint = this.route_.getLastWaypoint();

    if (!lastWaypoint) {
      // If this is the first Waypoint, immediately add it to the Route.
      this.route_.addWaypoint(this.waypoint_);

    } else if (!this.waypoint_.followPaths) {
      // If this Waypoint is not following a route, calculate the spherical
      // distance and add to the route.
      var originLatLng = aeris.maps.gmaps.util.arrayToLatLng(
          lastWaypoint.getLatLon());
      var destinationLatLng = aeris.maps.gmaps.util.arrayToLatLng(
          this.waypoint_.getLatLon());
      this.waypoint_.distance = google.maps.geometry.spherical.
          computeDistanceBetween(originLatLng, destinationLatLng);
      this.route_.addWaypoint(this.waypoint_);

    } else {
      // The routing service is needed, so get the path and then add the
      // Waypoint to the Route.
      var route = this.getGoogleRoute_(lastWaypoint, this.waypoint_);
      var self = this;
      route.done(function(response) {

        // Get the path to the destination Waypoint
        var path = self.waypoint_.path = response.routes[0].overview_path;

        // Save the geocoded lat/lon to the Waypoints
        var originLatLng = path[0];
        lastWaypoint.geocodedLatLon = [originLatLng.lat(), originLatLng.lng()];
        var destinationLatLng = path[path.length - 1];
        self.waypoint_.geocodedLatLon = [destinationLatLng.lat(),
                                         destinationLatLng.lng()];

        // Save the distance between the Waypoints
        self.waypoint_.distance = response.routes[0].legs[0].distance.value;

        // Add the Waypoint to the Route
        self.route_.addWaypoint(self.waypoint_);

      });
    }
  };


  /**
   * Determine the path needed to get between two Waypoints using Google's
   * direction service.
   *
   * @param {aeris.maps.gmap.route.Waypoint} origin The origin Waypoint
   * @param {aeris.maps.gmap.route.Waypoint} destination
   *     The destination Waypoint
   * @return {aeris.Promise}
   */
  aeris.maps.gmaps.route.AddWaypointCommand.prototype.getGoogleRoute_ =
      function(origin, destination) {

    // Create a new promise that will be resolved when the directions have
    // been gathered and applied to the Waypoints.
    var promise = new aeris.Promise();

    // Convert the Waypoint's lat/lon to Google's format.
    var originLatLng = aeris.maps.gmaps.util.arrayToLatLng(origin.getLatLon());
    var destinationLatLng = aeris.maps.gmaps.util.arrayToLatLng(
        destination.getLatLon());

    // Configure the request for the route
    var request = {
      origin: originLatLng,
      destination: destinationLatLng,
      travelMode: google.maps.TravelMode[destination.travelMode]
    };

    // Request the route from the Google's direction service.
    this.googleDirectionsService_.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK)
        promise.resolve(response);
    });

    return promise;
  };

});
