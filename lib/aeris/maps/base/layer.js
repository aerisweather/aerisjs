define(['aeris', 'aeris/strategy', 'aeris/events'], function(aeris) {

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
   * @extends {aeris.Events}
   */
  aeris.maps.Layer = function() {


    aeris.Events.call(this);


    /**
     * A unique id representing each layer.
     *
     * @type {number}
     */
    this.id = aeris.maps.Layer.nextId_++;


    /**
     * The strategy container for supporting prioritization of layer types.
     *
     * @type {aeris.Strategy}
     */
    this.strategy = new aeris.Strategy();


    /**
     * A name/type for the layer.
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
  aeris.extend(aeris.maps.Layer.prototype, aeris.Events.prototype);


  /**
   * The next unique id for layers.
   *
   * @type {number}
   * @private
   */
  aeris.maps.Layer.nextId_ = 0;


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
   * Remove the layer from the map.
   */
  aeris.maps.Layer.prototype.remove = function() {
    this.aerisMap_.layers.removeLayer(this);
    this.aerisMap_ = null;
  }


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
   */
  aeris.maps.Layer.prototype.autoUpdate = function() {
    this.aerisMap_.layers.autoUpdateLayer(this);
  };


  /**
   * Clone a layer.
   *
   * @param {Object} properties Additional properties to extend on the layer.
   * @return {aeris.maps.Layer}
   */
  aeris.maps.Layer.prototype.clone = aeris.abstractMethod;


  return aeris.maps.Layer;

});
