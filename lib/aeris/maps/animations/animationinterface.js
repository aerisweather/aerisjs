define(['aeris/util', 'aeris/events'], function(_, Events) {


  /**
   * Creates a new Animation that will use a Layer Strategy for specific
   * implementation support.
   *
   * @constructor
   * @class aeris.maps.animations.AnimationInterface
   * @extends {aeris.Events}
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
     * If an anmimation is started before all
     * tile frames are loaded, tiles which are
     * not yet loaded will not render until
     * they are loaded.
     *
     * @event load
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
     * Fires when tile times are loaded
     * for this animation.
     *
     * @event load:times
     * @param {Array.<number>} A list of timestamps
     *                        for which animation frames
     *                        will be created.
     */
  };
  _.extend(AnimationInterface.prototype, Events.prototype);


  /**
   * Start the animation.
   *
   * @return {undefined}
   */
  AnimationInterface.prototype.start = _.abstractMethod;


  /**
   * Pause the animation.
   *
   * @return {undefined}
   */
  AnimationInterface.prototype.pause = _.abstractMethod;


  /**
   * Stop the animation.
   *
   * @return {undefined}
   */
  AnimationInterface.prototype.stop = _.abstractMethod;


  /**
   * Go to the previous step in the animation.
   *
   * @return {undefined}
   */
  AnimationInterface.prototype.previous = _.abstractMethod;


  /**
   * Go to the next step in the animation.
   *
   * @return {undefined}
   */
  AnimationInterface.prototype.next = _.abstractMethod;


  /**
   * Go to a specific time in the animation.
   *
   * @param {number} time The time to go to.
   */
  AnimationInterface.prototype.goToTime = _.abstractMethod;


  return AnimationInterface;
});
