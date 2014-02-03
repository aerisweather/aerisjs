define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class AerisSatellite
   * @namespace aeris.maps.layers
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
