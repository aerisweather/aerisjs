define([
  'aeris/util',
  'aeris/maps/layers/modistile'
], function(_, ModisTile) {
  /**
   * Representation of Aeris Sea Surface Temperatures layer.
   *
   * @constructor
   * @publicApi
   * @class Chlorophyll
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.ModisTile
   */
  var Chlorophyll = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      name: 'Chlorophyll',
      modisPeriodTileTypes: {
        1: 'modis_chlo_1day',
        3: 'modis_chlo_3day',
        7: 'modis_chlo_7day',
        14: 'modis_chlo_14day'
      }
    }, opt_attrs);

    ModisTile.call(this, attrs, opt_options);
  };

  // Inherit from AerisTile
  _.inherits(Chlorophyll, ModisTile);


  return _.expose(Chlorophyll, 'aeris.maps.layers.Chlorophyll');
});
