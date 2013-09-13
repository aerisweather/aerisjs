define([
  'aeris/events',
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/waypoint',
  'gmaps/route/routerenderer',
  'aeris/commands/commandmanager',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/commands/movewaypointcommand',
  'gmaps/route/commands/removewaypointcommand',
  'gmaps/route/commands/resetroutecommand',
  'base/extension/mapextension'
], function(
  Events,
  _,
  InvalidArgumentError,
  Waypoint,
  RouteRenderer,
  CommandManager,
  AddWaypointCommand,
  MoveWaypointCommand,
  RemoveWaypointCommand,
  ResetRouteCommand
) {

  /**
   * @fileoverview A Google Map extension for building a Route.
   */


  _.provide('aeris.maps.gmaps.route.RouteBuilder');


  /**
   * Central Route component interface
   * for an application layer.
   *
   * Provides interface to route commands
   * and binds route events to {aeris.maps.gmaps.route.RouteRenderer}
   *
   * @param {Object=} opt_options
   * @param {aeris.maps.gmaps.route.RouteRenderer=} opt_options.routeRenderer
   * @param {aeris.commands.CommandManager=} opt_options.commandManger
   * @param {aeris.maps.gmaps.route.Route} opt_options.route
   * @param {Boolean=} opt_options.followDirections opt_options.followDirections
   *        Whether a added waypoint should follow directions.
   *        Defaults to true.
   * @param {string=} opt_options.travelMode
   *        Travel mode for added waypoints.
   *        Defaults to 'WALKING'.
   *
   * @class aeris.maps.gmaps.route.RouteBuilder
   * @constructor
   */
  aeris.maps.gmaps.route.RouteBuilder = function(opt_options) {
    var options = _.extend({
      commandManager: new CommandManager(),
      followDirections: true,
      travelMode: 'WALKING'
    }, opt_options);

    Events.call(this);


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
    this.routeRenderer_ = options.routeRenderer;


    /**
     *
     * @type {boolean}
     */
    this.commandManager_ = options.commandManager;

    /**
     * Follow paths provided by Google Maps.
     *
     * @type {boolean}
     */
    this.followDirections = options.followDirections;


    /**
     * Travel mode to use when following paths.
     * e.g. WALKING, BICYCLING, DRIVING
     *
     * @type {string}
     */
    this.travelMode = 'WALKING';


    /**
     * Hash of event listeners bound to the {aeris.maps.gmaps.route.Route}
     *
     * @type {Object}
     * @private
     */
    this.routeEvents_ = {
      add: this.renderWaypoint_,
      remove: this.eraseWaypoint_,
      reset: this.renderReset_,

      // Listen to 'change' instead of
      // change:property, so we don't end up
      // Redrawing paths multiple times for a single change event
      change: function(waypoint, evtObj) {
        var interests = ['latLon', 'geocodedLatLon', 'path', 'selected'];
        if (_.intersection(evtObj.properties, interests).length) {
          this.renderWaypoint_(waypoint);
        }
      }
    };

    if (options.route) {
      this.setRoute(options.route);
    }

    // Proxy command events
    this.proxyEvents(this.commandManager_, function(topic, arguments) {
      this.trigger('command');

      return {
        topic: 'command:' + topic,
        arguments: arguments
      };
    }, this);
  };

  _.extend(aeris.maps.gmaps.route.RouteBuilder.prototype, Events.prototype);


  /**
   * Return the RouteBuilders {aeris.maps.gmaps.route.Route} instance
   * @return {aeris.maps.gmaps.route.Route}
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.getRoute = function() {
    return this.route_;
  };


  /**
   * Return the RouteBuilders {aeris.maps.gmaps.route.Route} instance
   * @return {aeris.maps.gmaps.route.Route}
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.getRenderer = function() {
    return this.routeRenderer_;
  };


  /**
   * Delegates events to `this.route_`.
   *
   * @param {Object=} opt_events Defaults to this.routeEvents_.
   *        eg { 'click': this.handleClick_ }.
   * @param {Object} opt_ctx Context in which to invoke event handlers.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.delegateRouteEvents = function(opt_events, opt_ctx) {
    opt_events || (opt_events = this.routeEvents_);
    opt_ctx || (opt_ctx = this);

    this.listenTo(this.getRoute(), opt_events, opt_ctx);
  };


  /**
   * Undelegate events bound to this.route_
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.undelegateRouteEvents = function() {
    this.stopListening(this.getRoute());
  };


  /**
   * Undelegate all events bound by this
   * RouteBuilder.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.undelegateEvents = function() {
    this.undelegateRouteEvents();
    this.commandManager_.removeProxy();
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
   * @param {Object=} opt_options
   * @param {number} opt_options.at Index at which to add the waypoint.
   * @return {aeris.Promise} A promise to add the waypoint.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.addWaypoint = function(waypointOrLatLon, opt_options) {
    var options = _.extend({}, opt_options);
    var waypoint, command, commandOpts, commandOptKeys;

    // If a route has not been defined, the Waypoint cannot be added.
    if (!this.getRoute()) return false;

    // Create a new Waypoint positioned where the click occurred.
    waypoint = waypointOrLatLon instanceof Waypoint ?
                waypointOrLatLon :
                new aeris.maps.gmaps.route.Waypoint({
                  latLon: waypointOrLatLon,
                  followDirections: this.followDirections,
                  travelMode: this.travelMode
                });

    // List of method options which should
    // be passed on to the command
    commandOptKeys = ['at'];
    commandOpts = {};

    // Set command options
    _.each(commandOptKeys, function(key) {
      if (!_.isUndefined(options[key])) {
        commandOpts || (commandOpts = {});
        commandOpts[key] = options[key];
      }
    }, this);

    // Add the Waypoint
    command = new aeris.maps.gmaps.route.commands.AddWaypointCommand(this.getRoute(), waypoint, commandOpts);
    return this.commandManager_.executeCommand(command);
  };


  aeris.maps.gmaps.route.RouteBuilder.prototype.moveWaypoint = function(waypoint, latLon) {
    var command = new aeris.maps.gmaps.route.commands.MoveWaypointCommand(this.getRoute(), waypoint, latLon);
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
    var command = new aeris.maps.gmaps.route.commands.RemoveWaypointCommand(this.getRoute(), waypoint);
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
  aeris.maps.gmaps.route.RouteBuilder.prototype.resetRoute = function(waypoints) {
    var command;

    command = new aeris.maps.gmaps.route.commands.ResetRouteCommand(this.getRoute(), waypoints);
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

    if (this.getRoute()) {
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
    var nextWaypoint = this.getRoute().at(index);

    this.routeRenderer_.eraseWaypoint(waypoint, this.getRoute());

    // Redraw next waypoint
    if (nextWaypoint) {
      this.routeRenderer_.renderWaypoint(nextWaypoint, this.getRoute());
    }
  };


  aeris.maps.gmaps.route.RouteBuilder.prototype.renderReset_ = function(waypoints) {
    this.routeRenderer_.eraseRoute(this.getRoute());

    if (waypoints.length) {
      this.routeRenderer_.renderRoute(this.getRoute());
    }
  };

  return aeris.maps.gmaps.route.RouteBuilder;

});
