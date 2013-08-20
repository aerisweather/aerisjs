define(['aeris/util', 'base/extension/mapextensionmanager'], function(_) {

  /**
   * @fileoverview Interface definition for managing map layers.
   */


  _.provide('aeris.maps.LayerManager');


  /**
   * Creates a layer manager that binds to an aeris map which is delegating
   * layer commands.
   *
   * @constructor
   * @extends {aeris.maps.extension.MapExtensionManager}
   */
  aeris.maps.LayerManager = function(aerisMap, options) {
    aeris.maps.extension.MapExtensionManager.call(this, aerisMap, options);


    this.set(options);

  };
  _.inherits(aeris.maps.LayerManager,
                 aeris.maps.extension.MapExtensionManager);


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
          layer.time = times[layer.timeIndex];
          self.setLayerCallback(layer, layer.time);
        });
      } else {
        self.setLayerCallback(layer);
      }
    });
  };


  /**
   * Remove a layer from the map.
   *
   * @param {aeris.maps.Layer} layer The layer to remove.
   * @param {Object} opt_options Optional options.
   */
  aeris.maps.LayerManager.prototype.removeLayer = function(layer, opt_options) {
    var options = opt_options || {};
    options.trigger = options.trigger === undefined ? true : options.trigger;
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    strategy.removeInstanceLayer(instance.layer, this.map);
    strategy.unregisterInstanceLayer(instance.layer, this.map);
    this.clearInstanceLayer(layer);
    layer.off('autoUpdate', null, this);
    if (!!options.trigger)
      layer.trigger('remove');
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
    layer.on('autoUpdate', this.autoUpdate_(layer), this);
    layer.trigger('setMap', this.map);
  };


  /**
   * Create a callback that should be called when a layer is auto-updated.
   *
   * @param {aeris.maps.Layer} layer The layer being auto updated.
   * @return {Function}
   * @private
   */
  aeris.maps.LayerManager.prototype.autoUpdate_ = function(layer) {
    var self = this;
    function fn(time) {
      self.removeLayer(layer, {
        trigger: false
      });
      self.setLayerCallback(layer, time);
    }
    return fn;
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
      var method = 'set' + _.ucfirst(opt);
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
   * @param {Object} opt_options Optional configuration options.
   */
  aeris.maps.LayerManager.prototype.autoUpdateLayer = function(layer, opt_options) {
    var strategy = this.getStrategy(layer);
    var instance = this.getInstance(layer);
    strategy.autoUpdate(layer, opt_options);
  };


  return aeris.maps.LayerManager;

});
