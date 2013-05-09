define(['aeris'], function(aeris) {

  /**
   * @fileoverview Interface definition for working with layer animation.
   */


  aeris.provide('aeris.maps.Animation');


  /**
   * Creates a new Animation that will use a Layer Strategy for specific
   * implementation support.
   *
   * @param {aeris.maps.Layer} layer The layer being animated.
   * @constructor
   */
  aeris.maps.Animation = function(layer) {


    /**
     * The layer being animated.
     *
     * @type {aeris.maps.Layer}
     * @private
     */
    this.layer_ = layer;

  };


  /**
   * Start the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.start = aeris.notImplemented();


  /**
   * Pause the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.pause = aeris.notImplemented();


  /**
   * Stop the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.stop = aeris.notImplemented();


  /**
   * Go to the previous step in the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.previous = aeris.notImplemented();


  /**
   * Go to the next step in the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.next = aeris.notImplemented();


  return aeris.mapsAnimation;

});
