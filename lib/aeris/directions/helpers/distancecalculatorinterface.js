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
   * @param {Array.<number>} latLonA
   * @param {Array.<number>} latLonB
   *
   * @return {number} Distance in meters between the two latLons.
   * @method getDistanceBetween
   */
  DistanceCalculatorInterface.getDistanceBetween = function(latLonA, latLonB) {};
  
  
  return DistanceCalculatorInterface;
});
