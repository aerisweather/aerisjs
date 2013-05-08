define([
  'aeris', 'aeris/aerisapi', './tile',
  'base/layerstrategies/mixins/aerisinteractivetile',
  '../animations/aerisinteractivetile'
], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with Google maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with Google maps.
   *
   * @constructor
   * @extends {aeris.maps.gmaps.layerstrategies.Tile}
   * @extends {aeris.maps.layerstrategies.mixins.AerisInteractiveTile}
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile = function() {
    aeris.maps.gmaps.layerstrategies.Tile.call(this);


    /**
     * Layer's animation object.
     *
     * @type {aeris.maps.gmaps.animations.AerisInteractiveTile}
     * @private
     */
    //this.animation_ =
    //    new aeris.maps.gmaps.animations.AerisInteractiveTile(this);


    /**
     * Auto-update interval.
     *
     * @type {number}
     * @private
     */
    //this.autoUpdate_ = null;

  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.AerisInteractiveTile,
                 aeris.maps.gmaps.layerstrategies.Tile);
  aeris.extend(
    aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype,
    aeris.maps.layerstrategies.mixins.AerisInteractiveTile);


   /**
    * @param {string} time A timestamp of the layer.
    * @override
    */
   aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
       createInstanceLayer = function(layer, time) {
     var options = this.createMapTypeOptions(layer, time);
     return aeris.maps.gmaps.layerstrategies.Tile.prototype.
         createInstanceLayer.call(this, layer, options);
   };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      setBaseLayer = function() {
    var that = this;
    var time = this.getTime();
    time.done(function() {
      aeris.maps.gmaps.layerstrategies.Tile.prototype.setBaseLayer.
          call(that);
    });
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.setLayer =
      function() {
    var that = this;
    var time = this.getTime();
    time.done(function() {
      aeris.maps.gmaps.layerstrategies.Tile.prototype.setLayer.call(that);
    });
  };


  /**
   * @param {string} time A timestamp of the layer.
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      createMapTypeOptions = function(layer, time) {
    var mapTypeOptions = aeris.maps.gmaps.layerstrategies.Tile.prototype.
        createMapTypeOptions.call(this, layer);
    if (time) {
      var that = this;
      mapTypeOptions.getTileUrl = function(coord, zoom) {
        return that.createUrl(coord, zoom, layer, time);
      };
    }

    return mapTypeOptions;
  };


  /**
   * @param {string} time A timestamp of the layer.
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.createUrl =
      function(coord, zoom, layer, time) {
    var url = aeris.maps.gmaps.layerstrategies.Tile.prototype.createUrl.
        call(this, coord, zoom, layer);
    url = url.replace(/\{t\}/, time);
    return url;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      animate = function() {
    return this.animation_;
  };


  /**
   * Get the metadata times for the layer and return as a promise.
   *
   * @param {boolean} refresh Refresh the time.
   * @return {undefined}
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
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
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      showLayer = function(time) {
    var div = this.getDiv(time);
    div.style.display = 'block';
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      hideLayer = function(time) {
    var div = this.getDiv(time);
    div.style.display = 'none';
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.getDiv =
      function(time) {
    return aeris.maps.gmaps.layerstrategies.Tile.prototype.getDiv.call(this,
      this.getData('index_' + time));
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      autoUpdate = function() {
    if (!this.autoUpdate_) {
      var that = this;
      var layer = this.layer;
      this.autoUpdate_ = window.setInterval(function() {
        var currentTime = layer.time;
        var time = that.getTime(true);
        time.done(function(data) {
          if (data.files[0].time != currentTime) {
            var layer = that.getData('olmap');
            that.map.overlayMapTypes.removeAt(that.position);
            that.setData('gmap', null);
            that.setLayer();
          }
        });
      }, 1000 * 60);
    }
  };


  return aeris.maps.gmaps.layerstrategies.AerisInteractiveTile;

});
