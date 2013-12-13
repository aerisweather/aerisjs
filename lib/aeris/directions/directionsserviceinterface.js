defined(function() {
  /**
   * Provides directions between points.
   *
   * @class aeris.directions.DirectionsServiceInterface
   * @constructor
   *
   * @interface
   */
  var DirectionsServiceInterface = function() {
  };


  /**
   * Fetch directions data between two latLon coordinates.
   *
   * @param {Array.<number>} origin
   * @param {Array.<number>} destination
   * @param {Object=} opt_options
   *
   * @return {aeris.directions.promise.PromiseToFetchDirections}
   */
  DirectionsServiceInterface.prototype.fetchPath = function(origin, destination) {};


  return DirectionsServiceInterface;
});