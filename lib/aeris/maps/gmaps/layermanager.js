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


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.setLayerCallback = function(layer) {
    var self = this;
    var instance = this.getInstanceLayer(layer);
    this.aerisMap.initialized.done(function() {
      aeris.maps.LayerManager.prototype.setLayerCallback.call(self, layer);
    });
  };


  return aeris.maps.gmaps.LayerManager;

});
