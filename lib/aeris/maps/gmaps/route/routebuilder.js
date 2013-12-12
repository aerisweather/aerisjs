define([
  'aeris/events',
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/waypoint',
  'gmaps/route/route',
  'gmaps/route/routerenderer',
  'aeris/commands/commandmanager',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/commands/movewaypointcommand',
  'gmaps/route/commands/removewaypointcommand',
  'gmaps/route/commands/resetroutecommand',
  'gmaps/route/commands/appendreverseroutecommand'
], function(
  Events,
  _,
  InvalidArgumentError,
  Waypoint,
  Route,
  RouteRenderer,
  CommandManager,
  AddWaypointCommand,
  MoveWaypointCommand,
  RemoveWaypointCommand,
  ResetRouteCommand,
  AppendReverseRouteCommand
) {


  /**
   * Central Route component interface
   * for an application layer.
   *
   * Provides interface to route commands
   * and binds route events to {aeris.maps.gmaps.route.RouteRenderer}
   *
   * @param {Object=} opt_options
   * @param {aeris.maps.gmaps.route.RouteRenderer=}   opt_options.routeRenderer
   * @param {aeris.commands.CommandManager=}          opt_options.commandManger
   * @param {aeris.maps.gmaps.route.Route}            opt_options.route
   * @param {Object=}                                 opt_options.styles See RouteRenderer for style options.
   *
   * @param {Function=} opt_options.AddWaypointCommand
   * @param {Function=} opt_options.MoveWaypointCommand
   * @param {Function=} opt_options.RemoveWaypointCommand
   * @param {Function=} opt_options.ResetRouteCommand
   * @param {Function=} opt_options.AppendReverseRouteCommand
   *
   * @class aeris.maps.gmaps.route.RouteBuilder
   * @constructor
   */
  var RouteBuilder = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      commandManager: new CommandManager(),
      AddWaypointCommand: AddWaypointCommand,
      MoveWaypointCommand: MoveWaypointCommand,
      RemoveWaypointCommand: RemoveWaypointCommand,
      ResetRouteCommand: ResetRouteCommand,
      AppendReverseRouteCommand: AppendReverseRouteCommand,
      styles: {}
    });

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
    this.routeRenderer_ = options.routeRenderer || new RouteRenderer();


    /**
     *
     * @type {boolean}
     */
    this.commandManager_ = options.commandManager;


    /**
     * @type {Function} Constructor.
     * @private
     */
    this.AddWaypointCommand_ = options.AddWaypointCommand;


    /**
     * @type {Function} Constructor.
     * @private
     */
    this.MoveWaypointCommand_ = options.MoveWaypointCommand;


    /**
     * @type {Function} Constructor.
     * @private
     */
    this.RemoveWaypointCommand_ = options.RemoveWaypointCommand;


    /**
     * @type {Function} Constructor.
     * @private
     */
    this.ResetRouteCommand_ = options.ResetRouteCommand;


    /**
     * @type {Function} Constructor.
     * @private
     */
    this.AppendReverseRouteCommand_ = options.AppendReverseRouteCommand;


    /**
     * Hash of event listeners bound to the {aeris.maps.gmaps.route.Route}
     *
     * @type {Object}
     * @private
     */
    this.routeEvents_ = {
      add: this.renderWaypoint_,
      remove: this.eraseWaypoint_,
      reset: this.redrawRoute_,

      'change:position change:position change:path change:selected': function(waypoint) {
        this.renderWaypoint_(waypoint);
      },

      'click': function(latLon, waypoint) {
        this.trigger('waypoint:click', latLon, waypoint);
      },
      'dragend': function(latLon, waypoint) {
        this.trigger('waypoint:dragend', latLon, waypoint);
      },
      'path:click': function(latLon, waypoint) {
        this.trigger('path:click', latLon, waypoint);
      }
    };

    this.setRoute(options.route || new Route());

    this.routeRenderer_.setStyles(options.styles);

    this.proxyCommandManagerEvents_();

    /**
     * @event marker:click
     * @param {Array.<number>} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} marker
     */
    /**
     * @event marker:dragend
     * @param {Array.<number>} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} marker
     */
    /**
     * @event path:click
     * @param {Array.<number>} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} marker
     *        Waypoint whose path was clicked.
     */

    /**
     * A command has been executed, undone, or redone.
     * @event command
     */
    /**
     * @event command:execute
     */
    /**
     * @event command:undo
     */
    /**
     * @event command:redo
     */
  };

  _.extend(RouteBuilder.prototype, Events.prototype);


  RouteBuilder.prototype.proxyCommandManagerEvents_ = function() {
    this.proxyEvents(this.commandManager_, function(topic, arguments) {
      this.trigger('command');

      return {
        topic: 'command:' + topic,
        arguments: []               // No need to expose command parameter
      };
    }, this);
  };


  /** @return {aeris.maps.gmaps.route.Route} */
  RouteBuilder.prototype.getRoute = function() {
    return this.route_;
  };


  /** @param {aeris.maps.Map} map */
  RouteBuilder.prototype.setMap = function(map) {
    this.routeRenderer_.setMap(map);
  };


  /**
   * Delegates events to `this.route_`.
   *
   * @param {Object=} opt_events Defaults to this.routeEvents_.
   *        eg { 'click': this.handleClick_ }.
   * @param {Object} opt_ctx Context in which to invoke event handlers.
   */
  RouteBuilder.prototype.delegateRouteEvents = function(opt_events, opt_ctx) {
    opt_events || (opt_events = this.routeEvents_);
    opt_ctx || (opt_ctx = this);

    this.listenTo(this.getRoute(), opt_events, opt_ctx);
  };


  /**
   * Undelegate events bound to this.route_
   */
  RouteBuilder.prototype.undelegateRouteEvents = function() {
    this.stopListening(this.getRoute());
  };


  /**
   * Undelegate all events bound by this
   * RouteBuilder.
   */
  RouteBuilder.prototype.undelegateEvents = function() {
    this.undelegateRouteEvents();
    this.commandManager_.removeProxy();
  };

  /**
   * Undo the last executed command
   *
   * @return {aeris.Promise} Promise to undo command.
   */
  RouteBuilder.prototype.undo = function() {
    return this.commandManager_.undo();
  };


  /**
   * @return. {Boolean} Whether undo is an available action.
   */
  RouteBuilder.prototype.canUndo = function() {
    return this.commandManager_.canUndo();
  };

  /**
   * Redo the last executed command.
   *
   * @return {aeris.Promise} Promise to redo command.
   */
  RouteBuilder.prototype.redo = function() {
    return this.commandManager_.redo();
  };


  /**
   * @return. {Boolean} Whether redo is an available action.
   */
  RouteBuilder.prototype.canRedo = function() {
    return this.commandManager_.canRedo();
  };


  /**
   * Add a waypoint to the route.
   *
   * @param {aeris.maps.gmaps.route.Waypoint|Array.<number>} waypoint
   *
   * @param {Object=} opt_options
   * @param {number} opt_options.at Index at which to add the waypoint.
   *
   * @return {aeris.Promise} A promise to add the waypoint.
   */
  RouteBuilder.prototype.addWaypoint = function(waypoint, opt_options) {
    var options = opt_options || {};
    var command;

    if (options.at) {
      return this.addWaypointAt(waypoint, options.at);
    }

    command = new this.AddWaypointCommand_(this.getRoute(), waypoint);
    return this.executeCommand_(command)
  };


  /**
   * Insert a waypoint into to the route at a specified index.
   *
   * @param {aeris.maps.gmaps.route.Waypoint|Array.<number>} waypoint
   * @param {Number=} atIndex
   *
   * @return {aeris.Promise} A promise to add the waypoint.
   */
  RouteBuilder.prototype.addWaypointAt = function(waypoint, atIndex) {
    var command;
    var commandOptions = {
      at: atIndex
    };

    command = new this.AddWaypointCommand_(this.getRoute(), waypoint, commandOptions);

    this.executeCommand_(command);
  };


  /**
   * Change the position of a waypoint.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {Array.<number>} latLon
   *
   * @return {Promise}
   */
  RouteBuilder.prototype.moveWaypoint = function(waypoint, latLon) {
    var command = new this.MoveWaypointCommand_(this.getRoute(), waypoint, latLon);
    return this.executeCommand_(command)
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.Promise} A promise to remove the waypoint.
   */
  RouteBuilder.prototype.removeWaypoint = function(waypoint) {
    var command = new this.RemoveWaypointCommand_(this.getRoute(), waypoint);
    return this.executeCommand_(command)
  };


  /** @return {Promise} Promise to execute command. */
  RouteBuilder.prototype.appendReverseRoute = function() {
    var command = new this.AppendReverseRouteCommand_(this.getRoute());

    return this.executeCommand_(command);
  };


  /**
   * Reset all waypoints in a route.
   *
   * @param {Array.<aeris.maps.gmaps.route.Waypoint>=} opt_waypoints
   *        If not set, will clear all waypoints in the route.
   * @return {aeris.Promise} A promise to reset the route.
   */
  RouteBuilder.prototype.resetRoute = function(opt_waypoints) {
    var command;

    command = new this.ResetRouteCommand_(this.getRoute(), opt_waypoints);
    return this.executeCommand_(command)
  };


  /**
   * @private
   *
   * @param {aeris.commands.AbstractCommand} command
   * @returns {aeris.Promise}
   */
  RouteBuilder.prototype.executeCommand_ = function(command) {
    var promiseToExecute = this.commandManager_.executeCommand(command);
    return promiseToExecute;
  };


  /** @param {aeris.maps.gmaps.route.Route} route */
  RouteBuilder.prototype.setRoute = function(route) {
    if (this.route_) {
      this.undelegateRouteEvents();
    }

    this.route_ = route;
    this.delegateRouteEvents();
  };


  /**
   * Render a waypoint.
   *
   * @private
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   */
  RouteBuilder.prototype.renderWaypoint_ = function(waypoint) {
    this.routeRenderer_.renderWaypoint(waypoint);
  };


  /**
   * Remove a waypoint view from the map.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {number} indexOfWaypointInRoute
   * @private
   */
  RouteBuilder.prototype.eraseWaypoint_ = function(waypoint, indexOfWaypointInRoute) {
    var nextWaypoint = this.getRoute().at(indexOfWaypointInRoute);

    this.routeRenderer_.eraseWaypoint(waypoint);

    // Redraw next waypoint
    if (nextWaypoint) {
      this.routeRenderer_.renderWaypoint(nextWaypoint);
    }
  };


  /**
   * @param {Array.<aeris.maps.gmaps.route.Waypoint>} waypoints
   * @private
   */
  RouteBuilder.prototype.redrawRoute_ = function(waypoints) {
    this.routeRenderer_.eraseRoute(this.getRoute());

    if (waypoints.length) {
      this.routeRenderer_.renderRoute(this.getRoute());
    }
  };


  return _.expose(RouteBuilder, 'aeris.maps.gmaps.route.RouteBuilder');
});
