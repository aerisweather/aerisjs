define([
  'aeris/util',
  'base/layers/aerismodistile'
], function(_, AerisModisTile) {
  /**
   * Representation of Aeris Sea Surface Temperatures layer.
   *
   * @param {number=1|string} opt_period MODIS period length. If string, must parse as integer.
   * @constructor
   * @class aeris.maps.layers.AerisSeaSurfaceTemps
   * @extends {aeris.maps.layers.AerisModisTile}
   */
  var AerisSeaSurfaceTemps = function(opt_attrs, opt_options) {
    var modisPeriodTileTypes = {
      1: 'modis_sst_1day',
      3: 'modis_sst_3day',
      7: 'modis_sst_7day',
      14: 'modis_sst_14day'
    };

    var attrs = _.extend({
      name: 'AerisSeaSurfaceTemps',
      modisPeriodTileTypes: modisPeriodTileTypes
    }, opt_attrs);

    AerisModisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisSeaSurfaceTemps, AerisModisTile);


  return _.expose(AerisSeaSurfaceTemps, 'aeris.maps.layers.AerisSeaSurfaceTemps');
});
