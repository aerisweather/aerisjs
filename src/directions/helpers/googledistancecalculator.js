define([
  'aeris/util',
  'googlemaps!',
  'aeris/directions/errors/serviceunavailableerror',
  'aeris/maps/strategy/utils'
], function(_, gmaps, ServiceUnavailableError, mapUtil) {
  /**
   * Calculates distances between points
   * using the google geometry library
   *
   * @class GoogleDistanceCalculator
   * @namespace aeris.directions.helpers
   * @implements aeris.directions.helpers.DistanceCalculatorInterface
   * @static
   *
   * @constructor
   * @override
  */
  var GoogleDistanceCalculator = function() {};


  /**
   * @override
   *
   * @throws {aeris.directions.errors.ServiceUnavailableError}
   * @method getDistanceBetween
   */
  GoogleDistanceCalculator.getDistanceBetween = function(latLonA, latLonB) {
    var distance;

    try {
      distance = this.calculateDistanceBetween_(latLonA, latLonB);
    }
    catch (e) {
      throw new ServiceUnavailableError('Unable to calculate distance between ' +
        latLonA + ' and ' + latLonB + ': ' + e.message);
    }

    return distance;
  };


  /**
   * @private
   * @static
   *
   * @param {aeris.maps.LatLon} latLonA
   * @param {aeris.maps.LatLon} latLonB
   * @return {number}
   * @method calculateDistanceBetween_
   */
  GoogleDistanceCalculator.calculateDistanceBetween_ = function(latLonA, latLonB) {
    var googleCalculator = GoogleDistanceCalculator.getCalculator_();
    var gLatLngA = mapUtil.arrayToLatLng(latLonA);
    var gLatLngB = mapUtil.arrayToLatLng(latLonB);

    return googleCalculator(gLatLngA, gLatLngB);
  };


  /**
   * @private
   * @static
   *
   * @throws {aeris.directions.errors.ServiceUnavailableError}
   * @return {Function}
   * @method getCalculator_
   */
  GoogleDistanceCalculator.getCalculator_ = function() {
    var calculator;

    try {
      calculator = gmaps.geometry.spherical.computeDistanceBetween;
    }
    catch (e) {
      if (e instanceof ReferenceError) {
        throw new ServiceUnavailableError('Google geometry library cannot be found. ' +
          'Make sure you have embedded the library in your application. For more' +
          'information, see https://developers.google.com/maps/documentation/javascript/libraries.');
      }
      else { throw e; }
    }

    return calculator;
  };


  return _.expose(GoogleDistanceCalculator, 'aeris.directions.helpers.GoogleDistanceCalculator');
});
