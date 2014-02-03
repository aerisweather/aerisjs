define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class AerisDewPoints
   * @namespace aeris.maps.layers
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
