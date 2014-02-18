define([
  'aeris/util',
  'aeris/maps/animations/abstractanimation'
], function(_, AbstractAnimation) {
  /**
   * Animates multiple layers along a single timeline.
   * Works by running a single 'master' animation, and having
   * all other animations go to the same time as the master.
   *
   * The master animation is dynamically set as the animation
   * with the shortest average interval between time frames. You can
   * manually set the master animation using the setMaster method, as well.
   *
   * @param {Array<aeris.maps.layers.AnimationLayer>=} opt_animations
   *                                            Animations to sync.
   *                                            Animations can also be added using
   *                                            the `add` method.
   *
   *
   * @constructor
   * @publicApi
   * @class AnimationSync
   * @namespace aeris.maps.animations
   * @extends aeris.maps.animations.AbstractAnimation
   * @implements aeris.maps.animations.AnimationInterface
   */
  var AnimationSync = function(opt_animations, opt_options) {
    AbstractAnimation.call(this, opt_options);


    /**
     * Reference to the original options
     * passed to the AnimationSync constructor.
     *
     * @type {Object}
     * @private
     * @property options_
     */
    this.options_ = {
      to: this.to_,
      from: this.from_
    };


    /**
     * LayerAnimation instance.
     *
     * @type {Array.<Object.<string,aeris.maps.animations.AnimationInterface>>} { 'layerCid': animation }.
     * @private
     * @property animations_
     */
    this.animations_ = [];


    // Add animations passed in constructor
    this.add(opt_animations || []);
  };

  _.inherits(AnimationSync, AbstractAnimation);


  /**
   * Add one or more animations to the sync.
   *
   * @param {aeris.maps.animations.AnimationInterface|Array.<aeris.maps.animations.AnimationInterface>} animations
   * @method add
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
   * @method addOne_
   */
  AnimationSync.prototype.addOne_ = function(animation) {
    animation.stop();
    this.animations_.push(animation);

    this.listenTo(animation, {
      'load:times': function() {
        this.updateTimeBounds_();
        this.trigger('load:times', this.getTimes());
      },
      'load:progress load:complete': this.triggerLoadProgress_,
      'load:error': function(err) {
        this.trigger('load:error', err);
      },
      'load:reset': function(progress) {
        this.trigger('load:reset', progress);
      }
    });

    this.triggerLoadProgress_();
  };


  AnimationSync.prototype.updateTimeBounds_ = function() {
    var times = this.getTimes();
    var earliestTime = Math.min.apply(null, times);
    var latestTime = Math.max.apply(null, times);

    // Update from an to
    // so they are within available times.
    this.from_ = Math.max(this.options_.from, earliestTime);
    this.to_ = Math.min(this.options_.to, latestTime);

    // Ensure that current time is not
    // out of bounds
    this.currentTime_ = Math.max(this.from_, this.currentTime_);
    this.currentTime_ = Math.min(this.to_, this.currentTime_);
  };


  /**
   * Stop syncing one or more animations
   *
   * @param {aeris.maps.animations.AnimationInterface|Array.<aeris.maps.animations.AnimationInterface>} animations
   * @method remove
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
   * @method removeOne_
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
   * Fires 'load:complete' and 'load:progress' events
   * @method triggerLoadProgress_
   * @private
   */
  AnimationSync.prototype.triggerLoadProgress_ = function() {
    var progress = this.getLoadProgress();

    if (progress >= 1) {
      this.trigger('load:complete');
    }
    this.trigger('load:progress', progress);

    return progress;
  };


  /**
   * @method getLoadProgress
   * @return {number}
   */
  AnimationSync.prototype.getLoadProgress = function() {
    var progressArr = [];
    var progress;

    _.each(this.animations_, function(anim) {
      progressArr.push(anim.getLoadProgress());
    }, this);

    progress = _.average(progressArr);

    if (progress >= 1) {
      this.trigger('load:complete');
    }
    this.trigger('load:progress', progress);

    return progress;
  };


  /**
   * @method next
   */
  AnimationSync.prototype.next = function() {
    var time;

    if (this.currentTime_ >= this.to_) {
      // Reset back to start.
      time = this.from_;
    }
    else {
      // Step up by this.timestep_ milliseconds.
      time = this.currentTime_ + this.timestep_;
    }

    this.goToTime(time);
  };


  /**
   * @method previous
   */
  AnimationSync.prototype.previous = function() {
    var time;

    if (this.currentTime_ <= this.from_) {
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
   * @method goToTime
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
   * @method getTimes
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
   * @method setOpacity
   */
  AnimationSync.prototype.setOpacity = function(opacity) {
    _.each(this.animations_, function(anim) {
      anim.setOpacity(opacity);
    }, this);
  };

  return _.expose(AnimationSync, 'aeris.maps.animations.AnimationSync');
});
