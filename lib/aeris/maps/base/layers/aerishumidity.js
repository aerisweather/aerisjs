define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisHumidity
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisHumidity = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisHumidity',
      tileType: 'current_rh',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisHumidity, AerisInteractiveTile);


  return _.expose(AerisHumidity, 'aeris.maps.layers.AerisHumidity');
});
