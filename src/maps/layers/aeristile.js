define([
  'aeris/util',
  'aeris/config',
  'aeris/promise',
  'aeris/errors/validationerror',
  'aeris/errors/missingapikeyerror',
  'aeris/errors/timeouterror',
  'aeris/maps/layers/abstracttile',
  'aeris/jsonp'
], function(_, aerisConfig, Promise, ValidationError, MissingApiKeyError, TimeoutError, BaseTile, JSONP) {
  /**
   * Representation of Aeris Interactive Tile layer.
   *
   * @constructor
   * @class AerisTile
   * @namespace aeris.maps.layers
   * @extends aeris.maps.layers.AbstractTile
   */
  var AerisTile = function(opt_attrs, opt_options) {
    var options = _.extend({
      strategy: 'layers/aeristile',
      validate: true,
      jsonp: JSONP
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
      autoUpdateInterval: AerisTile.updateIntervals.CURRENT,


      /**
       * Whether to auto-update the tile.
       * Auto-updating mean that every this.autoUpdateInterval
       * milliseconds, the tile's date property will reset.
       *
       * It's up to our strategy to handle changes in our
       * date.
       */
      autoUpdate: true,

      /**
       * @attribute {string} apiId Aeris API client_id
       */
      apiId: aerisConfig.get('apiId'),

      /**
       * @attribute {string} apiSecret Aeris API client_secret
       */
      apiSecret: aerisConfig.get('apiSecret')
    }, opt_attrs);

    /**
     * A reference to the timer
     * created with window.setInterval,
     * used for autoUpdating.
     *
     * @type {number}
     * @private
     * @property autoUpdateIntervalTimer_
     */
    this.autoUpdateIntervalTimer_;


    this.loaded_ = false;


    /**
     * @type {aeris.JSONP}
     * @private
     * @property jsonp_
     */
    this.jsonp_ = options.jsonp;


    BaseTile.call(this, attrs, options);


    this.bindToApiKeys_();
  };
  _.inherits(AerisTile, BaseTile);


  /**
   * @method initialize
   * @protected
   */
  AerisTile.prototype.initialize = function() {
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


  AerisTile.prototype.bindToApiKeys_ = function() {
    this.listenTo(aerisConfig, 'change:apiId change:apiSecret', function() {
      this.set({
        apiId: this.get('apiId') || aerisConfig.get('apiId'),
        apiSecret: this.get('apiSecret') || aerisConfig.get('apiSecret')
      });
    });
  };


  AerisTile.prototype.startAutoUpdate_ = function() {
    var self = this;

    this.autoUpdateIntervalTimer_ = window.setInterval(function() {
      self.set('time', new Date(0));
    }, this.get('autoUpdateInterval'));
  };


  AerisTile.prototype.stopAutoUpdate_ = function() {
    if (!this.autoUpdateIntervalTimer_) { return; }

    window.clearInterval(this.autoUpdateIntervalTimer_);
  };


  /**
   * @method validate
   */
  AerisTile.prototype.validate = function(attrs) {
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
  AerisTile.updateIntervals = {
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
   * @method getTileTimesCallback
   */
  AerisTile.prototype.getTileTimesCallback = function() {
    return this.get('tileType') + 'Times';
  };


  /**
   * @method getUrl
   */
  AerisTile.prototype.getUrl = function() {
    this.ensureApiKeys_();

    return this.get('server') +
        this.get('apiId') + '_' +
        this.get('apiSecret') +
        '/' + this.get('tileType') +
        '/{z}/{x}/{y}/{t}.png';
  };


  /**
   * @throws {aeris.errors.MissingApiKeysError}
   * @private
   * @method ensureApiKeys_
   */
  AerisTile.prototype.ensureApiKeys_ = function() {
    this.set({
      apiId: this.get('apiId') || aerisConfig.get('apiId'),
      apiSecret: this.get('apiSecret') || aerisConfig.get('apiSecret')
    });

    if (!this.get('apiId') || !this.get('apiSecret')) {
      throw new MissingApiKeyError('Aeris API id and secret required to render ' +
        'interactive tiles.');
    }
  };


  /**
   * @return {number} UNIX Timestamp.
   * @method getTimestamp
   */
  AerisTile.prototype.getTimestamp = function() {
    return this.get('time').getTime();
  };


  /**
   * Get's the layer's time,
   * formatted for the Aeris API.
   *
   * @return {string} Format: [year][month][date][hours][minutes][seconds].
   * @method getAerisTimeString
   */
  AerisTile.prototype.getAerisTimeString = function() {
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
   * Retrieve a list of timestamps for which
   * tile images are available on the AerisAPI server.
   *
   * @return {aeris.Promise} Resolves with arrary of timestamps.
   * @method loadTileTimes
   */
  AerisTile.prototype.loadTileTimes = function() {
    var TIMEOUT = 5000;
    var promiseToLoadTimes = new Promise();
    var url = this.createTileTimesUrl_();

    this.jsonp_.get(url, {}, _.bind(function(res) {
      var times;

      if (!res.files || !res.files.length) {
        promiseToLoadTimes.reject(new Error('Failed to load tile times: no time data was returned.'));
      }

      times = this.parseTileTimes_(res);

      promiseToLoadTimes.resolve(times);
    }, this), this.getTileTimesCallback());

    // As jsonp does not currently provide an onerror,
    // fallback to a timeout
    this.rejectAfterTimeout_(promiseToLoadTimes, TIMEOUT, 'Timeout while loading Aeris Interactive Tile times.');

    return promiseToLoadTimes;
  };


  /**
   * @param {aeris.Promise} promise
   * @param {number} timeout
   * @param {string} message
   * @private
   * @method rejectAfterTimeout_
   */
  AerisTile.prototype.rejectAfterTimeout_ = function(promise, timeout, message) {
    _.delay(function() {
      if (promise.getState() === 'pending') {
        promise.reject(new TimeoutError(message));
      }
    }.bind(this), timeout);
  };


  /**
   * @return {string}
   * @private
   * @method createTileTimesUrl_
   */
  AerisTile.prototype.createTileTimesUrl_ = function() {
    var urlPattern = '{server}/{client_id}_{client_secret}/{tileType}.jsonp';

    this.ensureApiKeys_();

    return urlPattern.
      replace('{server}', 'http://tile.aerisapi.com').
      replace('{client_id}', this.get('apiId')).
      replace('{client_secret}', this.get('apiSecret')).
      replace('{tileType}', this.get('tileType'));
  };


  /**
   * @param {Object} res Aeris Tile Times API response object.
   * @return {Array.<number>} Array of JS formatted timestamps.
   * @private
   * @method parseTileTimes_
   */
  AerisTile.prototype.parseTileTimes_ = function(res) {
    return _.map(res.files, function(time) {
      // Convert UNIX timestamp (seconds)
      // to JS timestamp (milliseconds)
      return time.timestamp * 1000;
    });
  };


  return _.expose(AerisTile, 'aeris.maps.layers.AerisTile');

});
