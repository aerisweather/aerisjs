define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class SatelliteGlobal
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var SatelliteGlobal = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SatelliteGlobal',
      tileType: 'globalsat',
      autoUpdateInterval: AerisTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(SatelliteGlobal, AerisTile);


  return _.expose(SatelliteGlobal, 'aeris.maps.layers.SatelliteGlobal');
});
