define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.Winds
   * @extends aeris.maps.layers.AerisTile
   */
  var Winds = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Winds',
      tileType: 'fwinds-nam4k',
      futureTileType: 'fwinds-nam4k',
      autoUpdateInterval: AerisTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Winds, AerisTile);


  return _.expose(Winds, 'aeris.maps.layers.Winds');
});
