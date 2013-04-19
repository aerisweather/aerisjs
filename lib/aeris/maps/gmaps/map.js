define(['aeris', 'base/map', './mapoptions', './layermanager'],
function(aeris) {

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
  aeris.maps.gmaps.Map.prototype.toLatLon = function(latLon) {
    if (latLon instanceof Array) {
      latLon = new google.maps.LatLng(latLon[0], latLon[1]);
    }
    return latLon;
  }


  return aeris.maps.gmaps.Map;

});
