define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.Temps
   * @extends aeris.maps.layers.AerisTile
   */
  var Temps = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Temps',
      tileType: 'temperatures',
      futureTileType: 'ftemps',
      autoUpdateInterval: AerisTile.updateIntervals.CURRENT
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Temps, AerisTile);


  return _.expose(Temps, 'aeris.maps.layers.Temps');
});
