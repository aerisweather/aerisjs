define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class Satellite
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var Satellite = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Satellite',
      tileType: 'sat',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.SATELLITE,
      zIndex: 501
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(Satellite, AerisInteractiveTile);


  return _.expose(Satellite, 'aeris.maps.layers.Satellite');
});
