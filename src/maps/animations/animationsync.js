define([
  'aeris/util',
  'aeris/maps/animations/abstractanimation',
  'aeris/maps/layers/animationlayer',
  'aeris/maps/animations/autoupdateanimation',
  'aeris/promise'
], function(_, AbstractAnimation, AnimationLayer, AutoUpdateAnimation, Promise) {
  /**
   * Animates multiple layers along a single timeline.
   * Works by running a single 'master' animation, and having
   * all other animations go to the same time as the master.
   *
   * The master animation is dynamically set as the animation
   * with the shortest average interval between time frames. You can
   * manually set the master animation using the setMaster method, as well.
   *
   * @param {Array<aeris.maps.layers.AnimationLayer|aeris.maps.animations.AnimationInterface>=} opt_animations Layers/Animations to sync.
   *        Animations can also be added using the `add` method.
   *
   * @param {function():aeris.maps.animations.AnimationInterface} opt_options.AnimationType_ The
   *        type (constructor) of animation object to create when adding a layer to the AnimationSync.
   *
   *
   * @constructor
   * @publicApi
   * @class aeris.maps.animations.AnimationSync
   * @extends aeris.maps.animations.AbstractAnimation
   * @implements aeris.maps.animations.AnimationInterface
   */
  var AnimationSync = function(opt_animations, opt_options) {
    var options = _.defaults(opt_options || {}, {
      AnimationType: AutoUpdateAnimation
    });

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
      from: this.from_,
      limit: this.limit_,
      timeTolerance: options.timeTolerance
    };


    /**
     * LayerAnimation instance.
     *
     * @type {Array.<Object.<string,aeris.maps.animations.AnimationInterface>>} { 'layerCid': animation }.
     * @private
     * @property animations_
     */
    this.animations_ = [];


    /**
     * Type of animation object to use when adding
     * a layer.
     *
     * @property AnimationType_
     * @private
     * @type {function():aeris.maps.animations.AnimationInterface}
     */
    this.AnimationType_ = options.AnimationType;


    /**
     * Memory of which animations have triggered a load:times event.
     *
     * @property animationsWhichHaveLoadedTimes_
     * @private
     * @type {Array.<aeris.maps.animations.AnimationInterface}
     */
    this.animationsWhichHaveLoadedTimes_ = [];


    // Add animations passed in constructor
    this.add(opt_animations || []);


    this.listenTo(this, {
      'change:to change:from': function() {
        this.animations_.forEach(function(anim) {
          anim.setTo(this.getTo());
          anim.setFrom(this.getFrom());
        }, this);
      }
    });

    /**
     * @event autoUpdate
     */
  };

  _.inherits(AnimationSync, AbstractAnimation);


  /**
   * @method preload
   */
  AnimationSync.prototype.preload = function() {
    var activeAnimations = this.animations_.filter(function(anim) {
      return anim.hasMap();
    });

    // Preload each animation, in sequence.
    return Promise.sequence(activeAnimations, function(animation) {
      return animation.preload();
    });
  };


  /**
   * Add one or more animations to the sync.
   *
   * @param {Array.<aeris.maps.animations.AnimationInterface|aeris.maps.layers.AnimationLayer>} animations_or_layers Animation
   *        object or layer (or an array of objects).
   * @method add
   */
  AnimationSync.prototype.add = function(animations_or_layers) {
    var animations;

    // Normalize as array
    animations_or_layers = _.isArray(animations_or_layers) ?
      animations_or_layers : [animations_or_layers];

    // Normalize as animation objects
    animations = animations_or_layers.map(function(obj) {
      var isLayer = obj instanceof AnimationLayer;

      var options = _.extend({}, this.options_, {
        to: this.getTo(),
        from: this.getFrom(),
        limit: this.limit_
      });
      return isLayer ? new this.AnimationType_(obj, options) : obj;
    }, this);

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
        if (!_.contains(this.animationsWhichHaveLoadedTimes_, animation)) {
          this.animationsWhichHaveLoadedTimes_.push(animation);
        }

        if (this.animationsWhichHaveLoadedTimes_.length === this.animations_.length) {
          this.trigger('load:times', this.getTimes());
        }
      },
      'load:progress load:complete': this.triggerLoadProgress_,
      'load:error': function(err) {
        this.trigger('load:error', err);
      },
      'load:reset': function(progress) {
        this.trigger('load:reset', progress);
      },
      'autoUpdate': function(anim) {
        this.setTo(anim.getTo());
        this.setFrom(anim.getFrom());
        this.trigger('autoUpdate');
      }
    });

    animation.setTo(this.getTo());
    animation.setFrom(this.getFrom());

    this.triggerLoadProgress_();
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
   * Get the total loading progress of animations within the animation
   * sync. Only considers animations which are set to the map.
   *
   * @method getLoadProgress
   * @return {number}
   */
  AnimationSync.prototype.getLoadProgress = function() {
    var activeAnimations = this.animations_.filter(function(anim) {
      return anim.hasMap();
    });
    var progressCounts = activeAnimations.map(function(anim) {
      return anim.getLoadProgress();
    });

    return _.average(progressCounts);
  };


  /**
   * @method next
   * @param {number=} opt_timestep Milliseconds to advance.
   */
  AnimationSync.prototype.next = function(opt_timestep) {
    var timestep = opt_timestep || this.timestep_;
    var nextTime = this.getNextTime_(this.currentTime_, timestep);

    this.goToTime(nextTime);
  };


  /**
   * @method getNextTime_
   * @private
   * @param {number} baseTime
   * @param {number} timestep Milliseconds to advance past base time.
   * @return {number} Next available time. If time is greater than 'to' bound, starts over at 'from'.
   */
  AnimationSync.prototype.getNextTime_ = function(baseTime, timestep) {
    var nextTime = baseTime + timestep;

    // We're already at end
    // --> restart
    if (baseTime >= this.to_) {
      // Reset back to start.
      nextTime = this.from_;
    }

    // Our next time is outside our 'to' bound
    // --> go to end
    else if (nextTime >= this.to_) {
      nextTime = this.to_;
    }

    return nextTime;
  };


  /**
   * @method previous
   * @param {number=} opt_timestep Milleseconds to rewind.
   */
  AnimationSync.prototype.previous = function(opt_timestep) {
    var timestep = opt_timestep || this.timestep_;
    var prevTime = this.getPrevTime_(this.currentTime_, timestep);

    this.goToTime(prevTime);
  };


  /**
   * @method getPrevTime_
   * @private
   * @param {number} baseTime
   * @param {number} timestep Milliseconds to reverse before base time.
   * @return {number} Next available time. If time is less than 'from' bound, starts over at 'to'.
   */
  AnimationSync.prototype.getPrevTime_ = function(baseTime, timestep) {
    var prevTime = baseTime - timestep;

    // We're already at beginning
    // --> go to end
    if (baseTime <= this.from_) {
      prevTime = this.to_;
    }

    // Next time is before beginning
    // --> go to beginning
    else if (prevTime <= this.from_) {
      prevTime = this.from_;
    }

    return prevTime;
  };


  /**
   * @method goToTime
   */
  AnimationSync.prototype.goToTime = function(time) {
    this.currentTime_ = _.isDate(time) ? time.getTime() : time;

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

    return _.sortBy(times, function(n) {
      return n;
    });
  };


  return _.expose(AnimationSync, 'aeris.maps.animations.AnimationSync');
});
