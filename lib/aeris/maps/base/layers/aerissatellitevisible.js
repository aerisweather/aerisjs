define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisSatelliteVisible
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisSatelliteVisible = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisSatelliteVisible',
      tileType: 'sat_vistrans',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisSatelliteVisible, AerisInteractiveTile);


  return _.expose(AerisSatelliteVisible, 'aeris.maps.layers.AerisSatelliteVisible');
});
