define(['aeris'], function(aeris) {

  /**
   * @fileoverview Interface definition for defining a layer manager strategy.
   */


  aeris.provide('aeris.maps.LayerManagerStrategy');


  /**
   * A layer manager strategy is used by a layer manager to delegate the
   * rendering of a specific type of layer for a specific implementation of a
   * js map library.
   * 
   * @param {aeris.maps.Map} aerisMap The aeris map to bind to and delegate
   *                                  specified layer strategy requests to.
   * @constructor
   */
  aeris.maps.LayerManagerStrategy = function(aerisMap) {


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

  };


  /**
   * Set the base layer of a map.
   *
   * @param {aeris.maps.Layer} layer An abstract layer to parse and apply to
   *                                 the map.
   * @return {undefined}
   */
  aeris.maps.LayerManagerStrategy.prototype.setBaseLayer =
      aeris.notImplemented();


  /**
   * Apply a layer on top of a map.
   *
   * @param {aeris.maps.Layer} layer An abstract layer to parse and apply to
   *                                 the map.
   * @return {undefined}
   */
  aeris.maps.LayerManagerStrategy.prototype.setLayer = aeris.notImplemented();


  return aeris.maps.LayerManagerStrategy;

});
