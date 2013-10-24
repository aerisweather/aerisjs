/**
 * @fileoverview Defines a DirectionsServiceInterface.
 */
define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'aeris/errors/unimplementedmethoderror'
], function(_, InvalidArgumentError, BaseUnimplementedMethodError) {

  /**
   * A custom UnimplementedMethodError
   * specific to the {DirectionsServiceInterface} class.
   *
   * @constructor
   * @extends {aeris.errors.UnimplementedMethodError}
   */
  var UnimplementedMethodError = function() {
    BaseUnimplementedMethodError.apply(this, arguments);
  };
  _.inherits(UnimplementedMethodError, InvalidArgumentError, BaseUnimplementedMethodError);

  UnimplementedMethodError.prototype.setMessage = function(message) {
    if (!message) {
      return 'DirectionsServiceInterface has not been fully implemented.';
    }

    return 'Classes implementing the DirectionsServiceInterface' +
      'must implement a ' + message + ' method.';
  };


  /**
   * Acts as an interface to a directions service API
   *
   * @constructor
   * @class aeris.maps.gmaps.route.directions.AbstractDirectionsService
   * @abstract
   */
  var AbstractDirectionsService = function() {
  };


  /**
   * Possible statuses for a directions request.
   * @type {{OK: string, API_ERROR: string, NOT_FOUND: string, NO_RESULTS: string}}
   */
  AbstractDirectionsService.Status = {
    OK: 'OK',
    API_ERROR: 'API_ERROR',
    NO_RESULTS: 'NO_RESULTS'
  };


  /**
   * A response object
   * used in resolving {DirectionsService} requests.
   *
   * @param {Object} responseObj Response object.
   *
   * @property {Array.<Array>} path
   * @property {number} distance
   * @property {Object} status
   * @property {AbstractDirectionsService.Status} status.code
   * @property {*|undefined} status.apiCode Status code returned by a directions service API
   * @property {string|undefined} message Status message.
   *
   * A rejections response will return an empty path array,
   * a distance of -1,
   * and error details within the status object.
   *
   * @constructor
   */
  AbstractDirectionsService.Response = function(responseObj) {
    return responseObj;
  };


  /**
   * Fetch path data between two waypoints.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} origin
   * @param {aeris.maps.gmaps.route.Waypoint} destination
   * @param {Object=} opt_options
   * @param {Boolean=} opt_options.followDirections
   *        Whether to follow map directions, or get a direct path between two points.
   *        Defaults to true.
   * @param {string=} opt_options.travelMode
   *        Travel mode to use when calculating directions.
   *        Not required if opt_options.followDirections is false.
   *        Note: get a list of supported travel modes with
   *        {DirectionsServiceInterface#getSupportedTravelModes}.
   *
   * @return {aeris.Promise}
   *          A promise to fetch directions.
   *          Resolves with {DirectionsService.Response}.
   */
  AbstractDirectionsService.prototype.fetchPath = function(origin, destination, opt_options) {
    var options = _.extend({
      followDirections: true,
      travelMode: 'DRIVING'
    }, opt_options);

    // Check that travel mode is supported
    if (options.followDirections && !this.supportsTravelMode(options.travelMode)) {
      throw new InvalidArgumentError('Cannot fetch directions: "' +
        options.travelMode + '" is not a supported travel mode.');
    }

    // Fetch directions, or get direct route
    if (options.followDirections) {
      return this.fetchDirectionsPath_(origin, destination, options);
    }
    else {
      return this.fetchDirectPath_(origin, destination, options);
    }
  };


  /**
   * Fetch path data between two waypoints,
   * following directions.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} origin
   * @param {aeris.maps.gmaps.route.Waypoint} destination
   * @param {Object} options
   * @param {string} options.travelMode
   *        Get a list of supported travel modes with
   *        {DirectionsServiceInterface#getSupportedTravelModes}.
   *
   * @return {aeris.Promise}
   *         A promise to fetch directions
   *         Resolves with {DirectionsService.Response}.
   *
   * @protected
   * @abstract
   */
  AbstractDirectionsService.prototype.fetchDirectionsPath_ = function(origin, destination, options) {
    throw new UnimplementedMethodError('fetchDirections_');
  };


  /**
   * Fetch path data between two waypoints,
   * following directions.
   *
   * @param {aeris.maps.gmaps.route.Waypoint} origin
   * @param {aeris.maps.gmaps.route.Waypoint} destination
   *
   * @return {aeris.Promise}
   *         A promise to fetch directions
   *         Resolves with {DirectionsService.Response}.
   *
   * @protected
   * @abstract
   */
  AbstractDirectionsService.prototype.fetchDirectPath_ = function(origin, destination) {
    throw new UnimplementedMethodError('fetchDirectPath_');
  };


  /**
   * Returns an array of travel modes supported
   * by the directions API.
   *
   * @return {Array.<string>}
   *
   * @abstract
   */
  AbstractDirectionsService.prototype.getSupportedTravelModes = function() {
    throw new UnimplementedMethodError('getSupportedTravelModes');
  };


  /**
   * Does the directions service support
   * the specified travel mode?
   *
   * @param {string} mode
   * @return {boolean}
   */
  AbstractDirectionsService.prototype.supportsTravelMode = function(mode) {
    return this.getSupportedTravelModes().indexOf(mode) >= 0;
  };

  return AbstractDirectionsService;
});

