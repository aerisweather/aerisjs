define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class DewPoints
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var DewPoints = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'DewPoints',
      tileType: 'current_dp',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(DewPoints, AerisInteractiveTile);


  return _.expose(DewPoints, 'aeris.maps.layers.DewPoints');
});
