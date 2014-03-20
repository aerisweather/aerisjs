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
