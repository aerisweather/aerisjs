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
   * @constructor
   */
  aeris.maps.LayerStrategy = function(aerisMap) {


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
     * A private storage for additional layer data.
     *
     * @type {Object}
     * @private
     */
    this.layerData_ = {};

  };


  /**
   * Set the base layer of a map.
   *
   * @param {aeris.maps.Layer} layer An abstract layer to parse and apply to
   *                                 the map.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setBaseLayer =
      aeris.notImplemented();


  /**
   * Apply a layer on top of a map.
   *
   * @param {aeris.maps.Layer} layer An abstract layer to parse and apply to
   *                                 the map.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setLayer = aeris.notImplemented();


  /**
   * Make a specific layer visible on the map.
   *
   * @param {aeris.maps.Layer} layer The layer to make visible.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.showLayer = aeris.notImplemented();


  /**
   * Make a specific layer hidden on the map.
   *
   * @param {aeris.maps.Layer} layer The layer to hide.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.hideLayer = aeris.notImplemented();


  /**
   * Set the opacity of a layer.
   *
   * @param {aeris.maps.Layer} layer The layer to set the opacity of.
   * @param {number} opacity The opacity to set the layer to.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setLayerOpacity =
      aeris.notImplemented();


  /**
   * Get additional information for a layer.
   *
   * @param {aeris.maps.Layer} aerisLayer The layer to retrieve data for.
   * @param {string} key The key of the information you want to retrieve.
   * @return {?} The stored value.
   */
  aeris.maps.LayerStrategy.prototype.getLayerData =
      function(aerisLayer, key) {
    var data = this.layerData_[aerisLayer.name];
    if (data)
      data = data[key];
    return data;
  };


  /**
   * Store additional information for a layer.
   *
   * @param {aeris.maps.Layer} aerisLayer The layer to store data for.
   * @param {string} key The key of the information you want to store.
   * @param {*} value The value of the information to store.
   * @return {undefined}
   */
  aeris.maps.LayerStrategy.prototype.setLayerData =
      function(aerisLayer, key, value) {
    var data = this.layerData_[aerisLayer.name];
    if (!data)
      this.layerData_[aerisLayer.name] = {};
    this.layerData_[aerisLayer.name][key] = value;
  };


  return aeris.maps.LayerStrategy;

});
