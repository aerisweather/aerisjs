define([
  'aeris/util',
  'aeris/config',
  'aeris/errors/unimplementedpropertyerror',
  'aeris/errors/validationerror',
  'aeris/aerisapi',
  'base/layers/abstracttile'
], function(_, config, UnimplementedPropertyError, ValidationError, AerisAPI, BaseTile) {
  /**
   * Representation of Aeris Interactive Tile layer.
   *
   * @constructor
   * @class aeris.maps.layers.AerisInteractiveTile
   * @extends aeris.maps.layers.AbstractTile
   */
  var AerisInteractiveTile = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'layerstrategies/aerisinteractivetile'
    }, opt_options);

    var attrs = _.extend({
      subdomains: ['1', '2', '3', '4'],
      server: 'http://tile{d}.aerisapi.com/',
      maxZoom: 27,
      minZoom: 1,

      /**
       * Tile's timestamp.
       * Defaults to 0.
       * Note that request to the AI Tiles API
       * at time '0' will return the latest available tile.
       *
       * @attribute time
       * @type {Date}
       */
      time: new Date(0),

      /**
       * Interactive tile type.
       *
       * @attribute tileType
       * @type {string}
       * @abstract
       */
      tileType: undefined,


      /**
       * The tile time index to use for displaying the layer.
       *
       * @type {number}
       */
      timeIndex: 0,


      /**
       * The layer's animation step.
       *
       * @type {number}
       */
      animationStep: 1,


      /**
       * Interval at which to update the tile.
       *
       * @attribute autoUpdateInterval
       * @type {number} Milliseconds.
       */
      autoUpdateInterval: AerisInteractiveTile.updateIntervals.CURRENT,


      /**
       * Whether to auto-update the tile.
       * Auto-updating mean that every this.autoUpdateInterval
       * milliseconds, the tile's date property will reset.
       *
       * It's up to our strategy to handle changes in our
       * date.
       */
      autoUpdate: true
    }, opt_attrs);

    /**
     * A reference to the timer
     * created with window.setInterval,
     * used for autoUpdating.
     *
     * @type {number}
     * @private
     */
    this.autoUpdateIntervalTimer_;


    this.loaded_ = false;

    BaseTile.call(this, attrs, options);
  };
  _.inherits(AerisInteractiveTile, BaseTile);


  /**
   * @override
   */
  AerisInteractiveTile.prototype.initialize = function() {
    var setAutoUpdate = (function() {
      var method = this.get('autoUpdate') ? this.startAutoUpdate_ : this.stopAutoUpdate_;
      method.call(this);
    }.bind(this));
    setAutoUpdate();      // Setup autoUpdate event on init

    // When autoUpdate property is toggled
    // start or stop auto-updating.
    this.on({
      'change:autoUpdate': setAutoUpdate,
      'change:autoUpdateInterval': function() {
        this.stopAutoUpdate_();
        this.startAutoUpdate_();
      }
    }, this);


    BaseTile.prototype.initialize.apply(this, arguments);
  };


  AerisInteractiveTile.prototype.startAutoUpdate_ = function() {
    var self = this;

    this.autoUpdateIntervalTimer_ = window.setInterval(function() {
      self.set('time', new Date(0));
    }, this.get('autoUpdateInterval'));
  };


  AerisInteractiveTile.prototype.stopAutoUpdate_ = function() {
    if (!this.autoUpdateIntervalTimer_) { return; }

    window.clearInterval(this.autoUpdateIntervalTimer_);
  };


  /**
   * @override
   */
  AerisInteractiveTile.prototype.validate = function(attrs) {
    if (!_.isString(attrs.tileType)) {
      return new ValidationError('tileType', 'not a valid string');
    }
    if (!_.isNumber(attrs.autoUpdateInterval)) {
      return new ValidationError('autoUpdateInterval', 'not a valid number');
    }
    if (attrs.minZoom < 1) {
      return new ValidationError('minZoom for Aeris Interactive tiles must be ' +
        'more than 0');
    }

    return BaseTile.prototype.validate.apply(this, arguments);
  };


  /**
   * Update intervals used by the Aeris API
   * @static
   */
  AerisInteractiveTile.updateIntervals = {
    RADAR: 1000 * 60 * 6,         // every 6 minutes
    CURRENT: 1000 * 60 * 60,      // hourly
    MODIS: 1000 * 60 * 60 * 24,   // daily
    SATELLITE: 1000 * 60 * 30,    // every 30 minutes
    ADVISORIES: 1000 * 60 * 3     // every 3 minutes
  };


  /**
   * Return the name of the jsonp callback
   * For returning timestamp metatdata
   *
   * @return {string} name of jsonp callback.
   */
  AerisInteractiveTile.prototype.getTileTimesCallback = function() {
    return this.get('tileType') + 'Times';
  };


  /**
   * @override
   */
  AerisInteractiveTile.prototype.getUrl = function() {
    return this.get('server') +
        config.get('apiId') + '_' +
        config.get('apiSecret') +
        '/' + this.get('tileType') +
        '/{z}/{x}/{y}/{t}.png';
  };


  /**
   * @return {number} UNIX Timestamp.
   */
  AerisInteractiveTile.prototype.getTimestamp = function() {
    return this.get('time').getTime();
  };


  /**
   * Get's the layer's time,
   * formatted for the Aeris API.
   *
   * @return {string} Format: [year][month][date][hours][minutes][seconds].
   */
  AerisInteractiveTile.prototype.getAerisTimeString = function() {
    var time = this.get('time');
    var timeString;

    // Aeris accepts 0, -1, -2, or -3
    // As 'X' times before now.
    // ie '0.png' returns the most recent tile
    if (time.getTime() <= 0) {
      return time.getTime();
    }

    // Aeris wants the time in the format of
    // '[year][month][date][hours][minutes][seconds]'
    // eg: March 8, 2013, 3:25:14pm = '20130308152514'
    timeString = time.getFullYear().toString();

    _.each([
      time.getUTCMonth() + 1,
      time.getUTCDate(),
      time.getUTCHours(),
      time.getUTCMinutes(),
      time.getUTCSeconds()
    ], function(timePart) {
      timePart = timePart.toString();

      // Add leading zeros onto each time component
      timePart = timePart.length === 2 ? timePart : '0' + timePart;

      timeString += timePart;
    });

    return timeString;
  };


  /**
   * @override
   */
  AerisInteractiveTile.prototype.clone = function(opt_attributes) {
    var attributes = _.extend(this.attributes, opt_attributes);

    // We're being a little optimistic here,
    // that our name property will always match
    // this global reference...
    var LayerType = aeris.maps.layers[this.get('name')];

    if (!LayerType) {
      throw new Error('Unable to clone Layer: Invalid layer');
    }

    return new LayerType(attributes);
  };


  return _.expose(AerisInteractiveTile, 'aeris.maps.layers.AerisInteractiveTile');

});
