define(['aeris', 'aeris/jsonp', 'aeris/promise', 'aeris/events'],
function(aeris) {

  /**
   * @fileoverview Facade implementation of the Aeris API.
   */


  aeris.provide('aeris.AerisAPI');


  /**
   * Facade of the Aeris API.
   *
   * @constructor
   * @extends {aeris.Events}
   */
  aeris.AerisAPI = function() {


    aeris.Events.call(this);


    /**
     * A cache of promises per tile type.
     *
     * @type {Object.<string,aeris.Promise>}
     * @private
     */
    this.timePromises_ = {};


    /**
     * A cache of interval references for tile time updating.
     *
     * @type {Object.<number,number>}
     * @private
     */
    this.tileTimesUpdates_ = {};

  };
  aeris.extend(aeris.AerisAPI.prototype, aeris.Events.prototype);


  /**
   * Get the times for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to get the times for.
   * @param {boolean=} opt_refresh Optionally force a refresh of the times.
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.prototype.getTileTimes = function(layer, opt_refresh) {
    var refresh = opt_refresh ? true : false;
    var promise = this.timePromises_[layer.tileType];
    if (!promise || refresh) {
      promise = this.timePromises_[layer.tileType] = new aeris.Promise();
      var url = 'http://tile.aerisapi.com/' +
                aeris.config.apiId + '_' +
                aeris.config.apiSecret + '/' +
                layer.tileType + '.jsonp';
      aeris.jsonp.get(url, {}, function(data) {
        var times = [];
        var length = data.files.length;
        for (var i = 0; i < length; i++) {
          times.push(data.files[i].time);
        }
        promise.resolve(times);
      }, layer.tileType + 'Times');
    }
    return promise;
  };


  /**
   * Listen for tile time updates for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to listen for time updates.
   * @param {Function} fn The callback function.
   * @param {Object=} opt_ctx An optional context to call the callback in.
   */
  aeris.AerisAPI.prototype.onTileTimesUpdate = function(layer, fn, opt_ctx) {
    this.on('tileTimesUpdated_' + layer.id, fn, opt_ctx);
    this.startTileTimesUpdate_(layer);
  };


  /**
   * Unsubscribe for tile time updates for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to unsubscribe for time updates.
   * @param {Function=} opt_fn An optional callback function to match.
   * @param {Object=} opt_ctx An option context to match.
   * @return {number} The number of remaining listeners.
   */
  aeris.AerisAPI.prototype.offTileTimesUpdate =
      function(layer, opt_fn, opt_ctx) {
    var count = this.off('tileTimesUpdated_' + layer.id, opt_fn, opt_ctx);
    if (count === 0) {
      window.clearInterval(this.tileTimesUpdates_[layer.id]);
      this.tileTimesUpdates_[layer.id] = null;
    }
    return count;
  };


  /**
   * Start the auto-updating of tile times for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to start the auto-updating.
   * @private
   */
  aeris.AerisAPI.prototype.startTileTimesUpdate_ = function(layer) {
    if (!this.tileTimesUpdates_[layer.id]) {
      var self = this;
      var initTimesPromise = self.getTileTimes(layer);
      initTimesPromise.done(function(times) {
        var currentTime = times[0];
        self.tileTimesUpdates_[layer.id] = window.setInterval(function() {
          var timesPromise = self.getTileTimes(layer, true);
          timesPromise.done(function(times) {
            if (currentTime != times[0]) {
              self.trigger('tileTimesUpdated_' + layer.id, times);
              currentTime = times[0];
            }
          });
        }, 1000 * 60);
      });
    }
  };


  /**
   * The singleton.
   *
   * @type {aeris.AerisAPI}
   * @private
   */
  aeris.AerisAPI.instance_ = null;


  /**
   * Get the singleton object of an AerisAPI.
   *
   * @return {aeris.AerisAPI}
   */
  aeris.AerisAPI.getInstance = function() {
    if (!aeris.AerisAPI.instance_)
      aeris.AerisAPI.instance_ = new aeris.AerisAPI();
    return aeris.AerisAPI.instance_;
  };


  /**
   * Get the times for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to get the times for.
   * @param {boolean=} opt_refresh Optionally force a refresh of the times.
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.getTileTimes = function(layer, opt_refresh) {
    return aeris.AerisAPI.getInstance().getTileTimes(layer, opt_refresh);
  };


  return aeris.AerisAPI;

});
