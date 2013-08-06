define(['aeris',
  'gmaps/route/commands/abstractroutecommand',
  'gmaps/route/commands/removewaypointcommand',
  'aeris/errors/commandhistoryerror',
  'gmaps/utils',
  'aeris/promise'
], function(aeris, AbstractRouteCommand, RemoveWaypointCommand, CommandHistoryError, gUtils, Promise) {

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
   *     The Route to add the Waypoint to.
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   *     The Waypoint to add to the Route.
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
   *
   * @return {aeris.Promise} Promise to execute the command.
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.execute_ = function() {
    return this.addWaypoint_();
  };


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.AddWaypointCommand.prototype.undo_ = function() {
    var removeCommand = new RemoveWaypointCommand(this.route_, this.waypoint_);
    return removeCommand.execute();
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
    var directDistance, directPath;

    if (!lastWaypoint || this.waypoint_.path) {
      // If this is the first Waypoint, immediately add it to the Route.
      // If the waypoint already has a path, immediately add it to the Route
      this.route_.add(this.waypoint_);
      subPromise.resolve();

    } else if (!this.waypoint_.followPaths) {
      // If this Waypoint is not following a route, calculate the spherical
      // distance and add to the route.
      directDistance = lastWaypoint.calculateDirectDistanceTo(this.waypoint_);
      directPath = [
        lastWaypoint.getLatLon(),
        this.waypoint_.getLatLon()
      ];

      this.waypoint_.set({
        distance: directDistance,
        path: directPath
      });

      this.route_.add(this.waypoint_);

      subPromise.resolve();
    } else {
      // The routing service is needed, so get the path and then add the
      // Waypoint to the Route.
      lastWaypoint.fetchPathTo(this.waypoint_, this.googleDirectionsService_).done(function(path, distance) {
        this.waypoint_.set({
          path: path,
          geocodedLatLon: path[path.length - 1],
          distance: distance
        });

        lastWaypoint.set({
          geocodedLatLon: path[0]
        });

        // Add the Waypoint to the Route
        this.route_.add(this.waypoint_);

        subPromise.resolve();
      }, this);
    }

    return subPromise;
  };


  return aeris.maps.gmaps.route.commands.AddWaypointCommand;

});
