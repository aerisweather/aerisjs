define(function() {
  /**
   * Calculates the distance between two points.
   *
   * @class DistanceCalculatorInterface
   * @namespace aeris.directions.helpers
   * @static
   * @interface
   *
   * @constructor
   */
  var DistanceCalculatorInterface = function() {};


  /**
   * @static
   *
   * @param {aeris.maps.LatLon} latLonA
   * @param {aeris.maps.LatLon} latLonB
   *
   * @return {number} Distance in meters between the two latLons.
   * @method getDistanceBetween
   */
  DistanceCalculatorInterface.getDistanceBetween = function(latLonA, latLonB) {};


  return DistanceCalculatorInterface;
});
