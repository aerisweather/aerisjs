define(['aeris', 'aeris/jsonp', 'aeris/promise', './tile'], function(aeris) {

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
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile =
      function(aerisMap, layer, data) {


    aeris.maps.gmaps.layerstrategies.Tile.call(this, aerisMap, layer, data);

  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.AerisInteractiveTile,
                 aeris.maps.gmaps.layerstrategies.Tile);


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
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      createMapTypeOptions = function(time) {
    var mapTypeOptions = aeris.maps.gmaps.layerstrategies.Tile.prototype.
        createMapTypeOptions.call(this);
    if (time) {
      var that = this;
      mapTypeOptions.getTileUrl = function(coord, zoom) {
        return that.createUrl(coord, zoom, time);
      };
    }

    return mapTypeOptions;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.createUrl =
      function(coord, zoom, time) {
    time = time || this.layer.time
    var url = aeris.maps.gmaps.layerstrategies.Tile.prototype.createUrl.
        call(this, coord, zoom);
    url = url.replace(/\{t\}/, time);
    return url;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
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
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      animate_ = function(times) {
    var length = times.length;
    for (var i = 0; i < length; i++) {
      var time = times[i];
      if (time == 'CURRENT')
        continue;
      var mapTypeOptions = this.createMapTypeOptions(time);
      var layer = new google.maps.ImageMapType(mapTypeOptions);
      this.setData('gmap_' + time, layer);
      this.map.overlayMapTypes.push(layer);
      this.setData('index_' + time, this.uncontrolledIndex++);
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
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      animateInterval_ = function(times) {
    this.setData('gmap_CURRENT', this.getData('gmap'));
    var that = this;
    var next = 0;
    window.setInterval(function() {
      var layer = that.getData('gmap');
      var time = times[next];
      that.hideLayer(time);
      that.setData('gmap', that.getData('gmap_' + time));
      next = (next + 1) % times.length;
      that.showLayer(times[next]);
    }, 300);
  };


  /**
   * Get the metadata times for the layer and return as a promise.
   *
   * @return {undefined}
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      getTime = function() {
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


  return aeris.maps.gmaps.layerstrategies.AerisInteractiveTile;

});
