define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class HeatIndex
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var HeatIndex = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'HeatIndex',
      tileType: 'current_heat_index',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(HeatIndex, AerisInteractiveTile);


  return _.expose(HeatIndex, 'aeris.maps.layers.HeatIndex');
});
