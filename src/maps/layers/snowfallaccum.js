define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.SnowFallAccum
   * @extends aeris.maps.layers.AerisTile
   */
  var SnowFallAccum = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SnowFallAccum',
      tileType: 'fsnow_4knam',
      futureTileType: 'fsnow_4knam',
      autoUpdateInterval: AerisTile.updateIntervals.MODIS
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };
  _.inherits(SnowFallAccum, AerisTile);


  return _.expose(SnowFallAccum, 'aeris.maps.layers.SnowFallAccum');
});
