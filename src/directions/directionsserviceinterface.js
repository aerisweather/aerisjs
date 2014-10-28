define(function() {
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
   * @param {aeris.maps.LatLon} origin
   * @param {aeris.maps.LatLon} destination
   * @param {Object=} opt_options
   *
   * @return {aeris.directions.promises.PromiseToFetchDirections}
   * @method fetchPath
   */
  DirectionsServiceInterface.prototype.fetchPath = function(origin, destination) {};


  return DirectionsServiceInterface;
});
