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
   * Unregister an instance layer with a map.
   *
   * @param {Object} instanceLayer The instance layer to unregister.
   * @param {Object} map The amp to unregister the instance layer from.
   */
  aeris.maps.LayerStrategy.prototype.unregisterInstanceLayer =
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
   * Remove an instance layer from the map.
   *
   * @param {Object} instanceLayer The instance layer to remove.
   * @param {Object} map The map to remove the instance layer from.
   */
  aeris.maps.LayerStrategy.prototype.removeInstanceLayer =
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


  /**
   * Set the opacity of a layer.
   *
   * @param {Object} instanceLayer The instance layer to set the opacity of.
   * @param {number} opacity The opacity to set (0 to 1.0).
   */
  aeris.maps.LayerStrategy.prototype.setLayerOpacity = aeris.abstractMethod;


  /**
   * Create an animation object for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to animate.
   * @return {aeris.maps.Animation}
   */
  aeris.maps.LayerStrategy.prototype.createAnimation = aeris.abstractMethod;


  /**
   * Auto-update a layer.
   *
   * @param {aeris.maps.Layer} layer The layer to auto-update.
   */
  aeris.maps.LayerStrategy.prototype.autoUpdate = aeris.abstractMethod;


  /**
   * Set the z-index of a layer.
   *
   * @param {Object} instanceLayer The instance layer to set the z-index of.
   * @param {number} zIndex The z-index to set.
   */
  aeris.maps.LayerStrategy.prototype.setLayerZIndex = aeris.abstractMethod;


  /**
   * Determine when a layer has initialized.
   *
   * @param {aeris.maps.Layer} layer The layer to initialize.
   * @param {Object} instanceLayer The instance layer to determine when init.
   */
  aeris.maps.LayerStrategy.prototype.initializeLayer =
      aeris.abstractMethod;


  return aeris.maps.LayerStrategy;

});
