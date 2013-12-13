define(function() {
  /**
   * Calculates the distance between two points.
   * 
   * @class aeris.directions.helpers.DistanceCalculatorInterface
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
   */
  DistanceCalculatorInterface.getDistanceBetween = function(latLonA, latLonB) {};
  
  
  return DistanceCalculatorInterface;
});
