define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.Satellite
   * @extends aeris.maps.layers.AerisTile
   */
  var Satellite = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Satellite',
      tileType: 'satellite',
      futureTileType: 'fsat',
      autoUpdateInterval: AerisTile.updateIntervals.SATELLITE
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Satellite, AerisTile);


  return _.expose(Satellite, 'aeris.maps.layers.Satellite');
});
