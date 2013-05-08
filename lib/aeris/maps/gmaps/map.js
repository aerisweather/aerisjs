define(['aeris', 'base/map', './mapoptions', './layermanager', 'aeris/promise'],
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


    /**
     */
    this.initialized = new aeris.Promise();


    this.registerEvents(this.map);

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


  /**
   * @override
   */
  aeris.maps.gmaps.Map.prototype.registerEvents = function(map) {
    var initialized = this.initialized;
    google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
      initialized.resolve();
    });
  };


  return aeris.maps.gmaps.Map;

});
