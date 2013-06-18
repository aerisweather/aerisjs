define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Sea Surface Temperatures layer.
   */

  aeris.provide('aeris.maps.layers.AerisChlorophyll');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisModisTile}
   */
  aeris.maps.layers.AerisChlorophyll = function(period) {

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

    this.setModisPeriod(period || 1);
  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisChlorophyll,
                 aeris.maps.layers.AerisModisTile
  );


  return aeris.maps.layers.AerisChlorophyll;
});