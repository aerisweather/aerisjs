define(['aeris', 'base/extension/mapextension'], function(aeris) {

  /**
   * @fileoverview Interface definition for managing map layers.
   */


  aeris.provide('aeris.maps.LayerManager');


  /**
   * Creates a layer manager that binds to an aeris map which is delegating
   * layer commands.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtension}
   */
  aeris.maps.LayerManager = function(aerisMap, options) {
    aeris.maps.extension.MapExtension.call(this, aerisMap, options);


    this.set(options);

  };
  aeris.inherits(aeris.maps.LayerManager, aeris.maps.extension.MapExtension);


  /**
   * Set the base layer of the map.
   *
   * @param {aeris.maps.Layer} layer The base layer.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.setBaseLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    if (!instance.layer) {
      instance.layer = strategy.createInstanceLayer(layer);
      strategy.registerInstanceLayer(instance.layer, this.map);
    }
    strategy.setBaseInstanceLayer(instance.layer, this.map);
  };


  /**
   * Apply a layer to the map.
   *
   * @param {aeris.maps.Layer} layer The layer to apply.
   */
  aeris.maps.LayerManager.prototype.setLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    var timesPromise = strategy.getTimes(layer);
    var self = this;
    this.aerisMap.initialized.done(function() {
      if (layer.time) {
        self.setLayerCallback(layer, layer.time);
      } else if (timesPromise) {
        timesPromise.done(function(times) {
          layer.time = times[0];
          self.setLayerCallback(layer, layer.time);
        });
      } else {
        self.setLayerCallback(layer);
      }
    });
    layer.on('autoUpdate', function(time) {
      this.removeLayer(layer);
      this.setLayerCallback(layer, time);
    }, this);
  };


  /**
   * Remove a layer from the map.
   *
   * @param {aeris.maps.Layer} layer The layer to remove.
   */
  aeris.maps.LayerManager.prototype.removeLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    strategy.removeInstanceLayer(instance.layer, this.map);
    strategy.unregisterInstanceLayer(instance.layer, this.map);
    this.clearInstanceLayer(layer);
  };


  /**
   * Helper for applying a layer to the map with an optional timestamp.
   *
   * @param {aeris.maps.Layer} layer The layer to apply.
   * @param {string=} opt_time An optional timestamp of the layer.
   * @protected
   */
  aeris.maps.LayerManager.prototype.setLayerCallback =
      function(layer, opt_time) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    if (!instance.layer) {
      instance.layer = strategy.createInstanceLayer(layer, opt_time, {
        opacity: layer.opacity,
        visible: layer.visible
      });
      strategy.registerInstanceLayer(instance.layer, this.map);
      strategy.initializeLayer(layer, instance.layer);
    }
    strategy.setInstanceLayer(instance.layer, this.map);
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
   * @param {boolean} trigger Trigger the visible change event. Default = true
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.showLayer = function(layer, trigger) {
    trigger = typeof trigger == 'undefined' ? true : trigger;
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    strategy.showLayer(instance.layer);
    if (trigger)
      layer.trigger('change:visible', true);
  };


  /**
   * Make a specific layer hidden on the map.
   *
   * @param {aeris.maps.Layer} layer The layer to hide.
   * @param {boolean} trigger Trigger the visible change event. Default = true
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.hideLayer = function(layer, trigger) {
    trigger = typeof trigger == 'undefined' ? true : trigger;
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    strategy.hideLayer(instance.layer);
    if (trigger)
      layer.trigger('change:visible', false);
  };


  /**
   * Clear an implemented instance layer.
   *
   * @param {aeris.maps.Layer} layer The layer to clear the instance layer for.
   */
  aeris.maps.LayerManager.prototype.clearInstanceLayer = function(layer) {
    this.instances_[layer.id].layer = null;
  };


  /**
   * Set the opacity of a layer.
   *
   * @param {aeris.map.Layer} layer The layer to set the opacity of.
   * @param {number} opacity The opacity to set the layer to.
   * @return {undefined}
   */
  aeris.maps.LayerManager.prototype.setLayerOpacity =
      function(layer, opacity) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    strategy.setLayerOpacity(instance.layer, opacity);
    layer.trigger('change:opacity', opacity);
  };


  /**
   * Animate a specified layer.
   *
   * @param {aeris.maps.Layer} layer The layer to animate.
   * @return {aeris.maps.Animation}
   */
  aeris.maps.LayerManager.prototype.animateLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    if (!instance.animation)
      instance.animation = strategy.createAnimation(layer);
    return instance.animation;
  };


  /**
   * Auto-update a specified layer.
   *
   * @param {aeris.maps.Layer} layer The Layer to auto-update.
   */
  aeris.maps.LayerManager.prototype.autoUpdateLayer = function(layer) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    if (!instance.autoUpdate) {
      strategy.autoUpdate(layer);
      instance.autoUpdate = true;
    }
  };


  return aeris.maps.LayerManager;

});
