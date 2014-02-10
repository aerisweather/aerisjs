define(function() {
  /**
   * Provides directions between points.
   *
   * @class DirectionsServiceInterface
   * @namespace aeris.directions
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
   * @method fetchPath
   */
  DirectionsServiceInterface.prototype.fetchPath = function(origin, destination) {};


  return DirectionsServiceInterface;
});