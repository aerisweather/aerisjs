define([
  'aeris/util',
  'aeris/maps/layers/modistile'
], function(_, ModisTile) {
  /**
   * Representation of Aeris Sea Surface Temperatures layer.
   *
   * @param {number|string} opt_period MODIS period length. If string, must parse as integer.
   * @constructor
   * @publicApi
   * @class SeaSurfaceTemps
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.ModisTile
   */
  var SeaSurfaceTemps = function(opt_attrs, opt_options) {
    var modisPeriodTileTypes = {
      1: 'modis_sst_1day',
      3: 'modis_sst_3day',
      7: 'modis_sst_7day',
      14: 'modis_sst_14day'
    };

    var attrs = _.extend({
      name: 'SeaSurfaceTemps',
      modisPeriodTileTypes: modisPeriodTileTypes
    }, opt_attrs);

    ModisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(SeaSurfaceTemps, ModisTile);


  return _.expose(SeaSurfaceTemps, 'aeris.maps.layers.SeaSurfaceTemps');
});
