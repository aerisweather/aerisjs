/**
 * @fileoverview Defines a mock google.maps.DirectionsResult object.
*/
define([
  'testUtils',
  'gmaps/utils',
  'vendor/underscore',
  'googlemaps'
], function(testUtils, mapUtils, _) {
  /**
   * Mock of google.maps.DirectionsResult
   *
   * @param {Object=} opt_options
   * @param {Array<Array>=} opt_options.path
   * @param {Number=} opt_options.distance
   * @param {string=} opt_options.textDistance
   * @returns {Object} see https://developers.google.com/maps/documentation/javascript/reference#DirectionsResult
   * @constructor
   */
  var DirectionsResult = function(opt_options) {
    opt_options || (opt_options = {});

    return {
      routes: [
        {
          overview_path: mapUtils.pathToLatLng(opt_options.path) || [

          ],
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

