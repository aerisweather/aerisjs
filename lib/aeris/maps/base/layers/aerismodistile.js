define(['aeris/util', 'base/layers/aerisinteractivetile'], function(_) {

  /**
   * @fileoverview Representation of an Aeris Modis layer.
   */

  _.provide('aeris.maps.layers.AerisModisTile');


  /**
   * @constructor
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  aeris.maps.layers.AerisModisTile = function() {

    // Call parent constructor
    aeris.maps.layers.AerisInteractiveTile.call(this);

    /**
     * @override
     */
    this.autoUpdateInterval = this.updateIntervals.MODIS;


    /**
     * Hash of available tileType codes by period
     * Used to dynamically create layer's tileType
     *
     * @type {Object.<number, string>}
     */
    this.modisPeriodTileTypes = {
      /* eg
      1: "modis_tileType_1day",
      3: "modis_tileType_3day"
      */
    };
  };

  // Inherit from AerisInteractiveTile
  _.inherits(aeris.maps.layers.AerisModisTile,
                 aeris.maps.layers.AerisInteractiveTile
  );


  aeris.maps.layers.AerisModisTile.prototype.setModisPeriod = function(period) {
    var validPeriods = [];
    period = parseInt(period);

    // Validate period
    if(!period || period < 1) {
      throw new Error("Invalid MODIS period: period must be a positive integer");
    }
    if(!(period in this.modisPeriodTileTypes)) {
      // Get a list of valid keys
      for(var key in this.modisPeriodTileTypes) {
        if(this.modisPeriodTileTypes.hasOwnProperty(key)) {
          validPeriods.push(key);
        }
      }

      throw new Error("Invalid MODIS periods: available periods are: " + validPeriods.join(','));
    }

    // Set new tile type
    this.tileType = this.modisPeriodTileTypes[period];
  };


  return aeris.maps.layers.AerisModisTile;
});