define([
  'aeris',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/waypoint',
  'gmaps/route/routerenderer',
  'gmaps/route/commands/commandmanager',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/commands/removewaypointcommand',
  'gmaps/route/commands/resetroutecommand',
  'base/extension/mapextension',
  'base/events/click'
], function(
  aeris,
  InvalidArgumentError,
  Waypoint,
  RouteRenderer,
  CommandManager,
  AddWaypointCommand,
  RemoveWaypointCommand,
  ResetRouteCommand
) {

  /**
   * @fileoverview A Google Map extension for building a Route.
   */


  aeris.provide('aeris.maps.gmaps.route.RouteBuilder');


  /**
   * Listens to AerisMap events
   * And sends commands to the route
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtension}
   */
  aeris.maps.gmaps.route.RouteBuilder = function(aerisMap, opt_options) {
    var options = opt_options || {};

    aeris.maps.extension.MapExtension.call(this, aerisMap, opt_options);


    /**
     * The Route being built.
     *
     * @type {aeris.maps.gmaps.route.Route}
     * @private
     */
    this.route_;


    /**
     * The {aeris.maps.gmaps.route.RouteRenderer} used by the
     * builder to render route view elements.
     *
     * @type {aeris.maps.gmaps.route.RouteRenderer}
     * @private
     */
    this.routeRenderer_ = options.routeRenderer || new aeris.maps.gmaps.route.RouteRenderer(aerisMap);


    /**
     *
     * @type {boolean}
     */
    this.commandManager_ = options.commandManager || new CommandManager();

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

    /**
     * A map click handler.
     *
     * @type {aeris.maps.events.Click}
     * @private
     */
    this.click_ = new aeris.maps.events.Click();
    this.click_.setMap(this.aerisMap);


    /**
     * Hash of event listeners bound to the {aeris.maps.gmaps.route.Route}
     *
     * @type {Object}
     * @private
     */
    this.routeEvents_ = {
      add: this.renderWaypoint_,
      remove: this.eraseWaypoint_,
      reset: this.renderReset_
    };


    this.setRoute(options.route);
  };
  aeris.inherits(aeris.maps.gmaps.route.RouteBuilder,
                 aeris.maps.extension.MapExtension);


  /**
   * Return the RouteBuilders {aeris.maps.gmaps.route.Route} instance
   * @return {aeris.maps.gmaps.route.Route}
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.getRoute = function() {
    return this.route_;
  };


  /**
   * Delegates events to a specified object.
   * All events are bound to the context of the RouteBuilder instance.
   *
   * @param {Object} target An object implementing {aeris.Events}.
   * @param {Object} events Hash of events and handlers.
   *        eg. { 'click': this.handleClick_ }.
   * @private
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.delegateEventsTo_ = function(target, events) {
    for (var event in events) {
      var handler = events[event];

      if (events.hasOwnProperty(event)) {
        if (!aeris.utils.isFunction(handler)) {
          throw new InvalidArgumentError('Cannot bind non-function to event listener');
        }

        target.on(event, handler, this);
      }
    }
  };

  /**
   * Undelegate events from an object.
   *
   * @param {Object} target An object implementing {aeris.Events}.
   * @param {Object} events Hash of events and handlers.
   *        eg. { 'click': this.handleClick_ }.
   * @private
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.undelegateEventsFrom_ = function(target, events) {
    for (var event in events) {
      var handler = events[event];
      if (events.hasOwnProperty(event)) {
        target.off('event', handler, this);
      }
    }
  };


  /**
   * Delegates events to `this.route_`.\
   * All events are bound to the context of the RouteBuilder instance.
   * @param {Object=} events Defaults to this.routeEvents_.
   *        eg { 'click': this.handleClick_ }.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.delegateRouteEvents = function(events) {
    events || (events = this.routeEvents_);

    this.delegateEventsTo_(this.route_, events);
  };


  /**
   * Undelegate events bound to this.route_
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.undelegateRouteEvents = function() {
    this.undelegateEventsFrom_(this.route_, this.routeEvents_);
  };


  /**
   * Undelegate all events bound by this
   * RouteBuilder.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.undelegateEvents = function() {
    this.undelegateRouteEvents();
  };

  /**
   * Undo the last executed command
   *
   * @return {aeris.Promise} Promise to undo command.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.undo = function() {
    return this.commandManager_.undo();
  };


  /**
   * @return. {Boolean} Whether undo is an available action.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.canUndo = function() {
    return this.commandManager_.canUndo();
  };

  /**
   * Redo the last executed command.
   *
   * @return {aeris.Promise} Promise to redo command.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.redo = function() {
    return this.commandManager_.redo();
  };


  /**
   * @return. {Boolean} Whether redo is an available action.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.canRedo = function() {
    return this.commandManager_.canRedo();
  };


  /**
   * Handle map click events.
   *
   * @param {aeris.maps.gmaps.route.Waypoint|Array.<number>} waypointOrLatLon
   *        A waypoint, or the lat/lon on which to place a waypoint.
   * @return {aeris.Promise} A promise to add the waypoint.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.addWaypoint = function(waypointOrLatLon) {
    var waypoint;

    // If a route has not been defined, the Waypoint cannot be added.
    if (!this.route_) return false;

    // Create a new Waypoint positioned where the click occurred.
    waypoint = waypointOrLatLon instanceof Waypoint ?
                waypointOrLatLon :
                new aeris.maps.gmaps.route.Waypoint({
                  originalLatLon: waypointOrLatLon,
                  followPaths: this.followPaths,
                  travelMode: this.travelMode
                });

    // Add the Waypoint
    var command = new AddWaypointCommand(this.route_, waypoint);
    return this.commandManager_.executeCommand(command);
  };


  /**
   * Remove a waypoint from a route
   * using {aeris.maps.gmaps.route.commands.RemoveWaypointCommand}
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.Promise} A promise to remove the waypoint, and recalculate paths.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.removeWaypoint = function(waypoint) {
    if (this.route_.getWaypoints().indexOf(waypoint) === -1) {
      throw new InvalidArgumentError('Unable to remove waypoint: waypoint does not belong to route');
    }

    var command = new RemoveWaypointCommand(this.route_, waypoint);
    return this.commandManager_.executeCommand(command);
  };


  /**
   * Reset all waypoints in a route
   * using {aeris.maps.gmaps.route.commands.ResetRouteCommand}
   *
   * @param {Array.<aeris.maps.gmaps.route.Waypoint>} waypoints
   * @param {Boolean} refresh Whether to request new waypoint path data from Google Directions.
   * @return {aeris.Promise} A promise to reset the route.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.resetRoute = function(waypoints, refresh) {
    var command;

    command = new ResetRouteCommand(this.route_, waypoints, refresh);
    return this.commandManager_.executeCommand(command);
  };



  /**
   * Set the Route being built.
   *
   * @param {aeris.maps.gmaps.route.Route} route
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.setRoute = function(route) {

    if (route && !(route instanceof aeris.maps.gmaps.route.Route)) {
      throw new Error('Unable to set route: invalid route.');
    }

    if (this.route_) {
      this.undelegateRouteEvents();
    }

    this.route_ = route || new aeris.maps.gmaps.route.Route();
    this.delegateRouteEvents();
  };


  /**
   * Render a waypoint.
   * Delegates to {aeris.maps.gmaps.route.routeRenderer} instance.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint The Waypoint to be
   *                                                   rendered.
   * @param {aeris.maps.gmaps.route.Route} route The route to which the waypoint belongs.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.renderWaypoint_ = function(waypoint) {
    this.routeRenderer_.renderWaypoint.apply(this.routeRenderer_, [waypoint, this.route_]);
  };


  aeris.maps.gmaps.route.RouteBuilder.prototype.eraseWaypoint_ = function(waypoint, index) {
    var nextWaypoint = this.route_.at(index);

    this.routeRenderer_.eraseWaypoint(waypoint, this.route_);

    // Redraw next waypoint
    if (nextWaypoint) {
      this.routeRenderer_.renderWaypoint(nextWaypoint, this.route_);
    }
  };


  aeris.maps.gmaps.route.RouteBuilder.prototype.renderReset_ = function(waypoints) {
    this.routeRenderer_.eraseRoute(this.route_);

    if (waypoints.length) {
      this.routeRenderer_.renderRoute(this.route_);
    }
  };

  return aeris.maps.gmaps.route.RouteBuilder;

});
