define(['aeris', 'aeris/events'], function(aeris) {

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
   * @extends {aeris.Events}
   */
  aeris.maps.Animation = function(layer) {


    aeris.Events.call(this);


    /**
     * The layer being animated.
     *
     * @type {aeris.maps.Layer}
     * @private
     */
    this.layer_ = layer;


    layer.on('change:opacity', this.setOpacity, this);

  };
  aeris.extend(aeris.maps.Animation.prototype, aeris.Events.prototype);


  /**
   * Start the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.start = aeris.abstractMethod;


  /**
   * Pause the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.pause = aeris.abstractMethod;


  /**
   * Stop the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.stop = aeris.abstractMethod;


  /**
   * Go to the previous step in the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.previous = aeris.abstractMethod;


  /**
   * Go to the next step in the animation.
   *
   * @return {undefined}
   */
  aeris.maps.Animation.prototype.next = aeris.abstractMethod;


  /**
   * Set the opacity of the animation layers.
   *
   * @param {number} opacity The opacity to set the layers.
   */
  aeris.maps.Animation.prototype.setOpacity = aeris.abstractMethod;


  /**
   * Get the times for the animation and return as a Promise.
   *
   * @return {aeris.Promise}
   */
  aeris.maps.Animation.prototype.getTimes = aeris.abstractMethod;


  /**
   * Go to a specific time in the animation.
   *
   * @param {number} time The time to go to.
   */
  aeris.maps.Animation.prototype.goToTime = aeris.abstractMethod;


  return aeris.mapsAnimation;

});
