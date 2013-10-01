define([
  'aeris/util',
  'base/animations/animationinterface'
], function(_, AnimationInterface) {
  /**
   * A partially implemented {aeris.maps.animations.AnimationInterface}.
   *
   * @param {Object} opt_options
   * @param {Date} opt_options.from Starting time for the animation.
   * @param {Date} opt_options.to Ending time for the animation.
   * @param {number} opt_options.timestep
   * @param {number} opt_options.speed
   * @param {number} opt_options.endDelay Milliseconds to pause between animation loops.
   * @param {number} opt_options.opacity
   *
   * @constructor
   * @class aeris.maps.animations.AbstractAnimation
   * @extends aeris.maps.animations.AnimationInterface
   */
  var AbstractAnimation = function(opt_options) {
    var options = _.extend({
      from: new Date((new Date()).getTime() - (1000 * 60 * 60 * 10.5)),      // Aeris seems to return times for ~10hrs
      to: new Date(),
      speed: 6,
      timestep: 1000 * 60 * 1,
      opacity: 1,
      endDelay: 1000
    }, opt_options);

    /**
     * Number of minutes of weather data
     * to display within a second.
     *
     * @type {number}
     * @private
     */
    this.speed_ = options.speed;


    /**
     * Milliseconds between animation frames.
     *
     * @type {number}
     * @private
     */
    this.timestep_ = options.timestep;

    /**
     * Time to wait before repeating animation loop.
     * @type {number} Milliseconds.
     * @private
     */
    this.endDelay_ = options.endDelay;


    /**
     * Animation start time.
     *
     * @type {Date}
     * @private
     */
    this.from_ = options.from;


    /**
     * Animation end time.
     *
     * @default Current time.
     * @type {Date}
     * @private
     */
    this.to_ = options.to;


    /**
     * The time of the current animation frame.
     *
     * @type {Date}
     * @private
     */
    this.currentTime_ = this.from_ ? this.from_.getTime() : undefined;


    /**
     * A reference to the timer created
     * by window.setInterval
     * @type {number}
     * @private
     */
    this.animationClock_ = null;


    /**
     * Opacity of animation tiles.
     *
     * @type {number}
     * @private
     */
    this.opacity_ = options.opacity;


    AnimationInterface.call(this);
  };

  _.inherits(AbstractAnimation, AnimationInterface);


  /**
   * Start animating the layer.
   *
   * Every second, the layer is animated up
   * by timestep * speed milliseconds.
   */
  AbstractAnimation.prototype.start = function() {
    // Because calling goToTime every second would be
    // clunky, we use a shorter interval time, than
    // adjust our animation increment accordingly.
    var wait = 25;
    var multiplier = wait / 1000;
    var increment = this.timestep_ * this.speed_ * multiplier;      // in one second, animate on minute

    if (this.isAnimating()) { return; }

    this.animationClock_ = _.interval(function() {
      var nextTime = this.currentTime_ + increment;

      // If we're at the end, restart animation
      if (nextTime > this.to_.getTime()) {
        this.pause();
        _.delay(function() {
          this.goToTime(this.from_.getTime());
          this.start();
        }, this.endDelay_, this);
      }
      else {
        this.goToTime(nextTime);
      }
    }, wait, this);
  };


  /**
   * Sets the current time to the specified time.
   *
   * Classes extending {aeris.maps.animations.AbstractAnimation}
   * should probably do something more useful here.
   *
   * @param time
   */
  AbstractAnimation.prototype.goToTime = function(time) {
    this.currentTime_ = time;
  };


  /**
   * Stop animating the layer,
   * and return to the most recent frame
   */
  AbstractAnimation.prototype.stop = function() {
    this.pause();
    this.goToTime(this.to_.getTime());
  };


  /**
   * Stop animation the layer,
   * and stay at the current frame.
   */
  AbstractAnimation.prototype.pause = function() {
    window.clearInterval(this.animationClock_);
    this.animationClock_ = null;
  };


  /**
   * Set the animation speed.
   *
   * Every second, [timestep] * [speed] milliseconds
   * of tiles are animated.
   *
   * So with a timestep of 360,000 (6 minutes), and a speed of 2:
   *  every second, 12 minutes of tiles will be animated.
   *
   * Setting a negative speed will cause the animation to run in reverse.
   *
   * Also see {aeris.maps.animations.AbstractAnimation#setTimestamp}
   *
   * @param {number} speed
   */
  AbstractAnimation.prototype.setSpeed = function(speed) {
    this.speed_ = speed;

    if (this.isAnimating()) {
      this.pause();
      this.start();
    }
  };


  /**
   * Sets the animation timestep.
   *
   * See {aeris.maps.animations.AbstractAnimation#setSpeed}
   * for more information on how
   * to use setTimestep and setSpeed to affect your animation speed.
   *
   * @param {number} timestep Timestep, in milliseconds.
   */
  AbstractAnimation.prototype.setTimestep = function(timestep) {
    this.timestep_ = timestep;

    if (this.isAnimating()) {
      this.pause();
      this.start();
    }
  };


  /**
   * @return {Boolean} True, if the animation is currently running.
   */
  AbstractAnimation.prototype.isAnimating = function() {
    return _.isNumber(this.animationClock_);
  };


  return AbstractAnimation;
});
