define([
  'aeris/util',
  'base/layers/aerismodistile'
], function(_, AerisModisTile) {
  /**
   * Representation of Aeris Sea Surface Temperatures layer.
   *
   * @constructor
   * @class aeris.maps.layers.AerisChlorophyll
   * @extends {aeris.maps.layers.AerisModisTile}
   */
  var AerisChlorophyll = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'AerisChlorophyll',
      modisPeriodTileTypes: {
        1: 'modis_chlo_1day',
        3: 'modis_chlo_3day',
        7: 'modis_chlo_7day',
        14: 'modis_chlo_14day'
      }
    }, opt_attrs);

    AerisModisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisChlorophyll, AerisModisTile);


  return _.expose(AerisChlorophyll, 'aeris.maps.layers.AerisChlorophyll');
});
