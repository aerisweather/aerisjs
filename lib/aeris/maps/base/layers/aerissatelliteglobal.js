define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisSatelliteGlobal
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisSatelliteGlobal = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisSatelliteGlobal',
      tileType: 'globalsat',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisSatelliteGlobal, AerisInteractiveTile);


  return _.expose(AerisSatelliteGlobal, 'aeris.maps.layers.AerisSatelliteGlobal');
});
