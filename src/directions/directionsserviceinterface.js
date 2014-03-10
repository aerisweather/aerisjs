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
   * @param {aeris.maps.LatLng} origin
   * @param {aeris.maps.LatLng} destination
   * @param {Object=} opt_options
   *
   * @return {aeris.directions.promises.PromiseToFetchDirections}
   * @method fetchPath
   */
  DirectionsServiceInterface.prototype.fetchPath = function(origin, destination) {};


  return DirectionsServiceInterface;
});