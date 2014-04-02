/**
 * @fileoverview Defines a mock google.maps.DirectionsResult object.
*/
define([
  'testUtils',
  'aeris/maps/strategy/utils',
  'aeris/util',
  'googlemaps!'
], function(testUtils, mapUtils, _) {
  /**
   * Mock of google.maps.DirectionsResult
   *
   * @param {Object=} opt_options
   * @param {Array<Array>=} opt_options.path
   * @param {Number=} opt_options.distance
   * @param {string=} opt_options.textDistance
   * @return {Object} see https://developers.google.com/maps/documentation/javascript/reference#DirectionsResult
   * @constructor
   */
  var DirectionsResult = function(opt_options) {
    opt_options || (opt_options = {});

    return {
      routes: [
        {
          overview_path: opt_options.path ?
              mapUtils.pathToLatLng(opt_options.path) :
              mapUtils.pathToLatLng([
                testUtils.getRandomLatLon(),
                testUtils.getRandomLatLon(),
                testUtils.getRandomLatLon()
              ]),
          legs: [
            {
              distance: {
                text: opt_options.textDistance || '6.21 miles',
                value: opt_options.distance || 10000
              }
            }
          ]
        }
      ]
    };
  };

  return DirectionsResult;
});

