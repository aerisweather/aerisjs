define(['aeris', 'aeris/strategy'], function(aeris) {

  /**
   * @fileoverview Interface definition for defining map layers.
   */


  aeris.provide('aeris.maps.Layer');


  /**
   * A Layer is a data wrapper for a specific type of layer. The type of layer
   * is defined by the strategy property an can only be used if a
   * LayerManagerStrategy is provided.
   *
   * @constructor
   */
  aeris.maps.Layer = function() {


    /**
     * The strategy container for supporting prioritization of layer types.
     *
     * @type {aeris.Strategy}
     */
    this.strategy = new aeris.Strategy();


    /**
     * A unique name for the layer.
     *
     * @type {string}
     */
    this.name = null;


    /**
     * The visibility of the layer where true is visible and false is hidden.
     *
     * @type {boolean}
     */
    this.visible = true;


    /**
     * The opacity of the layer with value between 0 and 1.0.
     *
     * @type {number}
     */
    this.opacity = 1.0;


    /**
     * An AerisMap that the layer is bound to. This is set with setMap, and
     * is used for layer helpers which are delegated to the layer manager.
     *
     * @type {aeris.maps.map}
     * @private
     */
    this.aerisMap_ = null;


  };


  /**
   * Apply the layer to a given map.
   *
   * @param {aeris.maps.Map} aerisMap The map to apply the layer to.
   * @return {undefined}
   */
  aeris.maps.Layer.prototype.setMap = function(aerisMap) {
    this.aerisMap_ = aerisMap;
    aerisMap.layers.setLayer(this);
  };


  /**
   * Display the layer.
   *
   * @return {undefined}
   */
  aeris.maps.Layer.prototype.show = function() {
    this.visibile = true;
    if (this.aerisMap_)
      this.aerisMap_.layers.showLayer(this);
  };


  /**
   * Hide the layer.
   *
   * @return {undefined}
   */
  aeris.maps.Layer.prototype.hide = function() {
    this.visible = false;
    if (this.aerisMap_)
      this.aerisMap_.layers.hideLayer(this);
  };


  /**
   * Set the opacity of the layer.
   *
   * @param {number} opacity The opacity to set the layer to.
   * @return {undefined}
   */
  aeris.maps.Layer.prototype.setOpacity = function(opacity) {
    this.opacity = opacity = parseFloat(opacity);
    if (this.aerisMap_)
      this.aerisMap_.layers.setLayerOpacity(this, opacity);
  };


  /**
   * Get an animation object of the layer and start the animation.
   *
   * @return {aeris.maps.Animation}
   */
  aeris.maps.Layer.prototype.animate = function() {
    return this.aerisMap_.layers.animateLayer(this);
  };


  /**
   * Auto-update the layer.
   *
   * @return {undefined}
   */
  aeris.maps.Layer.prototype.autoUpdate = function() {
    this.aerisMap_.layers.autoUpdateLayer(this);
  };


  return aeris.maps.Layer;

});
