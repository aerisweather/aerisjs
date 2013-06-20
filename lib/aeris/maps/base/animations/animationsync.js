define(['aeris', 'aeris/promise', 'base/animation'], function(aeris) {

  /**
   * @fileoverview Implementation of the composite pattern for syncing multiple
   *               animations.
   */


  aeris.provide('aeris.maps.animations.AnimationSync');


  /**
   * Create a sync object to manage the animation syncing of multiple
   * animations.
   *
   * @param {Array.<aeris.maps.Layer>} layers An array of layers to animate.
   * @constructor
   * @extends {aeris.maps.Animation}
   */
  aeris.maps.animations.AnimationSync = function(layers) {


    /**
     * The layers being animated.
     *
     * @type {Array.<aeris.maps.Layer>}
     * @private
     */
    this.layers_ = layers;


    /**
     * The animation instances
     *
     * @type {Array.<aeris.maps.Animation}
     * @private
     */
    this.animations_ = [];


    /**
     * Promise that the sync will be initialized.
     *
     * @type {aeris.Promise}
     */
    this.initialized = new aeris.Promise();


    /**
     * Toggle to determine if animation has started.
     *
     * @type {boolean}
     * @private
     */
    this.started_ = false;


    /**
     * The map to attach the animation to.
     *
     * @type {aeris.maps.Map}
     * @private
     */
    this.map_ = this.getSyncToLayer().getMap();


    this.initialize_();


    this.getSyncToLayer().on('remove', this.remove, this);
    this.getSyncToLayer().on('setMap', this.setMap, this);

  };
  aeris.inherits(aeris.maps.animations.AnimationSync, aeris.maps.Animation);


  /**
   * Initialize the creation of the animations.
   *
   * @private
   */
  aeris.maps.animations.AnimationSync.prototype.initialize_ = function() {
    var length = this.layers_.length;
    for (var i = 0; i < length; i++) {
      var layer = this.layers_[i];
      var animation = layer.animate();
      this.animations_.push(animation);
    }
    this.whenReady_();
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.start = function() {
    if (!this.map_) return false;
    var self = this;
    this.initialized.done(function() {
      var syncAnim = self.getSyncToAnimation();
      if (!self.started_) {
        var length = self.animations_.length;
        for (var i = 1; i < length; i++) {
          var anim = self.animations_[i];
          var bootStart = function() {
            anim.stop();
            anim.off('start', bootStart, self);
          };
          anim.on('start', bootStart, self);
          anim.start();
        }
        syncAnim.on('change:time', self.goToTime, self);
      }
      syncAnim.start();
      self.started_ = true;
    });
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.stop = function() {
    if (!this.map_) return false;
    this.forEachAnimation(function(animation) {
      animation.stop();
    })
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.pause = function() {
    if (!this.map_) return false;
    this.forEachAnimation(function(animation) {
      animation.pause();
    });
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.next = function() {
    if (!this.map_) return false;
    this.getSyncToAnimation().next();
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.previous = function() {
    if (!this.map_) return false;
    this.getSyncToAnimation().previous();
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.goToTime = function(time) {
    if (!this.map_) return false;
    var length = this.animations_.length;
    for (var i = 1; i < length; i++) {
      var anim = this.animations_[i];
      anim.goToTime(time);
    }
  };


  /**
   * Get the main layer to sync to.
   *
   * @return {aeris.maps.Layer}
   */
  aeris.maps.animations.AnimationSync.prototype.getSyncToLayer = function() {
    return this.layers_[0];
  };


  /**
   * Get the main animation to sync to.
   *
   * @return {aeris.maps.Animation}
   */
  aeris.maps.animations.AnimationSync.prototype.getSyncToAnimation =
      function() {
    return this.animations_[0];
  };


  /**
   * Determine when the layers have been initialized and the animation times
   * have been loaded.
   *
   * @return {aeris.Promise}
   * @private
   */
  aeris.maps.animations.AnimationSync.prototype.whenReady_ = function() {
    var init = this.initialized;
    var promises = [];
    var length = this.layers_.length;
    for (var i = 0; i < length; i++) {
      var anim = this.animations_[i];
      promises.push(anim.getTimes());
      var layer = this.layers_[i];
      promises.push(layer.initialized);
    }
    aeris.Promise.when(promises).done(function(responses) {
      init.resolve();
    });
  };


  /**
   * Loop through all animations and call the callback function with the
   * animation sync's context and the animation as the argument.
   *
   * @param {Function} fn The callback function.
   */
  aeris.maps.animations.AnimationSync.prototype.forEachAnimation =
      function(fn) {
    var time;
    var length = this.animations_.length;
    for (var i = 0; i < length; i++) {
      var animation = this.animations_[i];
      fn.call(this, animation);
    }
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.remove = function() {
    aeris.maps.Animation.prototype.remove.call(this);
    var first = true;
    this.forEachAnimation(function(animation) {
      if (first) {
        first = false;
        return false;
      }
      animation.stop();
    });
  };


  return aeris.maps.animations.AnimationSync;

});
