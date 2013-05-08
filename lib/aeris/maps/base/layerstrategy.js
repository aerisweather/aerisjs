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
   * @constructor
   */
  aeris.maps.LayerStrategy = function() {};


  /**
   * Create a new instance layer.
   *
   * @param {aeris.maps.Layer} layer
   * @return {Object}
   */
  aeris.maps.LayerStrategy.prototype.createInstanceLayer = aeris.notImplemented();


  /**
   * Register an instance layer with a map.
   *
   * @param {Object} instanceLayer
   * @param {Object} map
   */
  aeris.maps.LayerStrategy.prototype.registerInstanceLayer = aeris.notImplemented();


  /**
   * Set an instance layer as the base layer of a map.
   *
   * @param {Object} instanceLayer
   * @param {Object} map
   */
  aeris.maps.LayerStrategy.prototype.setBaseInstanceLayer = aeris.notImplemented();


  return aeris.maps.LayerStrategy;

});
