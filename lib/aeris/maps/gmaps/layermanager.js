define([
  'aeris',
  'base/layermanager',
  './layermanager/googlemaptype',
  './layermanager/tile',
  './layermanager/aerisinteractivetile'
],
function(aeris) {

  /**
   * @fileoverview Google Maps Layer Manager
   */


  aeris.provide('aeris.maps.gmaps.LayerManager');


  /**
   * A layer manager for binding layers to a google maps object.
   *
   * @constructor
   * @extends {aeris.maps.LayerManager}
   */
  aeris.maps.gmaps.LayerManager = function(aerisMap, options) {
    aeris.maps.LayerManager.call(this, aerisMap, options);
  };
  aeris.inherits(aeris.maps.gmaps.LayerManager, aeris.maps.LayerManager);


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.strategies = {
    'GoogleMapType': aeris.maps.gmaps.layermanager.GoogleMapType,
    'Tile': aeris.maps.gmaps.layermanager.Tile,
    'AerisInteractiveTile': aeris.maps.gmaps.layermanager.AerisInteractiveTile
  };


  return aeris.maps.gmaps.LayerManager;

});
