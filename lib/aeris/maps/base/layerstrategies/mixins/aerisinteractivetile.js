define([
  'aeris/util', 'aeris/aerisapi',
  'base/animations/aerisinteractivetile'
], function(_) {

  /**
   * @fileoverview Shared implementation of the AerisInteractiveTile strategy.
   */


  _.provide('aeris.maps.layerstrategies.mixins.AerisInteractiveTile');


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
    },


    /**
     * @override
     */
    autoUpdate: function(layer, opt_options) {
      var options = opt_options || {};
      var stop = options['stop'] || false;
      if (!stop) {
        var fnCallback = function(times) {
          layer.time = times[layer.timeIndex];
          layer.trigger('autoUpdate', layer.time);
        };
        aeris.AerisAPI.getInstance().onTileTimesUpdate(
          layer, fnCallback, this);
      } else {
        aeris.AerisAPI.getInstance().offTileTimesUpdate(layer, null, this);
      }
    }

  };


  return aeris.maps.layerstrategies.mixins.AerisInteractiveTile;

});
