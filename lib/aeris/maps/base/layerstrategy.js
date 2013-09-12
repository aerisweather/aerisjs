define(['aeris/util', 'base/extension/mapextensionstrategy'], function(_) {

  /**
   * @fileoverview Interface definition for defining a layer strategy.
   */


  _.provide('aeris.maps.LayerStrategy');


  /**
   * A layer strategy is used by a layer manager to delegate the
   * rendering of a specific type of layer for a specific implementation of a
   * js map library.
   * 
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionStrategy}
   */
  aeris.maps.LayerStrategy = function() {};
  _.inherits(aeris.maps.LayerStrategy,
                 aeris.maps.extension.MapExtensionStrategy);


  /**
   * Create a new instance layer.
   *
   * @param {aeris.maps.Layer} layer The Aeris Layer to gather information.
   * @return {Object}
   */
  aeris.maps.LayerStrategy.prototype.createInstanceLayer =
      _.abstractMethod;


  /**
   * Register an instance layer with a map.
   *
   * @param {Object} instanceLayer The instance layer to register.
   * @param {Object} map The map to register the instance layer with.
   */
  aeris.maps.LayerStrategy.prototype.registerInstanceLayer =
      _.abstractMethod;


  /**
   * Unregister an instance layer with a map.
   *
   * @param {Object} instanceLayer The instance layer to unregister.
   * @param {Object} map The amp to unregister the instance layer from.
   */
  aeris.maps.LayerStrategy.prototype.unregisterInstanceLayer =
      _.abstractMethod;


  /**
   * Set an instance layer as the base layer of a map.
   *
   * @param {Object} instanceLayer The instance layer to set as base.
   * @param {Object} map The map to apply the instance layer to.
   */
  aeris.maps.LayerStrategy.prototype.setBaseInstanceLayer =
      _.abstractMethod;


  /**
   * Add an instance layer to the map.
   *
   * @param {Object} instanceLayer The instance layer to add.
   * @param {Object} map The map to add the instance layer to.
   */
  aeris.maps.LayerStrategy.prototype.setInstanceLayer =
      _.abstractMethod;


  /**
   * Remove an instance layer from the map.
   *
   * @param {Object} instanceLayer The instance layer to remove.
   * @param {Object} map The map to remove the instance layer from.
   */
  aeris.maps.LayerStrategy.prototype.removeInstanceLayer =
      _.abstractMethod;


  /**
   * Get the times for the layer and return as a promise.
   *
   * @param {aeris.maps.Layer} layer The Aeris Layer to gather information.
   * @return {aeris.Promise}
   */
  aeris.maps.LayerStrategy.prototype.getTimes = _.abstractMethod;


  /**
   * Show a layer.
   *
   * @param {Object} instanceLayer The instance layer to show.
   */
  aeris.maps.LayerStrategy.prototype.showLayer = _.abstractMethod;


  /**
   * Hide a layer.
   *
   * @param {Object} instanceLayer The instance layer to hide.
   */
  aeris.maps.LayerStrategy.prototype.hideLayer = _.abstractMethod;


  /**
   * Set the opacity of a layer.
   *
   * @param {Object} instanceLayer The instance layer to set the opacity of.
   * @param {number} opacity The opacity to set (0 to 1.0).
   */
  aeris.maps.LayerStrategy.prototype.setLayerOpacity = _.abstractMethod;


  /**
   * Create an animation object for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to animate.
   * @return {aeris.maps.LayerAnimation}
   */
  aeris.maps.LayerStrategy.prototype.createAnimation = _.abstractMethod;


  /**
   * Auto-update a layer.
   *
   * @param {aeris.maps.Layer} layer The layer to auto-update.
   * @param {Object} opt_options Optional configuration options.
   */
  aeris.maps.LayerStrategy.prototype.autoUpdate = _.abstractMethod;


  /**
   * Set the z-index of a layer.
   *
   * @param {Object} instanceLayer The instance layer to set the z-index of.
   * @param {number} zIndex The z-index to set.
   */
  aeris.maps.LayerStrategy.prototype.setLayerZIndex = _.abstractMethod;


  /**
   * Determine when a layer has initialized.
   *
   * @param {aeris.maps.Layer} layer The layer to initialize.
   * @param {Object} instanceLayer The instance layer to determine when init.
   */
  aeris.maps.LayerStrategy.prototype.initializeLayer =
      _.abstractMethod;


  /**
   * Get the div of the last layer added to the map.
   *
   * @param {aeris.maps.Map} map The map to get the div from.
   * @param {Node}
   */
  aeris.maps.LayerStrategy.prototype.getDiv = _.abstractMethod;


  return aeris.maps.LayerStrategy;

});
