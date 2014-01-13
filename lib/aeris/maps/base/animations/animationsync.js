define([
  'aeris/util',
  'base/animations/abstractanimation',
  'base/animations/animationinterface',
  'errors/invalidargumenterror'
], function(_, AbstractAnimation, AnimationInterface, InvalidArgumentError) {
  /**
   * Animates multiple layers along a single timeline.
   * Works by running a single 'master' animation, and having
   * all other animations go to the same time as the master.
   *
   * The master animation is dynamically set as the animation
   * with the shortest average interval between time frames. You can
   * manually set the master animation using the setMaster method, as well.
   *
   * @param {Array<aeris.maps.AnimationLayer>=} opt_animations
   *                                            Animations to sync.
   *                                            Animations can also be added using
   *                                            the `add` method.
   *
   *
   * @constructor
   * @class aeris.maps.animations.AnimationSync
   * @extends aeris.maps.animations.AbstractAnimation
   */
  var AnimationSync = function(opt_animations, opt_options) {
    AbstractAnimation.call(this, opt_options);


    /**
     * LayerAnimation instance.
     *
     * @type {Array.<Object.<string,aeris.maps.animations.AnimationInterface>>} { 'layerCid': animation }.
     * @private
     */
    this.animations_ = opt_animations || [];


    // Add animations passed in constructor
    this.add(this.animations_);

    /** @event load */
    /**
     * @event load:progress
     * @param {number} 1.0 mean loading is complete.
     */
    /**
     * @event load:times Available animation frame times have been loaded.
     * @param {Array.<number>} UNIX timestamps.
     */
  };

  _.inherits(AnimationSync, AbstractAnimation);


  /**
   * Add one or more animations to the sync.
   *
   * @param {aeris.maps.animations.AnimationInterface|Array.<aeris.maps.animations.AnimationInterface>} animations
   */
  AnimationSync.prototype.add = function(animations) {
    // Normalize as array
    animations = _.isArray(animations) ? animations : [animations];

    _.each(animations, this.addOne_, this);
  };


  /**
   * Add a single animation to sync.
   *
   * @param {aeris.maps.animations.AnimationInterface} animation
   * @private
   */
  AnimationSync.prototype.addOne_ = function(animation) {
    if (!(animation instanceof AnimationInterface)) {
      throw new InvalidArgumentError('Unable to add animation: invalid animation object');
    }

    animation.stop();
    this.animations_.push(animation);

    this.listenTo(animation, {
      'load:times': function() {
        this.trigger('load:times', this.getTimes());
      },
      'load:progress': this.triggerLoadProgress_,
      'load': this.triggerLoadProgress_
    });

    this.triggerLoadProgress_();
  };

  /**
   * Stop syncing one or more animations
   *
   * @param {aeris.maps.animations.AnimationInterface|Array.<aeris.maps.animations.AnimationInterface>} animations
   */
  AnimationSync.prototype.remove = function(animations) {
    animations = _.isArray(animations) ? animations : [animations];

    _.each(animations, this.removeOne_, this);
  };


  /**
   * Stop syncing a single animation.
   *
   * @param {aeris.maps.animations.AnimationInterface} animation
   * @private
   */
  AnimationSync.prototype.removeOne_ = function(animation) {
    this.stopListening(animation);

    this.animations_ = _.without(this.animations_, animation);
    animation.stop();
    animation.remove();
  };


  /**
   * Recalculates the total load progress
   * of all animations.
   *
   * Fires 'load' and 'load:progress' events
   */
  AnimationSync.prototype.triggerLoadProgress_ = function() {
    var progressArr = [];
    var progress;

    _.each(this.animations_, function(anim) {
      progressArr.push(anim.getLoadProgress());
    }, this);

    progress = _.average(progressArr);

    if (progress >= 1) {
      this.trigger('load');
    }
    this.trigger('load:progress', progress);

    return progress;
  };


  /**
   * @override
   */
  AnimationSync.prototype.next = function() {
    var time;

    if (this.currentTime_ >= this.to_.getTime()) {
      // Reset back to start.
      time = this.from_.getTime();
    }
    else {
      // Step up by this.timestep_ milliseconds.
      time = this.currentTime_ + this.timestep_;
    }

    this.goToTime(time);
  };


  /**
   * @override
   */
  AnimationSync.prototype.previous = function() {
    var time;

    if (this.currentTime_ <= this.from_.getTime()) {
      // Reset back to last frame.
      time = this.to_;
    }
    else {
      // Step up by this.timestep_ milliseconds.
      time = this.currentTime_ - this.timestep_;
    }

    this.goToTime(time);
  };


  /**
   * @override
   */
  AnimationSync.prototype.goToTime = function(time) {
    this.currentTime_ = time;

    // Move all animations to the current time
    _.each(this.animations_, function(anim) {
      anim.goToTime(this.currentTime_);
    }, this);

    this.trigger('change:time', new Date(this.currentTime_));
  };


  /**
   * @return {Array.<number>} UNIX timestamps. Sorted list of availble animation times.
   */
  AnimationSync.prototype.getTimes = function() {
    var times = [];

    _.each(this.animations_, function(anim) {
      times = times.concat(anim.getTimes());
    });

    return _.sortBy(times, function(n) { return n; });
  };


  /**
   * Sets the opacity for all sync'ed animations.
   *
   * @param {number} opacity
   */
  AnimationSync.prototype.setOpacity = function(opacity) {
    _.each(this.animations_, function(anim) {
      anim.setOpacity(opacity);
    }, this);
  };

  return _.expose(AnimationSync, 'aeris.maps.Animation');
});
