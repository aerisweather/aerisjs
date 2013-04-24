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
    this.aerisMap_.layers.showLayer(this);
  };


  /**
   * Hide the layer.
   *
   * @return {undefined}
   */
  aeris.maps.Layer.prototype.hide = function() {
    this.aerisMap_.layers.hideLayer(this);
  };


  return aeris.maps.Layer;

});
