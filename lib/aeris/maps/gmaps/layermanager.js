define([
  'aeris', 'aeris/events',
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


    /**
     * The z-index events manager.
     *
     * @type {aeris.Events}
     * @private
     */
    this.zIndexEvents_ = new aeris.Events();

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
    instance.zIndexChangeCallback = this.zIndexChangeCallback_(layer);
    this.zIndexEvents_.on('change', instance.zIndexChangeCallback, this);
    this.zIndexEvents_.trigger('change');
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


  /**
   * Create a callback that resets a layer's zIndex.
   *
   * @param {aeris.maps.Layer} layer The layer to reset.
   * @return {Function}
   * @private
   */
  aeris.maps.LayerManager.prototype.zIndexChangeCallback_ = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    var fn = function() {
      strategy.setLayerZIndex(instance.div, layer.zIndex);
    }
    return fn;
  };


  return aeris.maps.gmaps.LayerManager;

});
