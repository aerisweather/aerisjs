define(['aeris'], function(aeris) {

  /**
   * @fileoverview Default implementations of the LayerStrategy for OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.mixins.Default');


  /**
   * A mixin for a default implementation of the LayerStrategy for OpenLayers.
   *
   * @const
   */
  aeris.maps.openlayers.layerstrategies.mixins.Default = {


    /**
     * @override
     */
    registerInstanceLayer: function(instanceLayer, map) {
      map.addLayer(instanceLayer);
    },


    /**
     * @override
     */
    unregisterInstanceLayer: function(instanceLayer, map) {
      map.removeLayer(instanceLayer);
    },


    /**
     * @override
     */
    initializeLayer: function(layer, instanceLayer) {
      instanceLayer.setZIndex(layer.zIndex);
    },


    /**
     * @override
     */
    setBaseInstanceLayer: function(instanceLayer, map) {
      map.setBaseLayer(instanceLayer);
    },


    /**
     * @override
     */
    showLayer: function(instanceLayer) {
      instanceLayer.setVisibility(true);
    },


    /**
     * @override
     */
    hideLayer: function(instanceLayer) {
      instanceLayer.setVisibility(false);
    },


    /**
     * @override
     */
    setLayerOpacity: function(instanceLayer, opacity) {
      instanceLayer.setOpacity(opacity);
    }

  };


  return aeris.maps.openlayers.layerstrategies.mixins.Default;

});
