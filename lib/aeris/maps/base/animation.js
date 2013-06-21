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


    /**
     * The number of layers to display in the animation.
     *
     * @type {number}
     */
    this.max = 10;


    /**
     * The map to attach the animation to.
     *
     * @type {aeris.maps.Map}
     * @private
     */
    this.map_ = layer.getMap();


    layer.on('change:opacity', this.setOpacity, this);
    layer.on('change:visible', this.setVisibility, this);
    layer.on('remove', this.remove, this);
    layer.on('setMap', this.setMap, this);

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
   * Set the visibility of the animation layers.
   *
   * @param {boolean} visible The visibility (true/false) of the layer.
   */
  aeris.maps.Animation.prototype.setVisibility = aeris.abstractMethod;


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


  /**
   * Attach the animation to a map.
   *
   * @param {aeris.maps.Map} map
   */
  aeris.maps.Animation.prototype.setMap = function(map) {
    this.map_ = map;
  };


  /**
   * Remove the animation from the map.
   */
  aeris.maps.Animation.prototype.remove = function() {
    this.map_ = null;
  };


  return aeris.mapsAnimation;

});
