define(['aeris'], function(aeris) {

  /**
   * @fileoverview Interface definition for defining a layer strategy.
   */


  aeris.provide('aeris.maps.LayerStrategy');


  /**
   * A layer strategy is used by a layer manager to delegate the
   * rendering of a specific type of layer for a specific implementation of a
   * js map library.
   * 
   * @param {aeris.maps.Map} aerisMap The aeris map to bind to and delegate
   *                                  specified layer strategy requests to.
   * @param {aeris.maps.Layer} layer The layer commands should be applied to.
   * @param {Object} data Object to store additional layer information for
   *                      layer management purposes.
   * @constructor
   */
  aeris.maps.LayerStrategy = function(aerisMap, layer, data) {


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
     * The layer commands should be applied to.
     *
     * @type {aeris.maps.Layer}
     */
    this.layer = layer;


    /**
     * A private storage for additional layer data.
     *
     * @type {Object}
     * @private
     */
    this.data_ = data;

  };


  /**
   * Set the base layer of a map.
   *
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setBaseLayer =
      aeris.notImplemented();


  /**
   * Apply a layer on top of a map.
   *
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setLayer = aeris.notImplemented();


  /**
   * Make a specific layer visible on the map.
   *
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.showLayer = aeris.notImplemented();


  /**
   * Make a specific layer hidden on the map.
   *
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.hideLayer = aeris.notImplemented();


  /**
   * Set the opacity of a layer.
   *
   * @param {number} opacity The opacity to set the layer to.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setLayerOpacity =
      aeris.notImplemented();


  /**
   * Animate the layer.
   *
   * @return {aeris.maps.Animation}
   */
  aeris.maps.LayerStrategy.prototype.animate = aeris.notImplemented();


  /**
   * Get additional information for a layer.
   *
   * @param {string} key The key of the information you want to retrieve.
   * @return {?} The stored value.
   */
  aeris.maps.LayerStrategy.prototype.getData = function(key) {
    var data = this.data_[key];
    return data;
  };


  /**
   * Store additional information for a layer.
   *
   * @param {string} key The key of the information you want to store.
   * @param {*} value The value of the information to store.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setData = function(key, value) {
    this.data_[key] = value;
  };


  return aeris.maps.LayerStrategy;

});
