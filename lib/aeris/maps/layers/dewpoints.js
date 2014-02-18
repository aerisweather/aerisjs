define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class DewPoints
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var DewPoints = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'DewPoints',
      tileType: 'current_dp',
      autoUpdateInterval: AerisTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(DewPoints, AerisTile);


  return _.expose(DewPoints, 'aeris.maps.layers.DewPoints');
});
