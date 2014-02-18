define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class Satellite
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var Satellite = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Satellite',
      tileType: 'sat',
      autoUpdateInterval: AerisTile.updateIntervals.SATELLITE,
      zIndex: 501
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Satellite, AerisTile);


  return _.expose(Satellite, 'aeris.maps.layers.Satellite');
});
