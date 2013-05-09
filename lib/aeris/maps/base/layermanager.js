define(['aeris'], function(aeris) {

  /**
   * @fileoverview Interface definition for managing map layers.
   */


  aeris.provide('aeris.maps.LayerManager');


  /**
   * Creates a layer manager that binds to an aeris map which is delegating
   * layer commands.
   *
   * @param {aeris.maps.Map} aerisMap The aeris map to bind to and delegate
   *                                  layer requests to.
   * @param {Object} options An object of map layer options to be applied to
   *                         the map.
   * @constructor
   */
  aeris.maps.LayerManager = function(aerisMap, options) {


    /**
     * The aeris map to delegate layer commands to.
     *
     * @type {aeris.map.Map}
     */
    this.aerisMap = aerisMap;


    /**
     * The actual map which to apply the layers to.
     *
     * @type {Object}
     */
    this.map = aerisMap.map;


    /**
     * A hash of instantiated layer strategies.
     *
     * @type {Object.<string,aeris.maps.LayerManagerStrategy>}
     * @private
     */
    this.strategies_ = {};


    /**
     * A hash of instantiated instance layers.
     *
     * @type {Object<string,Object}
     * @private
     */
    this.instanceLayers_ = {};


    this.set(options);

  };


  /**
   * A hash of layer strategies that are supported.
   *
   * @type {Object.<string,Function>}
   */
  aeris.maps.LayerManager.prototype.strategies = {};


  /**
   * Set the base layer of the map.
   *
   * @param {aeris.maps.Layer} layer The base layer.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.setBaseLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    if (!instance.layer) {
      instance.layer = strategy.createInstanceLayer(layer);
      strategy.registerInstanceLayer(instance.layer, this.map);
    }
    strategy.setBaseInstanceLayer(instance.layer, this.map);
  };


  /**
   * Apply a layer to the map.
   *
   * @param {aeris.maps.Layer} layer The layer to apply.
   */
  aeris.maps.LayerManager.prototype.setLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    var timesPromise = strategy.getTimes(layer);
    if (timesPromise) {
      var self = this;
      timesPromise.done(function(times) {
        layer.time = times[0];
        self.setLayerCallback(layer, layer.time);
      });
    } else {
      this.setLayerCallback(layer);
    }
  };


  /**
   * Helper for applying a layer to the map with an optional timestamp.
   *
   * @param {aeris.maps.Layer} layer The layer to apply.
   * @param {string=} opt_time An optional timestamp of the layer.
   * @protected
   */
  aeris.maps.LayerManager.prototype.setLayerCallback = function(layer, opt_time) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    if (!instance.layer) {
      instance.layer = strategy.createInstanceLayer(layer, opt_time);
      strategy.registerInstanceLayer(instance.layer, this.map);
    }
    strategy.setInstanceLayer(instance.layer, this.map);
  };


  /**
   * Set the values of an object of layer options to the map.
   *
   * @param {Object} options An object of map layer options to be applied to
   *                         the map.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.set = function(options) {
    for (var opt in options) {
      var method = 'set' + aeris.ucfirst(opt);
      if (this[method])
        this[method](options[opt]);
    }
  };


  /**
   * Make a specific layer visible on the map.
   *
   * @param {aeris.maps.Layer} layer The layer to make visible.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.showLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    strategy.showLayer(instance.layer);
  };


  /**
   * Make a specific layer hidden on the map.
   *
   * @param {aeris.maps.Layer} layer The layer to hide.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.hideLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    strategy.hideLayer(instance.layer);
  };


  /**
   * Get an implemented strategy.
   *
   * @param {aeris.maps.Layer} layer The layer to get the strategy for.
   * @return {aeris.maps.LayerStrategy}
   */
  aeris.maps.LayerManager.prototype.getStrategy = function(layer) {
    var strategyKey = layer.strategy.select(this.strategies);
    var instanceKey = strategyKey + '_' + layer.name
    var strategy = null;
    if (this.strategies[strategyKey]) {
      if (!this.strategies_[instanceKey])
        this.strategies_[instanceKey] =
            new this.strategies[strategyKey]();
      strategy = this.strategies_[instanceKey];
    }
    return strategy;
  };


  /**
   * Get an implemented instance layer.
   *
   * @param {aeris.maps.Layer} layer The layer to get the instance layer for.
   * @return {Object}
   */
  aeris.maps.LayerManager.prototype.getInstanceLayer = function(layer) {
    var instance = this.instanceLayers_[layer.name];
    if (!instance) {
      instance = this.instanceLayers_[layer.name] = {};
    }
    return instance;
  };


  /**
   * Set the opacity of a layer.
   *
   * @param {aeris.map.Layer} layer The layer to set the opacity of.
   * @param {number} opacity The opacity to set the layer to.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.setLayerOpacity =
      function(layer, opacity) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstanceLayer(layer);
    strategy.setLayerOpacity(instance.layer, opacity);
  };


  /**
   * Animate a specified layer.
   *
   * @param {aeris.maps.Layer} layer The layer to animate.
   * @return {aeris.maps.Animation}
   */
  aeris.maps.LayerManager.prototype.animateLayer = function(layer) {
    var animation = null;
    var strategy = this.getStrategy(layer);
    if (strategy)
      animation = strategy.animate();
    return animation;
  };


  /**
   * Auto-update a specified layer.
   *
   * @param {aeris.maps.Layer} layer The Layer to auto-update.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.autoUpdateLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    if (strategy)
      strategy.autoUpdate();
  };


  return aeris.maps.LayerManager;

});
