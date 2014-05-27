define([
  'aeris/events',
  'aeris/util',
  'aeris/emptypromise',
  'aeris/errors/invalidargumenterror',
  'aeris/maps/routes/waypoint',
  'aeris/maps/routes/route',
  'aeris/maps/routes/routerenderer',
  'aeris/commands/commandmanager',
  'aeris/maps/routes/commands/addwaypointcommand',
  'aeris/maps/routes/commands/movewaypointcommand',
  'aeris/maps/routes/commands/removewaypointcommand',
  'aeris/maps/routes/commands/resetroutecommand',
  'aeris/maps/routes/commands/appendreverseroutecommand'
], function(
  Events,
  _,
  EmptyPromise,
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
   * @class RouteBuilder
   * @namespace aeris.maps.gmaps.route
   * @constructor
   */
  var RouteBuilder = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      followDirections: true,
      travelMode: 'DRIVING',
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
     * @property route_
     */
    this.route_;


    /**
     * The {aeris.maps.gmaps.route.RouteRenderer} used by the
     * builder to render route view elements.
     *
     * @type {aeris.maps.gmaps.route.RouteRenderer}
     * @private
     * @property routeRenderer_
     */
    this.routeRenderer_ = options.routeRenderer || new RouteRenderer();

    /**
     * Travel mode to set on new waypoints.
     * @type {aeris.maps.gmaps.route.Waypoint.travelMode}
     * @property travelMode
     */
    this.travelMode = options.travelMode;


    /**
     * Whether added waypoints should follow directions.
     * @type {Boolean}
     * @property followDirections
     */
    this.followDirections = options.followDirections;



    /**
     *
     * @type {boolean}
     * @property commandManager_
     */
    this.commandManager_ = options.commandManager;


    /**
     * @type {Function} Constructor.
     * @private
     * @property AddWaypointCommand_
     */
    this.AddWaypointCommand_ = options.AddWaypointCommand;


    /**
     * @type {Function} Constructor.
     * @private
     * @property MoveWaypointCommand_
     */
    this.MoveWaypointCommand_ = options.MoveWaypointCommand;


    /**
     * @type {Function} Constructor.
     * @private
     * @property RemoveWaypointCommand_
     */
    this.RemoveWaypointCommand_ = options.RemoveWaypointCommand;


    /**
     * @type {Function} Constructor.
     * @private
     * @property ResetRouteCommand_
     */
    this.ResetRouteCommand_ = options.ResetRouteCommand;


    /**
     * @type {Function} Constructor.
     * @private
     * @property AppendReverseRouteCommand_
     */
    this.AppendReverseRouteCommand_ = options.AppendReverseRouteCommand;


    /**
     * Hash of event listeners bound to the {aeris.maps.gmaps.route.Route}
     *
     * @type {Object}
     * @private
     * @property routeEvents_
     */
    this.routeEvents_ = {
      add: [this.renderWaypoint_, this.updateWaypointInstructions_],
      remove: this.eraseWaypoint_,
      reset: function(route, options) {
        _.each(options.previousModels, this.eraseWaypoint_, this);
        this.redrawRoute_(route);
      },

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

    this.styleRoute(options.styles);

    this.proxyCommandManagerEvents_();

    /**
     * @event waypoint:click
     * @param {aeris.maps.LatLon} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} marker
     */
    /**
     * @event waypoint:dragend
     * @param {aeris.maps.LatLon} latLon
     * @param {aeris.maps.gmaps.route.Waypoint} marker
     */
    /**
     * @event path:click
     * @param {aeris.maps.LatLon} latLon
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


  /**
   * @return {aeris.maps.gmaps.route.Route}
   * @method getRoute
   */
  RouteBuilder.prototype.getRoute = function() {
    return this.route_;
  };


  /**
   * @param {aeris.maps.Map} map
   * @method setMap
   */
  RouteBuilder.prototype.setMap = function(map) {
    this.routeRenderer_.setMap(map);
  };


  /**
   * @param {Object} styles
   * @method styleRoute
   */
  RouteBuilder.prototype.styleRoute = function(styles) {
    this.routeRenderer_.setStyles(styles);
  };


  /**
   * Delegates events to `this.route_`.
   *
   * @param {Object=} opt_events Defaults to this.routeEvents_.
   *        eg { 'click': this.handleClick_ }.
   * @param {Object} opt_ctx Context in which to invoke event handlers.
   * @method delegateRouteEvents
   */
  RouteBuilder.prototype.delegateRouteEvents = function(opt_events, opt_ctx) {
    opt_events || (opt_events = this.routeEvents_);
    opt_ctx || (opt_ctx = this);

    this.listenTo(this.getRoute(), opt_events, opt_ctx);
  };


  /**
   * Undelegate events bound to this.route_
   * @method undelegateRouteEvents
   */
  RouteBuilder.prototype.undelegateRouteEvents = function() {
    this.stopListening(this.getRoute());
  };


  /**
   * Undelegate all events bound by this
   * RouteBuilder.
   * @method undelegateEvents
   */
  RouteBuilder.prototype.undelegateEvents = function() {
    this.undelegateRouteEvents();
    this.commandManager_.removeProxy();
  };


  /**
   * @return {Object}
   * @method routeToJSON
   */
  RouteBuilder.prototype.routeToJSON = function() {
    return this.route_.toJSON();
  };


  /**
   * Undo the last executed command
   *
   * @return {aeris.Promise} Promise to undo command.
   * @method undo
   */
  RouteBuilder.prototype.undo = function() {
    return this.commandManager_.undo();
  };


  /**
   * @return. {Boolean} Whether undo is an available action.
   * @method canUndo
   */
  RouteBuilder.prototype.canUndo = function() {
    return this.commandManager_.canUndo();
  };

  /**
   * Redo the last executed command.
   *
   * @return {aeris.Promise} Promise to redo command.
   * @method redo
   */
  RouteBuilder.prototype.redo = function() {
    return this.commandManager_.redo();
  };


  /**
   * @return. {Boolean} Whether redo is an available action.
   * @method canRedo
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
   * @method addWaypoint
   */
  RouteBuilder.prototype.addWaypoint = function(waypoint, opt_options) {
    var options = opt_options || {};
    var command;

    this.updateWaypointInstructions_(waypoint);

    if (options.at) {
      return this.addWaypointAt(waypoint, options.at);
    }

    command = new this.AddWaypointCommand_(this.getRoute(), waypoint);
    return this.executeCommand_(command);
  };


  /**
   * Insert a waypoint into to the route at a specified index.
   *
   * @param {aeris.maps.gmaps.route.Waypoint|Array.<number>} waypoint
   * @param {Number=} atIndex
   *
   * @return {aeris.Promise} A promise to add the waypoint.
   * @method addWaypointAt
   */
  RouteBuilder.prototype.addWaypointAt = function(waypoint, atIndex) {
    var command;
    var commandOptions = {
      at: atIndex
    };

    this.updateWaypointInstructions_(waypoint);

    command = new this.AddWaypointCommand_(this.getRoute(), waypoint, commandOptions);

    this.executeCommand_(command);
  };


  /**
   * Change the position of a waypoint.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {aeris.maps.LatLon} latLon
   *
   * @return {aeris.Promise}
   * @method moveWaypoint
   */
  RouteBuilder.prototype.moveWaypoint = function(waypoint, latLon) {
    var command = new this.MoveWaypointCommand_(this.getRoute(), waypoint, latLon);
    return this.executeCommand_(command);
  };


  /**
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @return {aeris.Promise} A promise to remove the waypoint.
   * @method removeWaypoint
   */
  RouteBuilder.prototype.removeWaypoint = function(waypoint) {
    var command = new this.RemoveWaypointCommand_(this.getRoute(), waypoint);
    return this.executeCommand_(command);
  };


  /**
   * @return {aeris.Promise} Promise to execute command.
   * @method appendReverseRoute
   */
  RouteBuilder.prototype.appendReverseRoute = function() {
    var command;

    var doesRouteHaveWaypointsToReverse = this.route_.length > 1;
    if (!doesRouteHaveWaypointsToReverse) { return new EmptyPromise(); }

    command = new this.AppendReverseRouteCommand_(this.getRoute());

    return this.executeCommand_(command);
  };


  /**
   * Reset all waypoints in a route.
   *
   * @param {Array.<aeris.maps.gmaps.route.Waypoint>=} opt_waypoints
   *        If not set, will clear all waypoints in the route.
   * @return {aeris.Promise} A promise to reset the route.
   * @method resetRoute
   */
  RouteBuilder.prototype.resetRoute = function(opt_waypoints) {
    var command;

    command = new this.ResetRouteCommand_(this.getRoute(), opt_waypoints);
    return this.executeCommand_(command);
  };


  /**
   * @private
   *
   * @param {aeris.commands.AbstractCommand} command
   * @return {aeris.Promise}
   * @method executeCommand_
   */
  RouteBuilder.prototype.executeCommand_ = function(command) {
    var promiseToExecute = this.commandManager_.executeCommand(command);
    return promiseToExecute;
  };


  /**
   * @param {aeris.maps.gmaps.route.Route} route
   * @method setRoute
   */
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
   * @method renderWaypoint_
   */
  RouteBuilder.prototype.renderWaypoint_ = function(waypoint) {
    this.routeRenderer_.renderWaypoint(waypoint);
  };


  RouteBuilder.prototype.updateWaypointInstructions_ = function(waypoint) {
    waypoint.set({
      followDirections: this.followDirections,
      travelMode: this.travelMode
    }, { validate: true });
  };


  /**
   * Remove a waypoint view from the map.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} waypoint
   * @param {number} indexOfWaypointInRoute
   * @private
   * @method eraseWaypoint_
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
   * @method redrawRoute_
   */
  RouteBuilder.prototype.redrawRoute_ = function(waypoints) {
    this.routeRenderer_.eraseRoute(this.getRoute());

    if (waypoints.length) {
      this.routeRenderer_.renderRoute(this.getRoute());
    }
  };


  return _.expose(RouteBuilder, 'aeris.maps.gmaps.route.RouteBuilder');
});
