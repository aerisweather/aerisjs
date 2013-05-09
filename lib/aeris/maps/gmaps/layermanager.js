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
    'AerisInteractiveTile':
        aeris.maps.gmaps.layerstrategies.AerisInteractiveTile
  };


  /**
   * After setting the layer, locate it's dom container and cache it.
   *
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.setLayerCallback =
      function(layer, opt_time) {
    var instance = this.getInstanceLayer(layer);
    aeris.maps.LayerManager.prototype.setLayerCallback.
        call(this, layer, opt_time);
    instance.div = this.aerisMap.getPanes().mapPane.lastChild;
  };


  /**
   * @override
   */
  aeris.maps.LayerManager.prototype.showLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    strategy.showLayer(instance.div);
  };


  /**
   * @override
   */
  aeris.maps.LayerManager.prototype.hideLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    strategy.hideLayer(instance.div);
  };


  return aeris.maps.gmaps.LayerManager;

});
