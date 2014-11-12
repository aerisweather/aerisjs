define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.Radar
   * @extends aeris.maps.layers.AerisTile
   */
  var Radar = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Radar',
      tileType: 'radar',
      futureTileType: 'frad_4knam',
      autoUpdateInterval: AerisTile.updateIntervals.RADAR
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };
  _.inherits(Radar, AerisTile);


  return _.expose(Radar, 'aeris.maps.layers.Radar');
});
