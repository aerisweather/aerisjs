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

    this.baseLayer_.loadTileTimes().
      done(function(times) {
        this.addTimeLayersForTimes_(times);

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
   * @method addTimeLayersForTimes_
   */
  AnimationLayerLoader.prototype.addTimeLayersForTimes_ = function(times) {
    var currentTimes = Object.keys(this.timeLayers_).map(function(time) {
      return parseInt(time);
    });
    times = _.uniq(currentTimes.concat(times));

    this.timeLayersFactory_.setTimes(times);

    this.timeLayers_ = this.timeLayersFactory_.createTimeLayers();

    this.bindLayerLoadEvents_(this.timeLayers_);
  };


  /**
   * @method bindLayerLoadEvents_
   * @param {Object.<number,aeris.maps.layers.AerisTile>} timeLayers
   */
  AnimationLayerLoader.prototype.bindLayerLoadEvents_ = function(timeLayers) {
    var triggerLoadResetOnce = _.debounce(function() {
      this.trigger('load:reset', this.getLoadProgress());
    }, 15);

    _.each(timeLayers, function(layer) {
      // clear any old event bindings
      this.stopListening(layer);

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

    if (!totalCount) {
      return 0;
    }

    _.each(this.timeLayers_, function(layer) {
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

    delete this.timeLayers_;
  };


  return AnimationLayerLoader;
});
