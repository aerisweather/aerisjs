define([
  'aeris', 'aeris/jsonp', 'aeris/promise', './tile',
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
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile =
      function(aerisMap, layer, data) {


    aeris.maps.openlayers.layerstrategies.Tile.call(this, aerisMap, layer,
                                                    data);


    /**
     * Layer's animation object.
     *
     * @type {aeris.maps.openlayers.animations.AerisInteractiveTile}
     * @private
     */
    this.animation_ =
        new aeris.maps.openlayers.animations.AerisInteractiveTile(this);

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
    return this.animation_;
  };


  /**
   * Get the metadata times for the layer and return as a promise.
   *
   * @return {undefined}
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
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


  return aeris.maps.openlayers.layerstrategies.AerisInteractiveTile;

});
