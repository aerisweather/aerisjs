define(['aeris/util'], function(_) {

  /**
   * @fileoverview Shared implementation of the KML strategy.
   */


  _.provide('aeris.maps.layerstrategies.mixins.KML');


  /**
   * A mixin for shared implementation of the KML strategy.
   *
   * @const
   */
  aeris.maps.layerstrategies.mixins.KML = {


    /**
     * @override
     */
    autoUpdate: function(layer) {
      if (layer.autoUpdateInterval) {
        window.setInterval(function() {
          layer.trigger('autoUpdate');
        }, layer.autoUpdateInterval);
      }
    }

  };


  return aeris.maps.layerstrategies.mixins.KML;

});
