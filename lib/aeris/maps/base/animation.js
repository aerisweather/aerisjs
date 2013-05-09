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
   * @param {aeris.maps.Layer} layer The layer being animated.
   * @param {aeris.maps.Map} map The map to display the animation on.
   * @constructor
   */
  aeris.maps.Animation = function(strategy, layer, map) {


    /**
     * The strategy to delegate to for implementation support.
     *
     * @type {aeris.maps.LayerStrategy}
     * @private
     */
    this.strategy_ = strategy;


    /**
     * The layer being animated.
     *
     * @type {aeris.maps.Layer}
     * @private
     */
    this.layer_ = layer;


    /**
     * The map to display the animation on.
     *
     * @type {aeris.maps.Layer}
     * @private
     */
    this.map_ = map;

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
