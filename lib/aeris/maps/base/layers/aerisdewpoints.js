define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisDewPoints
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisDewPoints = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisDewPoints',
      tileType: 'current_dp',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisDewPoints, AerisInteractiveTile);


  return _.expose(AerisDewPoints, 'aeris.maps.layers.AerisDewPoints');
});
