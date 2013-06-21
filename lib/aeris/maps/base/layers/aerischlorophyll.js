define(['aeris', './aerismodistile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Sea Surface Temperatures layer.
   */

  aeris.provide('aeris.maps.layers.AerisChlorophyll');


  /**
   * * @param {number=1|string} opt_period MODIS period length. If string, must parse as integer.
   * @constructor
   * @extends {aeris.maps.layers.AerisModisTile}
   */
  aeris.maps.layers.AerisChlorophyll = function(opt_period) {
    opt_period || (opt_period = 1);

    // Call parent constructor
    aeris.maps.layers.AerisModisTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisChlorophyll';


    /**
     * @override
     */
    this.modisPeriodTileTypes = {
      1: 'modis_chlo_1day',
      3: 'modis_chlo_3day',
      7: 'modis_chlo_7day',
      14: 'modis_chlo_14day'
    }

    this.setModisPeriod(opt_period);
  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisChlorophyll,
                 aeris.maps.layers.AerisModisTile
  );


  return aeris.maps.layers.AerisChlorophyll;
});