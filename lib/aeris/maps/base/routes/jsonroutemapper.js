define(['aeris/util'], function(_) {

  /**
   * @fileoverview Mapper for importing and exporting a route to JSON string.
   */


  _.provide('aeris.maps.gmaps.route.JSONRouteMapper');


  /**
   * Create a new JSON Route Mapper.
   *
   * @constructor
   * @class aeris.maps.gmaps.route.JSONRouteMapper
   */
  aeris.maps.gmaps.route.JSONRouteMapper = function() {};


  /**
   * Export a Route to a JSON string.
   *
   * @param {aeris.maps.gmaps.route.Route} route The route to export.
   * @return {string}
   */
  aeris.maps.gmaps.route.JSONRouteMapper.prototype.export = function(route) {
    return JSON.stringify(route);
  };


  return aeris.maps.gmaps.route.JSONRouteMapper;

});
