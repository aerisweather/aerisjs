define([
  'aeris', 'base/map', 'gmaps/utils', 'gmaps/mapoptions', 'gmaps/layermanager',
  'gmaps/eventmanager', 'gmaps/markermanager'
], function(aeris) {

  /**
   * @fileoverview Aeris Maps' wrapper of Google Maps.
   */


  aeris.provide('aeris.maps.gmaps.Map');


  /**
   * Wraps Google Maps' map.
   *
   * @constructor
   * @extends {aeris.maps.Map}
   */
  aeris.maps.gmaps.Map = function(div, options) {
    aeris.maps.Map.call(this, div, options);
  };
  aeris.inherits(aeris.maps.gmaps.Map, aeris.maps.Map);


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.apiMapClass = google.maps.Map;


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.createMap = function(div) {
    if (typeof div == 'string') {
      div = document.getElementById(div);
    }

    google.maps.visualRefresh = true;
    return new this.apiMapClass(div);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.mapOptionsClass = aeris.maps.gmaps.MapOptions;


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.layerManagerClass = 
      aeris.maps.gmaps.LayerManager;


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.eventManagerClass =
      aeris.maps.gmaps.EventManager;


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.markerManagerClass =
      aeris.maps.gmaps.MarkerManager;


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.toLatLon = function(latLon) {
    return aeris.maps.gmaps.utils.arrayToLatLng(latLon);
  }


  /**
   * Get the panes for the Google Map.
   *
   * @return {Object}
   */
  aeris.maps.gmaps.Map.prototype.getPanes = function() {
    var panes = {};
    var nodes =
        this.map.getDiv().childNodes[0].childNodes[0].childNodes[0].childNodes;
    var length = nodes.length;
    for (var i = 0; i < length; i++) {
      var node = nodes[i];
      var zIndex = parseInt(node.style.zIndex);
      if (zIndex == 200) {
        panes.overlayLayer = node;
      } else if (zIndex == 100) {
        panes.mapPane = node;
      }
    };
    return panes;
  };


  /**
   * @override
   */
  aeris.maps.Map.prototype.initializedEvent = function(map, fn) {
    google.maps.event.addListenerOnce(map, 'tilesloaded', fn);
  };


  return aeris.maps.gmaps.Map;

});
