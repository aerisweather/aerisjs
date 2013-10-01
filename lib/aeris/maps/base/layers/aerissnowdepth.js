define([
  'aeris/util',
  'base/layers/aerisinteractivetile'
], function(_, AerisInteractiveTile) {
  /**
   * @constructor
   * @class aeris.maps.layers.AerisSnowDepth
   * @extends aeris.maps.layers.AerisInteractiveTile
   */
  var AerisSnowDepth = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisSnowDepth',
      tileType: 'snowdepth_snodas',
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.MODIS
    }, opt_attrs);


    AerisInteractiveTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisSnowDepth, AerisInteractiveTile);


  return _.expose(AerisSnowDepth, 'aeris.maps.layers.AerisSnowDepth');
});
