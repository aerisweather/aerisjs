/**
 * @fileoverview Defines the AbstractRouteCommand abstract class.
*/
define([
  'aeris',
  'aeris/promise',
  'aeris/commands/abstractcommand',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'aeris/errors/invalidargumenterror'
], function(aeris, Promise, AbstractCommand, Waypoint, Route, InvalidArgumentError) {
  aeris.provide('aeris.maps.gmaps.route.commands.AbstractRouteCommand');


  /**
   * AbstractRouteCommand
   *
   * Base class for all route commands.
   *
   * @extends {aeris.AbstractCommand}
   * @param {aeris.maps.gmaps.route.Route} route
   * @abstract
   * @constructor
   */
  aeris.maps.gmaps.route.commands.AbstractRouteCommand = function(route) {
    AbstractCommand.call(this);

    // Require route and waypoint
    if (!(route instanceof Route)) {
      throw new InvalidArgumentError('A RouteCommand requires a valid Route.');
    }


    /**
     * The Route the Waypoint will be added to.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @protected
     */
    this.route_ = route;


    /**
     * Google's direction service used to determine a path when following paths
     * is enabled.
     *
     * @type {google.maps.DirectionsService}
     * @protected
     */
    this.googleDirectionsService_ = new google.maps.DirectionsService();
  };

  aeris.inherits(
    aeris.maps.gmaps.route.commands.AbstractRouteCommand,
    AbstractCommand
  );


  /**
   * Updates the path between two waypoints
   * with data fetched from the Google Directions service
   *  (if following directions),
   * or calculated with the Google Geometry library
   *  (if not following directions).
   *
   * @param {aeris.maps.gmaps.route.Waypoint} origin
   * @param {aeris.maps.gmaps.route.Waypoint} destination
   * @protected
   * @return {aeris.Promise} A promise to update the paths.
   */
  aeris.maps.gmaps.route.commands.
    AbstractRouteCommand.prototype.updatePathBetween_ = function(origin, destination) {
    var promises = [];

    // Confirm that waypoints exist
    if (!(origin instanceof Waypoint) ||
      !(destination instanceof Waypoint)
      ) {
      throw new InvalidArgumentError('Unable to update path data: invalid waypoint');
    }

    // Following directions --> query path data from Google
    if (destination.followDirections) {
      promises.push(
        origin.fetchPathTo(destination, this.googleDirectionsService_).
          done(function(res) {
            // Set the path data on the destination waypoint
            destination.set({
              path: res.path,
              geocodedLatLon: res.path[res.path.length - 1],
              distance: res.distance
            });

            // Update the origin's geocoded lat/lng
            origin.set({
              geocodedLatLon: res.path[0]
            });
          })
      );
    }

    // Direct route
    else {
      destination.set({
        path: origin.getDirectPathTo(destination),
        distance: origin.calculateDirectDistanceTo(destination)
      });
    }

    return Promise.when(promises);
  };


  return aeris.maps.gmaps.route.commands.AbstractRouteCommand;
});
