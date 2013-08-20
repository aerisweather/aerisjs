define(['aeris/util'], function(_) {

  /**
   * @fileoverview Default implementations for the LayerStrategy when dealing
   *               directly with layer div containers.
   */


  _.provide('aeris.maps.gmaps.layerstrategies.mixins.Div');


  /**
   * A mixin for a default implementation of the LayerStrategy for GMaps when
   * dealing with div containers.
   *
   * @const
   */
  aeris.maps.gmaps.layerstrategies.mixins.Div = {


    /**
     * @param {Node} div The div container for the layer.
     * @override
     */
    showLayer: function(div) {
      div.style.display = 'block';
    },


    /**
     * @param {Node} div The div container for the layer.
     * @override
     */
    hideLayer: function(div) {
      div.style.display = 'none';
    },


    /**
     * @param {Node} div The div container for the layer.
     * @override
     */
    setLayerOpacity: function(div, opacity) {
      div.style.opacity = opacity;
    },


    /**
     * @param {Node} div The div container for the layer.
     * @override
     */
    setLayerZIndex: function(div, zIndex) {
      div.style.zIndex = zIndex.toString();
    }

  };


  return aeris.maps.gmaps.layerstrategies.mixins.Div;

});
