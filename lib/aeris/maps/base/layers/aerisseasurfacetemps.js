define(['aeris', './aerisinteractivetile'], function(aeris) {

  /**
   * @fileoverview Representation of Aeris Sea Surface Temperatures layer.
   */

  aeris.provide('aeris.maps.layers.AerisSurfaceTemps');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisModisTile}
   */
  aeris.maps.layers.AerisSeaSurfaceTemps = function(opt_period) {

    // Call parent constructor
    aeris.maps.layers.AerisModisTile.call(this);

    /**
     * @override
     */
    this.name = 'AerisSeaSurfaceTemps';


    /**
     * @override
     */
    this.modisPeriodTileTypes = {
      1: 'modis_sst_1day',
      3: 'modis_sst_3day',
      7: 'modis_sst_7day',
      14: 'modis_sst_14day'
    }

    this.setModisPeriod(opt_period || 1);
  };

  // Inherit from AerisInteractiveTile
  aeris.inherits(aeris.maps.layers.AerisSeaSurfaceTemps,
                 aeris.maps.layers.AerisModisTile
  );


  return aeris.maps.layers.AerisSeaSurfaceTemps;
});