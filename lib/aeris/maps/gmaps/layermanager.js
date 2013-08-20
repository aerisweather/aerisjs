define([
  'aeris/util', 'aeris/events',
  'base/layermanager',
  './layerstrategies/googlemaptype',
  './layerstrategies/tile',
  './layerstrategies/aerisinteractivetile',
  './layerstrategies/kml',
  './layerstrategies/infobox',
  './layerstrategies/aerispolygons'
],
function(_) {

  /**
   * @fileoverview Google Maps Layer Manager
   */


  _.provide('aeris.maps.gmaps.LayerManager');


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
  _.inherits(aeris.maps.gmaps.LayerManager, aeris.maps.LayerManager);


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.strategies = {
    'GoogleMapType': aeris.maps.gmaps.layerstrategies.GoogleMapType,
    'Tile': aeris.maps.gmaps.layerstrategies.Tile,
    'AerisInteractiveTile':
        aeris.maps.gmaps.layerstrategies.AerisInteractiveTile,
    'KML': aeris.maps.gmaps.layerstrategies.KML,
    'InfoBox': aeris.maps.gmaps.layerstrategies.InfoBox,
    'AerisPolygons': aeris.maps.gmaps.layerstrategies.AerisPolygons
  };


  /**
   * After setting the layer, locate it's dom container and cache it.
   *
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.setLayerCallback =
      function(layer, opt_time) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
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
  aeris.maps.gmaps.LayerManager.prototype.removeLayer = function(layer, opt_options) {
    var options = opt_options || {};
    options.trigger = options.trigger === undefined ? true : options.trigger;
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    aeris.maps.LayerManager.prototype.removeLayer.call(this, layer, _.extend({
      trigger: false
    }));
    this.zIndexEvents_.off('change', instance.zIndexChangeCallback, this);
    this.zIndexEvents_.trigger('change');
    if (!!options.trigger)
      layer.trigger('remove');
  };


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.showLayer =
      function(layer, trigger) {
    trigger = typeof trigger == 'undefined' ? true : trigger;
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    if (instance.div) {
      strategy.showLayer(instance.div);
      if (trigger)
        layer.trigger('change:visible', true);
    } else {
      aeris.maps.LayerManager.prototype.showLayer.call(this, layer, trigger);
    }
  };


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.hideLayer =
      function(layer, trigger) {
    trigger = typeof trigger == 'undefined' ? true : trigger;
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    if (instance.div) {
      strategy.hideLayer(instance.div);
      if (trigger)
        layer.trigger('change:visible', false);
    } else {
      aeris.maps.LayerManager.prototype.hideLayer.call(this, layer, trigger);
    }
  };


  /**
   * @override
   */
  aeris.maps.gmaps.LayerManager.prototype.setLayerOpacity =
      function(layer, opacity) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    var kml = layer.strategy.select({'KML': true});
    var polygons = layer.strategy.select({'AerisPolygons': true});
    if (kml) {
      strategy.setLayerOpacity(instance.div, opacity);
      layer.trigger('change:opacity', opacity);
    } else if (polygons) {
      strategy.setLayerOpacity(instance.layer, opacity, layer);
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
  aeris.maps.gmaps.LayerManager.prototype.zIndexChangeCallback_ =
      function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    var fn = function() {
      strategy.setLayerZIndex(instance.div, layer.zIndex);
    }
    return fn;
  };


  return aeris.maps.gmaps.LayerManager;

});
