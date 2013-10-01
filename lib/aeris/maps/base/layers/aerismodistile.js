define([
  'aeris/util',
  'aeris/errors/invalidargumenterror',
  'base/layers/aerisinteractivetile'
], function(_, InvalidArgumentError, AerisInteractiveTile) {
  /**
   * Representation of an Aeris Modis layer.
   *
   * @constructor
   * @class aeris.maps.layers.AerisModisTile
   * @extends {aeris.maps.layers.AerisInteractiveTile}
   */
  var AerisModisTile = function(opt_attrs, opt_options) {
    var options = _.extend({
      period: 1
    }, opt_options);

    var attrs = _.extend({
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.MODIS,

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

    AerisInteractiveTile.call(this, attrs, opt_options);

    this.setModisPeriod(options.period);
  };

  // Inherit from AerisInteractiveTile
  _.inherits(AerisModisTile, AerisInteractiveTile);


  AerisModisTile.prototype.setModisPeriod = function(period) {
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


  return AerisModisTile;
});
