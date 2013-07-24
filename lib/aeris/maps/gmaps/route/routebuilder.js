define([
  'aeris',
  'aeris/errors/invalidargumenterror',
  'gmaps/route/commands/addwaypointcommand',
  'gmaps/route/commands/removewaypointcommand',
  'gmaps/route/commands/resetroutecommand',
  'base/extension/mapextension',
  'base/events/click',
  'gmaps/route/waypoint'
], function(aeris, InvalidArgumentError, AddWaypointCommand, RemoveWaypointCommand, ResetRouteCommand) {

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
     * A hash of events to bind to this.aerisMap
     * Each key is the name of a property of this
     * which is an instance of {aeris.Events}.
     *
     * Value is in format { eventName: handlerFn }.
     *
     * Events are delegated using this.delegateMapEvents.
     *
     * @type {Object}
     * @private
     */
    this.mapEvents_ = {
      click_: {
        click: this.addWaypoint
      }
    };


    this.routeEvents_ = {
      add: this.renderWaypoint_,
      remove: this.eraseWaypoint_,
      reset: this.renderReset_
    };


    this.setRoute(options.route);

    // Bind map events
    this.delegateMapEvents();
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
   * Loops through mapEvents hash, and calls a callback.
   *
   * @param {Object} mapEvents see {@link aeris.maps.gmaps.route.RouteBuilder#mapEvents_}.
   * @param {function({Object}, {aeris.maps.Event})} callback Provides an events hash, and the target Event instance.
   * @private
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.eachMapEvent_ = function(mapEvents, callback) {
    mapEvents || (mapEvents = this.mapEvents_);

    if (!(aeris.utils.isFunction(callback))) {
      throw new InvalidArgumentError('Specified callback is not a function.');
    }

    // Loop through aeris.maps.Event objects (named properties)
    for (var targetEventProperty in mapEvents) {
      var eventObj = this[targetEventProperty];

      if (mapEvents.hasOwnProperty(targetEventProperty)) {
        // Ensure object belongs to this, and is Events instance
        if (!(eventObj instanceof aeris.maps.Event)) {
          throw new InvalidArgumentError('Map events key must be a RouteBuilder property and ' +
            'an instance of aeris.maps.Event.');
        }

        callback(mapEvents[targetEventProperty], eventObj);
      }
    }
  };


  /**
   * Bind handlers to map events.
   *
   * @param {Object=} mapEvents See {@link aeris.maps.gmaps.route.RouteBuilder#mapEvents_}
   *        Defaults to this.mapEvents_.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.delegateMapEvents = function(mapEvents) {
    var self = this;
    mapEvents || (mapEvents = this.mapEvents_);

    this.eachMapEvent_(mapEvents, function(events, eventObj) {
      self.delegateEventsTo_(eventObj, events);
    });
  };


  aeris.maps.gmaps.route.RouteBuilder.prototype.undelegateMapEvents = function() {
    var self = this;

    this.eachMapEvent_(this.mapEvents_, function(events, eventObj) {
      self.undelegateEventsFrom_(eventObj, events);
    });
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
    this.undelegateMapEvents();
  };


  /**
   * Handle map click events.
   *
   * @param {Array.<number>} latLon The lat/lon the click occurred at.
   * @return {aeris.Promise} A promise to add the waypoint.
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.addWaypoint =
      function(latLon) {

    // If a route has not been defined, the Waypoint cannot be added.
    if (!this.route_) return false;

    // Create a new Waypoint positioned where the click occurred.
    var waypoint = new aeris.maps.gmaps.route.Waypoint({
      originalLatLon: latLon,
      followPaths: this.followPaths,
      travelMode: this.travelMode
    });

    // Add the Waypoint
    var command = new AddWaypointCommand(this.route_, waypoint);
    return command.execute();
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
    return command.execute();
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
    return command.execute();
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
   */
  aeris.maps.gmaps.route.RouteBuilder.prototype.renderWaypoint_ = function() {
    this.routeRenderer_.renderWaypoint.apply(this.routeRenderer_, arguments);
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
