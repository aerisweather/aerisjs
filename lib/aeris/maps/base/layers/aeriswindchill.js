define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisWindChill
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisWindChill = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisWindChill',
      tileType: 'current_windchill',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisWindChill, AerisInteractiveTile);


  return _.expose(AerisWindChill, 'aeris.maps.layers.AerisWindChill');
});
