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
   * @param {aeris.maps.Layer} layer The Aeris Layer to gather information.
   * @return {Object}
   */
  aeris.maps.LayerStrategy.prototype.createInstanceLayer =
      aeris.abstractMethod;


  /**
   * Register an instance layer with a map.
   *
   * @param {Object} instanceLayer The instance layer to register.
   * @param {Object} map The map to register the instance layer with.
   */
  aeris.maps.LayerStrategy.prototype.registerInstanceLayer =
      aeris.abstractMethod;


  /**
   * Set an instance layer as the base layer of a map.
   *
   * @param {Object} instanceLayer The instance layer to set as base.
   * @param {Object} map The map to apply the instance layer to.
   */
  aeris.maps.LayerStrategy.prototype.setBaseInstanceLayer =
      aeris.abstractMethod;


  /**
   * Add an instance layer to the map.
   *
   * @param {Object} instanceLayer The instance layer to add.
   * @param {Object} map The map to add the instance layer to.
   */
  aeris.maps.LayerStrategy.prototype.setInstanceLayer =
      aeris.abstractMethod;


  /**
   * Get the times for the layer and return as a promise.
   *
   * @param {aeris.maps.Layer} layer The Aeris Layer to gather information.
   * @return {aeris.Promise}
   */
  aeris.maps.LayerStrategy.prototype.getTimes = aeris.abstractMethod;


  /**
   * Show a layer.
   *
   * @param {Object} instanceLayer The instance layer to show.
   */
  aeris.maps.LayerStrategy.prototype.showLayer = aeris.abstractMethod;


  /**
   * Hide a layer.
   *
   * @param {Object} instanceLayer The instance layer to hide.
   */
  aeris.maps.LayerStrategy.prototype.hideLayer = aeris.abstractMethod;


  return aeris.maps.LayerStrategy;

});
