define(['aeris'], function(aeris) {

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
     * The type of layer and expected strategy to handle the layer.
     *
     * @type {string}
     */
    this.strategy = null;


  };

  return aeris.maps.Layer;

});
