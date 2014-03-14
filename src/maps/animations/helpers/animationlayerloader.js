define([
  'aeris/util',
  'aeris/events',
  'aeris/maps/animations/helpers/timelayersfactory',
  'aeris/promise'
], function(_, Events, TimeLayersFactory, Promise) {
  /**
   * Handles the loading of time-layers, cloned from a base layer.
   *
   * @class AnimationLayerLoader
   * @namespace aeris.maps.animations.helpers
   * @constructor
   *
   * @param {aeris.maps.layers.AerisTile} baseLayer
   * @param {aeris.maps.animations.options.AnimationOptions=} opt_options
   * @param {aeris.maps.animations.helpers.TimeLayersFactory=} opt_options.timeLayersFactory
   */
  var AnimationLayerLoader = function(baseLayer, opt_options) {
    var options = opt_options || {};

    /**
     * @type {aeris.maps.layers.AerisTile}
     * @private
     * @property baseLayer_
     */
    this.baseLayer_ = baseLayer;

    /**
     * @type {aeris.maps.animations.helpers.TimeLayersFactory}
     * @private
     * @property timeLayersFactory_
     */
    this.timeLayersFactory_ = options.timeLayersFactory || new TimeLayersFactory(baseLayer, null, options);


    /**
     * @type {Object.<number,AerisTile>}
     * @private
     * @property timeLayers_
     */
    this.timeLayers_ = {};

    /**
     * @event load:progress
     * @param {number} Progress (1.0 is complete).
     */
    /**
     * @event load:complete
     * @param {number} Progress (1.0 is complete).
     */
    /**
     * @event load:error
     * @param {Error} error
     */
    /**
     * @event load:times
     * @param {Array.<number>} times
     */

    Events.call(this);
  };
  _.extend(AnimationLayerLoader.prototype, Events.prototype);


  /**
   * Creates layers for all available times,
   * cloned from the base layer.
   *
   * Resolves with {Object.<number,aeris.maps.layers.AerisTile>}
   * --> a map of timestamps to layers.
   *
   * @return {aeris.Promise}
   * @method load
   */
  AnimationLayerLoader.prototype.load = function() {
    var promiseToLoadLayers = new Promise();

    this.baseLayer_.loadTileTimes().
      done(function(times) {
        this.timeLayers_ = this.createLayersFromTimes_(times);
        this.bindLayerLoadEvents_();

        this.trigger('load:times', times, this.timeLayers_);

        this.once('load:complete', function() {
          promiseToLoadLayers.resolve(this.timeLayers_);
        }, this);
      }, this).
      fail(function(err) {
        this.trigger('load:error', err);
      }, this).
      fail(promiseToLoadLayers.reject, promiseToLoadLayers);

    return promiseToLoadLayers;
  };


  /**
   * @param {Array.<number>} times
   * @return {Object.<number, aeris.maps.layers.AerisTile>}
   * @private
   * @method createLayersFromTimes_
   */
  AnimationLayerLoader.prototype.createLayersFromTimes_ = function(times) {
    this.timeLayersFactory_.setTimes(times);
    return this.timeLayersFactory_.createTimeLayers();
  };


  /**
   * @method bindLayerLoadEvents_
   */
  AnimationLayerLoader.prototype.bindLayerLoadEvents_ = function() {
    var triggerLoadResetOnce = _.debounce(function() {
      this.trigger('load:reset', this.getLoadProgress());
    }, 15);

    _.each(this.timeLayers_, function(layer) {
      this.listenTo(layer, {
        'load': function() {
          var progress = this.getLoadProgress();

          if (progress === 1) {
            this.trigger('load:complete', progress);
          }

          this.trigger('load:progress', progress);
        },
        'load:reset': triggerLoadResetOnce
      });
    }, this);
  };


  /**
   * @return {number} 1.0 is complete.
   * @method getLoadProgress
   */
  AnimationLayerLoader.prototype.getLoadProgress = function() {
    var totalCount = _.keys(this.timeLayers_).length;
    var loadedCount = 0;

    if (!totalCount) { return 0; }

    _.each(this.timeLayers_, function(layer) {
      if (layer.isLoaded()) {
        loadedCount++;
      }
    }, 0);


    return Math.min(loadedCount / totalCount, 1);
  };


  return AnimationLayerLoader;
});
