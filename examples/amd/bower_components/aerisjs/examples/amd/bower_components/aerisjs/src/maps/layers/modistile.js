define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'aeris/maps/layers/aeristile'
], function(_, InvalidArgumentError, AerisTile) {
  /**
   * Representation of an Aeris Modis layer.
   *
   * @constructor
   * @class ModisTile
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AerisTile
   */
  var ModisTile = function(opt_attrs, opt_options) {
    var options = _.extend({
      period: 14
    }, opt_options);

    var attrs = _.extend({
      autoUpdateInterval: AerisTile.updateIntervals.MODIS,

      /**
       * Hash of available tileType codes by period
       * Used to dynamically create layer's tileType
       *
       * @attribute modisPeriodTileTypes
       * @type {Object.<number, string>}
       */
      modisPeriodTileTypes: {
        /* eg
         1: "modis_tileType_1day",
         3: "modis_tileType_3day"
         */
      }
    }, opt_attrs);

    // Set initial tileType
    _.extend(attrs, {
      tileType: attrs.modisPeriodTileTypes[options.period]
    });

    AerisTile.call(this, attrs, opt_options);

    this.setModisPeriod(options.period);
  };

  // Inherit from AerisTile
  _.inherits(ModisTile, AerisTile);


  /**
   * @param {number} period
   * @throws {aeris.errors.InvalidArgumentError} If the layer does not support the given MODIS period.
   */
  ModisTile.prototype.setModisPeriod = function(period) {
    var validPeriods = _.keys(this.get('modisPeriodTileTypes'));
    period = parseInt(period);

    // Validate period
    if (!period || period < 1) {
      throw new InvalidArgumentError('Invalid MODIS period: period must be a positive integer');
    }
    if (!(period in this.get('modisPeriodTileTypes'))) {
      throw new InvalidArgumentError('Invalid MODIS periods: available periods are: ' + validPeriods.join(','));
    }

    // Set new tile type
    this.set('tileType', this.get('modisPeriodTileTypes')[period], { validate: true });
  };


  return ModisTile;
});
