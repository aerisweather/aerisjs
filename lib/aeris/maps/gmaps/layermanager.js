define([
  'aeris',
  'base/layermanager',
  './layerstrategies/googlemaptype',
  './layerstrategies/tile',
  './layerstrategies/aerisinteractivetile'
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
    'GoogleMapType': aeris.maps.gmaps.layerstrategies.GoogleMapType,
    'Tile': aeris.maps.gmaps.layerstrategies.Tile,
    'AerisInteractiveTile': aeris.maps.gmaps.layerstrategies.AerisInteractiveTile
  };


  return aeris.maps.gmaps.LayerManager;

});
