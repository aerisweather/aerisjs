define(['aeris',
  'gmaps/route/commands/abstractroutecommand',
  'aeris/errors/apiresponseerror',
  'gmaps/utils',
  'aeris/promise'
], function(aeris, AbstractRouteCommand, APIResponseError, gUtils, Promise) {

  /**
   * @fileoverview A Command to add a Waypoint to a Route.
   */


  aeris.provide('aeris.maps.gmaps.route.commands.AddWaypointCommand');


  /**
   * Create a Command that will add a Waypoint to a Route.
   *
   * @extends {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   *
   * @param {aeris.maps.gmaps.route.Route} route
   *     The Route to add the Waypoint to
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   *     The Waypoint to add to the Route
   * @constructor
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand = function(route, waypoint) {
    AbstractRouteCommand.apply(this, arguments);


    /**
     * The Waypoint being added to the Route.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */
    this.waypoint_ = waypoint;
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.AddWaypointCommand,
    AbstractRouteCommand
  );


  /**
   * Execute the command.
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.execute = function() {
    this.addWaypoint_().done(function() {
      this.promise_.resolve(arguments);
    }, this).fail(function() {
      this.promise_.reject(arguments);
    }, this);

    return this.promise_;
  };


  /**
   * Add the Waypoint to the Route
   * @private
   *
   * @return {aeris.Promise}
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.addWaypoint_ = function() {
    var subPromise = new Promise;
    var lastWaypoint = this.route_.getLastWaypoint();
    var directDistance;

    if (!lastWaypoint || this.waypoint_.path) {
      // If this is the first Waypoint, immediately add it to the Route.
      // If the waypoint already has a path, immediately add it to the Route
      this.route_.add(this.waypoint_);
      subPromise.resolve();

    } else if (!this.waypoint_.followPaths) {
      // If this Waypoint is not following a route, calculate the spherical
      // distance and add to the route.
      directDistance = this.calculateDirectDistance_(lastWaypoint, this.waypoint_);

      this.waypoint_.setDistance(directDistance);
      this.route_.add(this.waypoint_);

      subPromise.resolve();
    } else {
      // The routing service is needed, so get the path and then add the
      // Waypoint to the Route.
      this.fetchPath_(lastWaypoint, this.waypoint_).done(function(path, distance) {
        this.waypoint_.set({
          path: path,
          geocodedLatLon: path[path.length - 1],
          distance: distance
        })

        lastWaypoint.set({
          geocodedLatLon: path[0]
        });

        // Add the Waypoint to the Route
        this.route_.add(this.waypoint_);
      }, this);
    }

    return subPromise;
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
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.getGoogleRoute_ =
      function(origin, destination) {

    // Create a new promise that will be resolved when the directions have
    // been gathered and applied to the Waypoints.
    var promise = new aeris.Promise();

    // Convert the Waypoint's lat/lon to Google's format.
    var originLatLng = aeris.maps.gmaps.utils.arrayToLatLng(origin.getLatLon());
    var destinationLatLng = aeris.maps.gmaps.utils.arrayToLatLng(
        destination.getLatLon());

    // Configure the request for the route
    var request = {
      origin: originLatLng,
      destination: destinationLatLng,
      travelMode: google.maps.TravelMode[destination.travelMode]
    };

    // Request the route from the Google's direction service.
    this.googleDirectionsService_.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        promise.resolve(response);
      }
      else {
        throw new APIResponseError('Google DirectionsService responded with an error: ' + status);
      }
    });

    return promise;
  };

  return aeris.maps.gmaps.route.commands.AddWaypointCommand;

});
