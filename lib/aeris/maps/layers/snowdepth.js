define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class SnowDepth
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var SnowDepth = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SnowDepth',
      tileType: 'snowdepth_snodas',
      autoUpdateInterval: AerisTile.updateIntervals.MODIS
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(SnowDepth, AerisTile);


  return _.expose(SnowDepth, 'aeris.maps.layers.SnowDepth');
});
