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
  };


  /**
   * Get the times for a specific layer.
   *
   * @param {aeris.maps.Layer} layer The layer to get the times for.
   * @return {aeris.Promise}
   */
  aeris.AerisAPI.getTileTimes = function(layer) {
    var promise = new aeris.Promise();
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
    return promise;
  };


  return aeris.AerisAPI;

});
