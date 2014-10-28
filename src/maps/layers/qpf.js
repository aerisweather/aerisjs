define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * Representation of Aeris QPF (Quantitative Precipitation Forecast) layer.
   *
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.QPF
   * @extends aeris.maps.layers.AerisTile
   */
  var QPF = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'QPF',
      tileType: 'fqpf_4knam',
      futureTileType: 'fqpf_4knam',
      autoUpdateInterval: 1000 * 60 * 60 * 6    // every 6 hours
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };
  _.inherits(QPF, AerisTile);


  return _.expose(QPF, 'aeris.maps.layers.QPF');
});
