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
    var waypoints = route.getWaypoints();
    var exportedWaypoints = [];
    for (var i = 0, length = waypoints.length; i < length; i++) {
      var exportedWaypoint = this.exportWaypoint_(waypoints[i]);
      exportedWaypoints.push(exportedWaypoint);
    }

    var object = {
      distance: route.distance,
      waypoints: exportedWaypoints
    };
    var string = JSON.stringify(object);
    return string;
  };


  /**
   * Export a Waypoint to a JSON object.
   *
   * @param {aeris.maps.gmap.route.Waypoint} waypoint The waypoint to export.
   * @return {string}
   */
  aeris.maps.gmaps.route.JSONRouteMapper.prototype.exportWaypoint_ =
      function(waypoint) {
    var path = waypoint.path;
    if (path && path[0] instanceof google.maps.LatLng) {
      for (var i = 0, length = path.length; i < length; i++) {
        var latLon = path[i];
        path[i] = [latLon.lat(), latLon.lng()];
      }
    }
    var object = {
      originalLatLon: waypoint.originalLatLon,
      geocodedLatLon: waypoint.geocodedLatLon,
      followPaths: waypoint.followPaths,
      travelMode: waypoint.travelMode,
      path: waypoint.path,
      previous: waypoint.previous,
      distance: waypoint.distance
    };
    return object;
  };


  return aeris.maps.gmaps.route.JSONRouteMapper;

});
