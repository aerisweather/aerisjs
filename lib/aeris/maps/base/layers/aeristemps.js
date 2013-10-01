define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisTemps
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisTemps = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisTemps',
      tileType: 'current_temps',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisTemps, AerisInteractiveTile);


  return _.expose(AerisTemps, 'aeris.maps.layers.AerisTemps');
});
