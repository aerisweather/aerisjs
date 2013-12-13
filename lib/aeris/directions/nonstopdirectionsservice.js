define([
  'aeris/util',
  'directions/helpers/googledistancecalculator',
  'aeris/promise',
  'directions/promise/promisetofetchdirections'
], function(_, GoogleDistanceCalculator, Promise, PromiseToFetchDirections) {
  /**
   * Provides a direct path from point A to point B,
   * without any stops or change in direction in between.
   * 
   * @class aeris.directions.NonstopDirectionsService
   * @implements aeris.directions.DirectionsServiceInterface
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_options
   * @param {aeris.directions.helpers.DistanceCalculatorInterface=} opt_options.distanceCalculator
   *        Defaults to aeris.directions.helpers.GoogleDistanceCalculator.
   * @param {Function=} opt_options.PromiseToFetchDirections
  */
  var NonstopDirectionsService = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      distanceCalculator: GoogleDistanceCalculator,
      PromiseToFetchDirections: PromiseToFetchDirections
    });


    /**
     * @type {aeris.directions.helpers.DistanceCalculatorInterface}}
     * @private
     */
    this.distanceCalculator_ = options.distanceCalculator;


    /**
     * Constructor for {aeris.directions.promise.PromiseToFetchDirections}
     * object.
     *
     * @type {Function}
     * @private
     * @default aeris.directions.promise.PromiseToFetchDirections
     */
    this.PromiseToFetchDirections_ = options.PromiseToFetchDirections;
  };


  /** @override */
  NonstopDirectionsService.prototype.fetchPath = function(origin, destination) {
    var path, distance;
    var promiseToFetchDirections = new this.PromiseToFetchDirections_();

    path = this.createDirectPathBetween_(origin, destination);

    // Try to get distance
    try {
      distance = this.distanceCalculator_.getDistanceBetween(origin, destination);
    }
    catch (e) {
      promiseToFetchDirections.rejectUsingErrorObject(e);
    }

    promiseToFetchDirections.resolveWithPathAndDistance(path, distance);

    return promiseToFetchDirections;
  };


  /**
   * @param {Array.<number>} origin
   * @param {Array.<number>} destination
   * @return {Array.<Array.<number>>}
   * @private
   */
  NonstopDirectionsService.prototype.createDirectPathBetween_ = function(origin, destination) {
    return [origin, destination];
  };
  
  
  return _.expose(NonstopDirectionsService, 'aeris.directions.NonstopDirectionsService');
});
