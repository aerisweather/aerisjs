define(['aeris', 'aeris/jsonp', 'aeris/promise'], function(aeris) {

  /**
   * @fileoverview Facade implementation of the Aeris API.
   */


  aeris.provide('aeris.AerisAPI');


  /**
   * Facade of the Aeris API.
   *
   * @constructor
   */
  aeris.AerisAPI = function() {


    /**
     * A cache of promises per tile type.
     *
     * @type {Object.<string,aeris.Promise>}
     * @private
     */
    this.timePromises_ = {};

  };


  /**
   * Get the times for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to get the times for.
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.prototype.getTileTimes = function(layer) {
    var promise = this.timePromises_[layer.tileType];
    if (!promise) {
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
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.getTileTimes = function(layer) {
    return aeris.AerisAPI.getInstance().getTileTimes(layer);
  };


  return aeris.AerisAPI;

});
