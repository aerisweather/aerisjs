define(['aeris/util', 'aeris/events'], function(_, Events) {


  /**
   * Creates a new Animation that will use a Layer Strategy for specific
   * implementation support.
   *
   * @constructor
   * @class aeris.maps.animations.AnimationInterface
   * @interface
   * @uses aeris.Events
   */
  var AnimationInterface = function() {


    Events.call(this);


    /**
     * Fires when all animation tile frames
     * are loaded.
     *
     * Waiting to start an animation until
     * this event is triggered will ensure
     * smooth animations.
     *
     * If an animation is started before all
     * tile frames are loaded, tiles which are
     * not yet loaded will not render until
     * they are loaded.
     *
     * @event load:complete
     */

    /**
     * Fires to indicate progress in
     * preloading tiles.
     *
     * Useful for rendering loading UI
     * to the user, or if you want to buffer
     * an animation to a certain % done.
     *
     * @event load:progress
     * @param {number} Percent complete (where 1.0 is 100%).
     */

    /**
     * @event load:error
     * @param {Error} error
     */

    /**
     * Fires when tile times are loaded
     * for this animation.
     *
     * @event load:times
     * @param {Array.<number>} A list of timestamps.
     *                        for which animation frames
     *                        will be created.
     */

    /**
     * When current time of the animation changes.
     *
     * @event change:time
     * @param {Date} time
     */

    /**
     * @event change:from
     * @param {Date} from
     */
    /**
     * @event change:to
     * @param {Date} to
     */
  };
  _.extend(AnimationInterface.prototype, Events.prototype);


  /**
   * Begin preloading assets required to run the animation.
   *
   * @method preload
   * @return {aeris.Promise} Resolves when preloading is complete.
   */
  AnimationInterface.prototype.preload = _.abstractMethod;


  /**
   * Start the animation.
   *
   * @return {undefined}
   * @method start
   */
  AnimationInterface.prototype.start = _.abstractMethod;


  /**
   * Pause the animation.
   *
   * @return {undefined}
   * @method pause
   */
  AnimationInterface.prototype.pause = _.abstractMethod;


  /**
   * Stop the animation.
   *
   * @return {undefined}
   * @method stop
   */
  AnimationInterface.prototype.stop = _.abstractMethod;


  /**
   * Go to the previous step in the animation.
   *
   * @return {undefined}
   * @method previous
   */
  AnimationInterface.prototype.previous = _.abstractMethod;


  /**
   * Go to the next step in the animation.
   *
   * @return {undefined}
   * @method next
   */
  AnimationInterface.prototype.next = _.abstractMethod;


  /**
   * Go to a specific time in the animation.
   *
   * @param {number} time The time to go to (timestamp)
   * @method goToTime
   */
  AnimationInterface.prototype.goToTime = _.abstractMethod;


  /**
   * @method getCurrentTime
   * @return {?Date} Current time of the animation.
   *         Returns null if the animation has not yet initialized.
   */
  AnimationInterface.prototype.getCurrentTime = _.abstractMethod;


  /**
   * @method setFrom
   * @param {Date|number} from
   */
  AnimationInterface.prototype.setFrom = _.abstractMethod;


  /**
   * @method setTo
   * @param {Date|number} to
   */
  AnimationInterface.prototype.setTo = _.abstractMethod;


  /**
   * @method getFrom
   * @return {Date}
   */
  AnimationInterface.prototype.getFrom = _.abstractMethod;


  /**
   * @method getTo
   * @return {Date}
   */
  AnimationInterface.prototype.getFrom = _.abstractMethod;


  /**
   * @method isAnimating
   * @return {Boolean}
   */
  AnimationInterface.prototype.isAnimating = _.abstractMethod;


  /**
   * Is the animated object set to a map?
   *
   * @method hasMap
   * @return {Boolean}
   */
  AnimationInterface.prototype.hasMap = _.abstractMethod;

  return AnimationInterface;
});
