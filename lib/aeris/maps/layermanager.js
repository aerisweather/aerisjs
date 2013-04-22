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
     * The aeris map delegating the layer commands.
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


    this.set(options);

  };


  /**
   * A hash of layer strategies that are supported.
   *
   * @type {Object.<string,aeris.maps.LayerManagerStrategy>}
   */
  aeris.maps.LayerManager.prototype.strategies = {};


  /**
   * Set the base layer of the map.
   *
   * @param {aeris.maps.Layer} layer The base layer.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.setBaseLayer = function(layer) {
    var strategy = layer.strategy.select(this.strategies);
    if (strategy)
      strategy.setBaseLayer(this.map, layer);
  };


  /**
   * Set the values of an object of layer optiosn to the map.
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


  return aeris.maps.LayerManager;

});
