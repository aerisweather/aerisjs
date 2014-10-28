define([
  'aeris/util',
  'aeris/maps/layers/aeristile'
], function(_, AerisTile) {
  /**
   * Representation of Aeris RadSat layer.
   *
   * @constructor
   * @publicApi
   * @class aeris.maps.layers.RadSat
   * @extends aeris.maps.layers.AerisTile
   */
  var RadSat = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'RadSat',
      tileType: 'radsat',
      autoUpdateInterval: AerisTile.updateIntervals.RADAR
    }, opt_attrs);


    AerisTile.call(this, attrs, opt_options);
  };
  _.inherits(RadSat, AerisTile);


  return _.expose(RadSat, 'aeris.maps.layers.RadSat');
});
