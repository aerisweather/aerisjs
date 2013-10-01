define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisHeatIndex
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisHeatIndex = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisHeatIndex',
      tileType: 'current_heat_index',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisHeatIndex, AerisInteractiveTile);


  return _.expose(AerisHeatIndex, 'aeris.maps.layers.AerisHeatIndex');
});
