define([
  'aeris',
  'base/layermanager',
  './layerstrategies/osm',
  './layerstrategies/tile',
  './layerstrategies/aerisinteractivetile',
  './layerstrategies/googlemaptype',
  './layerstrategies/kml',
  './layerstrategies/infobox',
  './layerstrategies/aerispolygons'
],
function(aeris) {

  /**
   * @fileoverview OpenLayers Layer Manager
   */


  aeris.provide('aeris.maps.openlayers.LayerManager');


  /**
   * A layer manager for binding layers to an openlayers map object.
   *
   * @constructor
   * @extends {aeris.maps.LayerManager}
   */
  aeris.maps.openlayers.LayerManager = function(aerisMap, options) {
    aeris.maps.LayerManager.call(this, aerisMap, options);


    /**
     * The z-index events manager.
     *
     * @type {aeris.Events}
     * @private
     */
    this.zIndexEvents_ = new aeris.Events();

  };
  aeris.inherits(aeris.maps.openlayers.LayerManager, aeris.maps.LayerManager);


  /**
   * @override
   */
  aeris.maps.openlayers.LayerManager.prototype.strategies = {
    'OSM': aeris.maps.openlayers.layerstrategies.OSM,
    'Tile': aeris.maps.openlayers.layerstrategies.Tile,
    'AerisInteractiveTile':
        aeris.maps.openlayers.layerstrategies.AerisInteractiveTile,
    'GoogleMapType': aeris.maps.openlayers.layerstrategies.GoogleMapType,
    'KML': aeris.maps.openlayers.layerstrategies.KML,
    'InfoBox': aeris.maps.openlayers.layerstrategies.InfoBox,
    'AerisPolygons': aeris.maps.openlayers.layerstrategies.AerisPolygons
  };


  /**
   * After setting the layer, mange the z-index.
   *
   * @override
   */
  aeris.maps.openlayers.LayerManager.prototype.setLayerCallback =
      function(layer, opt_time) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    aeris.maps.LayerManager.prototype.setLayerCallback.
        call(this, layer, opt_time);
    instance.zIndexChangeCallback = this.zIndexChangeCallback_(layer);
    this.zIndexEvents_.on('change', instance.zIndexChangeCallback, this);
    instance.div = strategy.getDiv(this.aerisMap) || instance.div;
    this.zIndexEvents_.trigger('change');
  };


  /**
   * Create a callback that resets a layer's zIndex.
   *
   * @param {aeris.maps.Layer} layer The layer to reset.
   * @return {Function}
   * @private
   */
  aeris.maps.openlayers.LayerManager.prototype.zIndexChangeCallback_ =
      function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    var fn = function() {
      strategy.setLayerZIndex(instance.layer, layer.zIndex);
    }
    return fn;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.LayerManager.prototype.removeLayer = function(layer, opt_options) {
    var options = opt_options || {};
    options.trigger = options.trigger === undefined ? true : options.trigger;
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    aeris.maps.LayerManager.prototype.removeLayer.call(this, layer, aeris.extend({
      trigger: false
    }, options));
    this.zIndexEvents_.off('change', instance.zIndexChangeCallback, this);
    this.zIndexEvents_.trigger('change');
    if (!!options.trigger)
      layer.trigger('remove');
  };


  return aeris.maps.openlayers.LayerManager;

});
