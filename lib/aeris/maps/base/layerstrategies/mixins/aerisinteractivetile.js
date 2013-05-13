define([
  'aeris', 'aeris/aerisapi',
  'base/animations/aerisinteractivetile'
], function(aeris) {

  /**
   * @fileoverview Shared implementation of the AerisInteractiveTile strategy.
   */


  aeris.provide('aeris.maps.layerstrategies.mixins.AerisInteractiveTile');


  /**
   * A mixin for shared implementation of the AerisInteractiveTile strategy.
   *
   * @const
   */
  aeris.maps.layerstrategies.mixins.AerisInteractiveTile = {


    /**
     * @override
     */
    getTimes: function(layer) {
      return aeris.AerisAPI.getTileTimes(layer);
    },


    /**
     * @override
     */
    createAnimation: function(layer) {
      return new aeris.maps.animations.AerisInteractiveTile(layer);
    }

  };


  return aeris.maps.layerstrategies.mixins.AerisInteractiveTile;

});
