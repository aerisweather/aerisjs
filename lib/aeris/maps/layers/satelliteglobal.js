define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class SatelliteGlobal
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var SatelliteGlobal = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SatelliteGlobal',
      tileType: 'globalsat',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(SatelliteGlobal, AerisInteractiveTile);


  return _.expose(SatelliteGlobal, 'aeris.maps.layers.SatelliteGlobal');
});
