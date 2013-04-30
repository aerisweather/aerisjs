define(['aeris'], function(aeris) {

  /**
   * @fileoverview Interface definition for working with layer animation.
   */


  aeris.provide('aeris.maps.Animation');


  /**
   * Creates a new Animation that will use a Layer Strategy for specific
   * implementation support.
   *
   * @param {aeris.maps.LayerStrategy} strategy The LayerStrategy to use for
   *                                            implementation support.
   * @constructor
   */
  aeris.maps.Animation = function(strategy) {


    /**
     * The strategy to delegate to for implementation support.
     *
     * @type {aeris.maps.LayerStrategy}
     * @private
     */
    this.strategy_ = layerStrategy;

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


  return aeris.mapsAnimation;

});
