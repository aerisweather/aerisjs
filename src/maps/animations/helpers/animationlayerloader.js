define([
  'aeris/util',
  'aeris/events',
  'aeris/maps/animations/helpers/timelayersfactory',
  'aeris/promise'
], function(_, Events, TimeLayersFactory, Promise) {
  /**
   * Handles the loading of time-layers, cloned from a base layer.
   *
   * @class aeris.maps.animations.helpers.AnimationLayerLoader
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
     * @property layersByTime_
     */
    this.layersByTime_ = {};

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
   * @method setFrom
   * @param {number} from Timestamp.
   */
  AnimationLayerLoader.prototype.setFrom = function(from) {
    this.timeLayersFactory_.setFrom(from);
  };


  /**
   * @method setTo
   * @param {number} to Timestamp.
   */
  AnimationLayerLoader.prototype.setTo = function(to) {
    this.timeLayersFactory_.setTo(to);
  };


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
    var resolveOnLoadComplete = function() {
      this.once('load:complete', function() {
        promiseToLoadLayers.resolve(this.layersByTime_);
      });
    };
    var triggerLoadTimes = function(times) {
      this.trigger('load:times', times, this.layersByTime_);
    };

    this.baseLayer_.loadTileTimes().
      done(this.addLayersForTimes_, this).
      done(triggerLoadTimes, this).
      done(resolveOnLoadComplete, this).
      fail(promiseToLoadLayers.reject, promiseToLoadLayers);

    return promiseToLoadLayers.
      fail(this.trigger.bind(this, 'load:error'));
  };


  /**
   * @param {Array.<number>} times
   * @return {Object.<number, aeris.maps.layers.AerisTile>}
   * @private
   * @method addLayersForTimes_
   */
  AnimationLayerLoader.prototype.addLayersForTimes_ = function(times) {
    var currentTimes = this.getTimesFromLayers_(this.layersByTime_);
    var allTimes = _.uniq(currentTimes.concat(times));

    this.timeLayersFactory_.setTimes(allTimes);
    this.layersByTime_ = this.timeLayersFactory_.createTimeLayers();

    this.resetLayerLoadEvents_(this.layersByTime_);
  };


  /**
   * For a hash of { times -> layers }, return the times.
   *
   * @method getTimesFromLayers_
   * @param {Object.<number, aeris.maps.layers.AerisTile>} layersByTime
   * @private
   * @return {Array.<number>}
   */
  AnimationLayerLoader.prototype.getTimesFromLayers_ = function(layersByTime) {
    var toInt = function(time) {
      return parseInt(time);
    };

    return Object.keys(layersByTime).map(toInt);
  };


  /**
   * Set-up layer 'load:*' events for the specified time layers,
   * taking care not to set duplicate event listeners.
   *
   * @method resetLayerLoadEvents_
   * @private
   */
  AnimationLayerLoader.prototype.resetLayerLoadEvents_ = function(layersByTime) {
    this.unbindLayerLoadEvents_(layersByTime);
    this.bindLayerLoadEvents_(layersByTime);
  };


  /**
   * @method bindLayerLoadEvents_
   * @param {Object.<number,aeris.maps.layers.AerisTile>} layersByTime
   */
  AnimationLayerLoader.prototype.bindLayerLoadEvents_ = function(layersByTime) {
    var triggerLoadResetOnce = _.debounce(this.triggerLoadReset_.bind(this), 15);

    var bindLayerEvents = function(layer) {
      this.listenTo(layer, {
        'load': this.triggerLoadProgress_,
        'load:reset': triggerLoadResetOnce
      });
    };

    _.each(layersByTime, bindLayerEvents, this);
  };


  /**
   * Unbind 'load:*' events for the specified time layers.
   *
   * @method unbindLayerLoadEvents_
   * @private
   * @param {object.<number, aeris.maps.layers.AerisTile>} layersByTime
   */
  AnimationLayerLoader.prototype.unbindLayerLoadEvents_ = function(layersByTime) {
    _.each(layersByTime, this.stopListening, this);
  };


  /**
   * @method triggerLoadProgress_
   * @private
   */
  AnimationLayerLoader.prototype.triggerLoadProgress_ = function() {
    var progress = this.getLoadProgress();

    if (progress === 1) {
      this.trigger('load:complete', progress);
    }

    this.trigger('load:progress', progress);
  };


  /**
   * @method triggerLoadReset_
   * @private
   */
  AnimationLayerLoader.prototype.triggerLoadReset_ = function() {
    this.trigger('load:reset', this.getLoadProgress());
  };


  /**
   * @return {number} 1.0 is complete.
   * @method getLoadProgress
   */
  AnimationLayerLoader.prototype.getLoadProgress = function() {
    var totalCount = _.keys(this.layersByTime_).length;
    var loadedCount = 0;

    if (!totalCount) {
      return 0;
    }

    _.each(this.layersByTime_, function(layer) {
      if (layer.isLoaded()) {
        loadedCount++;
      }
    }, 0);


    return Math.min(loadedCount / totalCount, 1);
  };


  /**
   * @method destroy
   */
  AnimationLayerLoader.prototype.destroy = function() {
    this.stopListening();
    this.timeLayersFactory_.destroy();

    delete this.layersByTime_;
  };


  return AnimationLayerLoader;
});
