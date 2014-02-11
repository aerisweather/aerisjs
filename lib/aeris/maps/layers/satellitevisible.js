define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class SatelliteVisible
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var SatelliteVisible = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SatelliteVisible',
      tileType: 'sat_vistrans',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(SatelliteVisible, AerisInteractiveTile);


  return _.expose(SatelliteVisible, 'aeris.maps.layers.SatelliteVisible');
});
