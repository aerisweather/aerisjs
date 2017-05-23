define([
  'aeris/util',
  'aeris/maps/animations/animationinterface',
  'aeris/errors/invalidargumenterror'
], function(_, AnimationInterface, InvalidArgumentError) {
  /**
   * A partially implemented {aeris.maps.animations.AnimationInterface}.
   *
   * @param {Object} opt_options
   * @param {Date} opt_options.from Starting time for the animation.
   * @param {Date} opt_options.to Ending time for the animation.
   * @param {number=} opt_options.limit Maximimum number of time intervals to load.
   * @param {number} opt_options.timestep
   * @param {number} opt_options.speed Number of minutes of weather data
   *        to display within a second.
   * @param {number} opt_options.endDelay Milliseconds to pause between animation loops.
   *
   * @constructor
   * @class aeris.maps.animations.AbstractAnimation
   * @extends aeris.maps.animations.AnimationInterface
   */
  var AbstractAnimation = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      from: _.now() - (1000 * 60 * 60), // one hour ago
      to: _.now(),
      limit: 20,
      speed: 30,
      timestep: 1000 * 60,
      endDelay: 1000
    });

    /**
     * Number of minutes of weather data
     * to display within a second.
     *
     * @type {number}
     * @private
     * @property speed_
     */
    this.speed_ = options.speed;


    /**
     * Milliseconds between animation frames.
     *
     * @type {number}
     * @private
     * @property timestep_
     */
    this.timestep_ = options.timestep;

    /**
     * Time to wait before repeating animation loop.
     * @type {number} Milliseconds.
     * @private
     * @property endDelay_
     */
    this.endDelay_ = options.endDelay;


    /**
     * Animation start time.
     *
     * @type {Date}
     * @protected
     * @property from_
     */
    this.from_ = options.from;


    /**
     * Animation end time.
     *
     * @default Current time.
     * @type {Date}
     * @protected
     * @property to_
     */
    this.to_ = options.to;


    /**
     * Max number of time "frames"
     * to load and render.
     *
     * @type {number}
     * @protected
     * @property limit_
     */
    this.limit_ = options.limit;


    this.normalizeTimeBounds_();


    /**
     * The time of the current animation frame.
     *
     * @type {number} Timestamp
     * @private
     * @property currentTime_
     */
    this.currentTime_ = Date.now();


    /**
     * A reference to the timer created
     * by window.setInterval
     * @type {number}
     * @private
     * @property animationClock_
     */
    this.animationClock_ = null;


    AnimationInterface.call(this);

    this.keepCurrentTimeInBounds_();
  };

  _.inherits(AbstractAnimation, AnimationInterface);


  /**
   * Start animating the layer.
   *
   * Every second, the layer is animated up
   * by timestep * speed milliseconds.
   * @method start
   */
  AbstractAnimation.prototype.start = function() {
    // Because calling goToTime every second would be
    // clunky, we use a shorter interval time, than
    // adjust our animation increment accordingly.
    var wait = 25;
    var multiplier = wait / 1000;
    var timeIncrement = this.timestep_ * this.speed_ * multiplier;      // in one second, animate on minute

    if (this.isAnimating()) {
      return;
    }


    // Prevents using endDelay, if we're starting from
    // the end.
    if (this.currentTime_ === this.to_) {
      this.goToTime(this.from_);
    }

    var isEndDelaying = false;
    this.animationClock_ = _.interval(function() {
      var nextTime = this.currentTime_ + timeIncrement;

      // If we're at the end, restart animation
      if (isEndDelaying) {
        return;
      }
      else if (nextTime > this.to_) {
        isEndDelaying = true;
        setTimeout(function() {
          isEndDelaying = false;
          this.goToTime(this.from_);
        }.bind(this), this.endDelay_)
      }
      else {
        this.goToTime(nextTime);
      }
    }, wait, this);
  };


  /**
   * @method normalizeTimeBounds_
   * @private
   */
  AbstractAnimation.prototype.normalizeTimeBounds_ = function() {
    if (_.isDate(this.from_)) {
      this.from_ = this.from_.getTime();
    }
    if (_.isDate(this.to_)) {
      this.to_ = this.to_.getTime();
    }
  };


  /**
   * Makes sure that the current time is always within
   * the `from` and `to` bounds of the animation.
   *
   * @method keepCurrentTimeInBounds_
   * @private
   */
  AbstractAnimation.prototype.keepCurrentTimeInBounds_ = function() {
    this.listenTo(this, {
      'change:to': function() {
        if (this.getCurrentTime() > this.getTo()) {
          this.goToTime(this.getTo());
        }
      },
      'change:from': function() {
        if (this.getCurrentTime() < this.getFrom()) {
          this.goToTime(this.getFrom());
        }
      }
    });
  };


  /**
   * Sets the current time to the specified time.
   *
   * Classes extending {aeris.maps.animations.AbstractAnimation}
   * should probably do something more useful here.
   *
   * @param {Date} time
   * @method goToTime
   */
  AbstractAnimation.prototype.goToTime = function(time) {
    this.currentTime_ = _.isDate(time) ? time.getTime() : time;
  };


  /**
   * @method getCurrentTime
   * @return {?Date}
   */
  AbstractAnimation.prototype.getCurrentTime = function() {
    return new Date(this.currentTime_);
  };


  /**
   * Stop animating the layer,
   * and return to the most recent frame
   * @method stop
   */
  AbstractAnimation.prototype.stop = function() {
    this.pause();

    if (!_.isNull(this.to_)) {
      this.goToTime(this.to_);
    }
  };


  /**
   * Stop animation the layer,
   * and stay at the current frame.
   * @method pause
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
   * Also see {aeris.maps.animations.AbstractAnimation}#setTimestamp
   *
   * @param {number} speed
   * @method setSpeed
   */
  AbstractAnimation.prototype.setSpeed = function(speed) {
    if (speed === this.speed_) {
      return;
    }

    if (!_.isNumber(speed)) {
      throw new InvalidArgumentError(speed + ' is not a valid animation speed.');
    }

    this.speed_ = speed;

    if (this.isAnimating()) {
      this.pause();
      this.start();
    }
  };


  /**
   * Sets the animation timestep.
   *
   * See {aeris.maps.animations.AbstractAnimation}#setSpeed
   * for more information on how
   * to use setTimestep and setSpeed to affect your animation speed.
   *
   * @param {number} timestep Timestep, in milliseconds.
   * @method setTimestep
   */
  AbstractAnimation.prototype.setTimestep = function(timestep) {
    if (timestep === this.timestep_) {
      return;
    }

    this.timestep_ = timestep;

    if (this.isAnimating()) {
      this.pause();
      this.start();
    }
  };


  /**
   * @method setFrom
   * @param {Date|number} from
   */
  AbstractAnimation.prototype.setFrom = function(from) {
    var isSame;

    if (from instanceof Date) {
      from = from.getTime();
    }

    isSame = (from === this.from_);

    if (!isSame) {
      this.from_ = from;
      this.trigger('change:from', new Date(this.from_));
    }
  };


  /**
   * @method getFrom
   * @return {Date}
   */
  AbstractAnimation.prototype.getFrom = function() {
    return new Date(this.from_);
  };


  /**
   * @method setTo
   * @param {Date|number} to
   */
  AbstractAnimation.prototype.setTo = function(to) {
    var isSame;

    if (to instanceof Date) {
      to = to.getTime();
    }

    isSame = (to === this.to_);

    if (!isSame) {
      this.to_ = to;
      this.trigger('change:to', new Date(this.to_));
    }
  };


  /**
   * @method getTo
   */
  AbstractAnimation.prototype.getTo = function() {
    return new Date(this.to_);
  };


  /**
   * @return {Boolean} True, if the animation is currently running.
   * @method isAnimating
   */
  AbstractAnimation.prototype.isAnimating = function() {
    return _.isNumber(this.animationClock_);
  };


  return AbstractAnimation;
});
