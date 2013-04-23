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
   * @const
   */
  aeris.maps.LayerManagerStrategy = {};


  /**
   * Set the base layer of a map.
   *
   * @param {Object} map An instance of a js map library's map object.
   * @param {aeris.maps.Layer} layer An abstract layer to parse and apply to
   *                                 the map.
   * @return {undefined}
   */
  aeris.maps.LayerManagerStrategy.setBaseLayer = aeris.notImplemented();


  /**
   * Apply a layer on top of a map.
   *
   * @param {Object} map An instance of the js map library's map object.
   * @param {aeris.maps.Layer} layer An abstract layer to parse and apply to
   *                                 the map.
   * @return {undefined}
   */
  aeris.maps.LayerManagerStrategy.setLayer = aeris.notImplemented();


  return aeris.maps.LayerManagerStrategy;

});
