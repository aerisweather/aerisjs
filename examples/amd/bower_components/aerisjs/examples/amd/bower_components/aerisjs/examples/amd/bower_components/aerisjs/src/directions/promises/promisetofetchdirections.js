define([
  'aeris/util',
  'aeris/promise',
  'aeris/errors/invalidargumenterror',
  'aeris/directions/results/directionsresults',
  'aeris/directions/results/directionsresultsstatus'
], function(_, Promise, InvalidArgumentError, DirectionsResults, DirectionsResultsStatus) {
  /**
   * Resolves with a {aeris.directions.results.DirectionsResults}
   * object.
   *
   * @class PromiseToFetchDirections
   * @namespace aeris.directions.promise
   * @extends aeris.Promise
   *
   * @constructor
   * @override
  */
  var PromiseToFetchDirections = function() {
    Promise.apply(this, arguments);
  };
  _.inherits(PromiseToFetchDirections, Promise);


  /**
   * @param {aeris.maps.Path} path
   * @param {number} distance
   * @param {string} opt_apiCode
   * @method resolveWithPathAndDistance
   */
  PromiseToFetchDirections.prototype.resolveWithPathAndDistance = function(path, distance, opt_apiCode) {
    var results = this.createResults_({
      path: path,
      distance: distance,
      status: {
        code: this.getStatusCode_('OK'),
        apiCode: opt_apiCode,
        message: 'Successfully fetched directions.'
      }
    });

    this.resolve(results);
  };


  /**
   * @param {string} apiCode
   * @method rejectBecauseNoResults
   */
  PromiseToFetchDirections.prototype.rejectBecauseNoResults = function(apiCode) {
    var aerisCode = this.getStatusCode_('NO_RESULTS');
    var message = 'Unable to fetch directions: no results were returned';

    this.rejectWithStatus({
      code: aerisCode,
      apiCode: apiCode,
      message: message
    });
  };


  /**
   * @param {string} apiCode
   * @method rejectBecauseApiError
   */
  PromiseToFetchDirections.prototype.rejectBecauseApiError = function(apiCode) {
    var aerisCode = this.getStatusCode_('API_ERROR');
    var message = 'Unable to fetch directions: the API returned an error.';

    this.rejectWithStatus({
      code: aerisCode,
      apiCode: apiCode,
      message: message
    });
  };

  /**
   * @param {Error} error
   * @method rejectUsingErrorObject
   */
  PromiseToFetchDirections.prototype.rejectUsingErrorObject = function(error) {
    this.rejectWithStatus({
      code: this.getStatusCode_('API_ERROR'),
      message: error.message
    });
  };


  /**
   * @param {Object} status
   * @method rejectWithStatus
   */
  PromiseToFetchDirections.prototype.rejectWithStatus = function(status) {
    var results = this.createResults_({
      path: [],
      distance: null,
      status: status
    });

    this.reject(results);
  };


  /**
   * @param {string} statusCodeKey
   * @return {aeris.directions.results.DirectionsResultsStatus}
   * @private
   * @method getStatusCode_
   */
  PromiseToFetchDirections.prototype.getStatusCode_ = function(statusCodeKey) {
    var statusCode = DirectionsResultsStatus[statusCodeKey];

    if (!statusCode) {
      throw new InvalidArgumentError(statusCode + ' is not a valid DirectionsResultsStatus');
    }

    return statusCode;
  };


  /**
   * @param {Object} results
   * @return {aeris.directions.results.DirectionsResults}
   * @private
   * @method createResults_
   */
  PromiseToFetchDirections.prototype.createResults_ = function(results) {
    return new DirectionsResults(results);
  };


  return PromiseToFetchDirections;
});
