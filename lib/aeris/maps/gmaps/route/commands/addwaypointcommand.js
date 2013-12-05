/**
 * @fileoverview Defines the AddWaypointCommand class.
*/
define([
  'aeris/emptypromise',
  'gmaps/route/commands/abstractroutecommand',
  'aeris/errors/invalidargumenterror',
  'aeris/util'
], function(EmptyPromise, AbstractRouteCommand, InvalidArgumentError, _) {
  /**
   *
   * @param {Object=} opt_options
   * @param {number} opt_options.at Index at which to add the waypoint.
   *                                Defaults to the end of the route.
   *
   * @constructor
   * @class aeris.maps.gmaps.route.commands.AddWaypointCommand
   * @extends {aeris.maps.gmaps.route.commands.AbstractRouteCommand}
   */
  var AddWaypointCommand = function(route, waypoint, opt_options) {
    var options;

    AbstractRouteCommand.call(this, route);

    // Set default options
    options = _.extend({
      at: this.route_.getWaypoints().length     // Defaults to end of route
    }, opt_options);

    this.newWaypoint_ = waypoint;

    this.index_ = options.at;
  };

  _.inherits(AddWaypointCommand, AbstractRouteCommand);


  AddWaypointCommand.prototype.execute_ = function() {
    this.route_.add(this.newWaypoint_, { at: this.index_});

    return new EmptyPromise();
  };

  AddWaypointCommand.prototype.undo_ = function() {
    this.route_.remove(this.newWaypoint_);

    return new EmptyPromise();
  };


  return _.expose(AddWaypointCommand, 'aeris.maps.gmaps.route.commands.AddWaypointCommand');
});
