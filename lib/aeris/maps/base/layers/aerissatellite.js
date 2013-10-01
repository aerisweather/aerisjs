define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisSatellite
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisSatellite = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisSatellite',
      tileType: 'sat',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.SATELLITE,
      zIndex: 501
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisSatellite, AerisInteractiveTile);


  return _.expose(AerisSatellite, 'aeris.maps.layers.AerisSatellite');
});
