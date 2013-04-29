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
     * Private storage for layer data.
     *
     * @type {Object}
     * @private
     */
    this.layerData_ = {};


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
    if (strategy)
      strategy.setBaseLayer();
  };


  /**
   * Apply a layer to the map.
   *
   * @param {aeris.maps.Layer} layer The layer to apply.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.setLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    if (strategy)
      strategy.setLayer();
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
    if (strategy)
      strategy.showLayer();
  };


  /**
   * Make a specific layer hidden on the map.
   *
   * @param {aeris.maps.Layer} layer The layer to hide.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.hideLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    if (strategy)
      strategy.hideLayer();
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
            new this.strategies[strategyKey](this.aerisMap, layer,
                                             this.getLayerData(layer));
      strategy = this.strategies_[instanceKey];
    }
    return strategy;
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
    opacity = parseFloat(opacity);
    var strategy = this.getStrategy(layer);
    if (strategy)
      strategy.setLayerOpacity(opacity);
  };


  /**
   * Animate a specified layer.
   *
   * @param {aeris.maps.Layer} layer The layer to animate.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.animateLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    if (strategy)
      strategy.animate();
  };


  /**
   * Get the additional data storage for a specified layer.
   *
   * @param {aeris.maps.Layer} layer The layer to get the additional storage.
   * @return {Object}
   */
  aeris.maps.LayerManager.prototype.getLayerData = function(layer) {
    var data = this.layerData_[layer.name];
    if (!data)
      this.layerData_[layer.name] = {};
    return this.layerData_[layer.name];
  };


  return aeris.maps.LayerManager;

});
