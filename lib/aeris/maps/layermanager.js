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
    var strategyKey = layer.strategy.select(this.strategies);
    var strategy = this.getStrategy(strategyKey);
    if (strategy)
      strategy.setBaseLayer(layer);
  };


  /**
   * Apply a layer to the map.
   *
   * @param {aeris.maps.Layer} layer The layer to apply.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.setLayer = function(layer) {
    var strategyKey = layer.strategy.select(this.strategies);
    var strategy = this.getStrategy(strategyKey);
    if (strategy)
      strategy.setLayer(layer);
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
    var strategyKey = layer.strategy.select(this.strategies);
    var strategy = this.getStrategy(strategyKey);
    if (strategy)
      strategy.showLayer(layer);
  };


  /**
   * Make a specific layer hidden on the map.
   *
   * @param {aeris.maps.Layer} layer The layer to hide.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.hideLayer = function(layer) {
    var strategyKey = layer.strategy.select(this.strategies);
    var strategy = this.getStrategy(strategyKey);
    if (strategy)
      strategy.hideLayer(layer);
  };


  /**
   * Get an implemented strategy.
   *
   * @param {string} strategyKey The strategy hash key that indexes to a
   *                             strategy constructor.
   * @return {aeris.maps.LayerManagerStrategy}
   */
  aeris.maps.LayerManager.prototype.getStrategy = function(strategyKey) {
    var strategy = null;
    if (this.strategies[strategyKey]) {
      if (!this.strategies_[strategyKey])
        this.strategies_[strategyKey] =
            new this.strategies[strategyKey](this.aerisMap);
      strategy = this.strategies_[strategyKey];
    }
    return strategy;
  };


  return aeris.maps.LayerManager;

});
