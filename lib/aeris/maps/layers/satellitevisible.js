define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class SatelliteVisible
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var SatelliteVisible = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SatelliteVisible',
      tileType: 'sat_vistrans',
      autoUpdateInterval: AerisTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(SatelliteVisible, AerisTile);


  return _.expose(SatelliteVisible, 'aeris.maps.layers.SatelliteVisible');
});
