define(['aeris', 'aeris/jsonp', 'aeris/promise', './tile'], function(aeris) {

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
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile =
      function(aerisMap, layer, data) {


    aeris.maps.openlayers.layerstrategies.Tile.call(this, aerisMap, layer,
                                                    data);

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.AerisInteractiveTile,
                 aeris.maps.openlayers.layerstrategies.Tile);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      setBaseLayer = function() {
    var that = this;
    var time = this.getTime();
    time.done(function() {
      aeris.maps.openlayers.layerstrategies.Tile.prototype.setBaseLayer.
          call(that);
    });
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      setLayer = function() {
    var that = this;
    var time = this.getTime();
    time.done(function() {
      aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayer.call(that);
    });
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      createUrls = function(time) {
    time = time || this.layer.time;
    var urls = aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls.
        call(this);
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
    var that = this;
    var time = this.getTime();
    time.done(function(times) {
      var animTimes = [];
      for (var i = 9; i > 0; i--) {
        animTimes.push(times.files[i].time);
      }
      animTimes.push('CURRENT');
      that.animate_(animTimes);
    });
  };


  /**
   * Animate over an array of specified times.
   *
   * @param {Array.<string>} times An array of times to animate over.
   * @return {undefined}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      animate_ = function(times) {
    var length = times.length;
    for (var i = 0; i < length; i++) {
      var time = times[i];
      if (time == 'CURRENT')
        continue;
      var urls = this.createUrls(time);
      var layer = new OpenLayers.Layer.XYZ(this.layer.name + '_' + time,
                                           urls, {
                                             isBaseLayer: false,
                                             sphericalMercator: true,
                                             wrapDataLine: true,
                                             transitionEffect: 'resize',
                                             visibility: false
                                           });
      this.setData('olmap_' + time, layer);
      this.map.addLayer(layer);
    }
    this.animateInterval_(times);
  };


  /**
   * Create animation interval for looping over an array of specified times.
   *
   * @param {Array.<string>} times An array of time to animate over.
   * @return {undefined}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      animateInterval_ = function(times) {
    this.setData('olmap_CURRENT', this.getData('olmap'));
    var that = this;
    var next = 0;
    window.setInterval(function() {
      var layer = that.getData('olmap');
      var time = times[next];
      that.hideLayer();
      that.setData('olmap', that.getData('olmap_' + time));
      that.showLayer();
      next = (next + 1) % times.length;
    }, 300);
  };


  /**
   * Get the metadata times for the layer and call callback when completed.
   *
   * @param {Function} callback
   * @return {undefined}
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      getTime = function(callback) {
    var that = this;
    var layer = this.layer;
    var timePromise = this.getData('timePromise');
    if (!timePromise) {
      timePromise = new aeris.Promise();
      aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
        that.setData('times', data);
        layer.time = data.files[0].time;
        timePromise.resolve(data);
      }, 'radarTimes');
      this.setData('timePromise', timePromise);
    }
    return timePromise;
  };


  return aeris.maps.openlayers.layerstrategies.AerisInteractiveTile;

});
