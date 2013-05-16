define([
  'aeris', 'aeris/events',
  'base/layermanager',
  './layerstrategies/googlemaptype',
  './layerstrategies/tile',
  './layerstrategies/aerisinteractivetile',
  './layerstrategies/kml',
  './layerstrategies/aerisweatherdetails'
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
        aeris.maps.gmaps.layerstrategies.AerisInteractiveTile,
    'KML': aeris.maps.gmaps.layerstrategies.KML,
    'AerisWeatherDetails':
        aeris.maps.gmaps.layerstrategies.AerisWeatherDetails
  };


  /**
   * After setting the layer, locate it's dom container and cache it.
   *
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.setLayerCallback =
      function(layer, opt_time) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    aeris.maps.LayerManager.prototype.setLayerCallback.
        call(this, layer, opt_time);
    instance.div = strategy.getDiv(this.aerisMap) || instance.div;
    if (instance.div) {
      instance.zIndexChangeCallback = this.zIndexChangeCallback_(layer);
      this.zIndexEvents_.on('change', instance.zIndexChangeCallback, this);
    }
    this.zIndexEvents_.trigger('change');
  };


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.showLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    strategy.showLayer(instance.div);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.hideLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    strategy.hideLayer(instance.div);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.setLayerOpacity =
      function(layer, opacity) {
    var div = layer.strategy.select({'KML': true});
    if (div) {
      var strategy = this.getStrategy(layer);
      var instance = this.getInstanceLayer(layer);
      strategy.setLayerOpacity(instance.div, opacity);
      layer.trigger('change:opacity', opacity);
    } else {
      aeris.maps.LayerManager.prototype.setLayerOpacity.call(
        this, layer, opacity);
    }
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
