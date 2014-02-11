define([
  'ai/util',
  'ai/maps/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @publicApi
   * @class SnowDepth
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var SnowDepth = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'SnowDepth',
      tileType: 'snowdepth_snodas',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.MODIS
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(SnowDepth, AerisInteractiveTile);


  return _.expose(SnowDepth, 'aeris.maps.layers.SnowDepth');
});
