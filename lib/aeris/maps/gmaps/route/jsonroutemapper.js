define(['aeris'], function(aeris) {

  /**
   * @fileoverview Mapper for importing and exporting a route to JSON string.
   */


  aeris.provide('aeris.maps.gmaps.route.JSONRouteMapper');


  /**
   * Create a new JSON Route Mapper.
   *
   * @constructor
   */
  aeris.maps.gmaps.route.JSONRouteMapper = function() {};


  /**
   * Export a Route to a JSON string.
   *
   * @param {aeris.maps.gmap.route.Route} route The route to export.
   * @return {string}
   */
  aeris.maps.gmaps.route.JSONRouteMapper.prototype.export = function(route) {
    return JSON.stringify(route);
  };


  return aeris.maps.gmaps.route.JSONRouteMapper;

});
