define([
  'aeris', 'aeris/jsonp', 'aeris/promise', 'aeris/events', './tile',
  '../animations/aerisinteractivetile'
], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.openlayers.layerstrategies.Tile}
   * @extends {aeris.Events}
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile = function() {
    aeris.maps.openlayers.layerstrategies.Tile.call(this);
    //aeris.Events.call(this);


    /**
     * Layer's animation object.
     *
     * @type {aeris.maps.openlayers.animations.AerisInteractiveTile}
     * @private
     */
    //this.animation_ =
    //    new aeris.maps.openlayers.animations.AerisInteractiveTile(this);


    /**
     * The current layer that represents the tile when static.
     *
     * @type {Object}
     * @private
     */
    //this.staticLayer_ = null;


    /**
     * Auto-update interval.
     *
     * @type {number}
     * @private
     */
    //this.autoUpdate_ = null;

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.AerisInteractiveTile,
                 aeris.maps.openlayers.layerstrategies.Tile);
  /*aeris.extend(
    aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype,
    aeris.Events.prototype);*/


   /**
    * @param {string} time A timestamp of the layer.
    * @override
    */
   aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
       createInstanceLayer = function(layer, time) {
     var urls = this.createUrls(layer, time);
     return aeris.maps.openlayers.layerstrategies.Tile.prototype.
         createInstanceLayer.call(this, layer, urls);
   };


  /**
   * @param {string} time A timestamp of the layer.
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      createUrls = function(layer, time) {
    time = time || layer.time;
    var urls = aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls.
        call(this, layer);
    var length = urls.length;
    for (var i = 0; i < length; i++) {
      var url = urls[i];
      url = url.replace(/\{t\}/, time);
      urls[i] = url;
    }
    return urls;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      animate = function() {
    return this.animation_;
  };


  /**
   * Get the metadata times for the layer and return as a promise.
   *
   * @param {boolean} refresh Refresh the time.
   * @return {aeris.Promise}
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      getTime = function(refresh) {
    var that = this;
    var layer = this.layer;
    var timePromise = this.getData('timePromise');
    if (!timePromise || refresh) {
      timePromise = new aeris.Promise();
      aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
        layer.time = data.files[0].time;
        timePromise.resolve(data);
      }, 'radarTimes');
      this.setData('timePromise', timePromise);
    }
    return timePromise;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      getTimes = function(layer) {
    var promise = new aeris.Promise();
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      promise.resolve(data);
    }, 'radarTimes');
    return promise;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      autoUpdate = function() {
    if (!this.autoUpdate_) {
      var that = this;
      var layer = this.layer;
      this.autoUpdate_ = window.setInterval(function() {
        var currentTime = layer.time;
        var time = that.getTime(true);
        time.done(function(data) {
          if (data.files[0].time != currentTime) {
            that.staticLayer_.destroy();
            that.staticLayer_ = null;
            that.setData('olmap', null);
            that.setLayer();
            that.trigger('autoUpdate', data);
          }
        });
      }, 1000 * 60);
    }
  };


  return aeris.maps.openlayers.layerstrategies.AerisInteractiveTile;

});
