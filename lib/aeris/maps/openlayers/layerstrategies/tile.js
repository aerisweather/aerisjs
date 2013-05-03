define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support of Tile layer with
   *               OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.Tile');


  /**
   * A strategy for support of Tile layer with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.openlayers.layerstrategies.Tile =
      function(aerisMap, layer, data) {


    aeris.maps.LayerStrategy.call(this, aerisMap, layer, data);

  }
  aeris.inherits(aeris.maps.openlayers.layerstrategies.Tile,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.setBaseLayer =
      function() {
    this.ensureLayer_();
    this.map.setBaseLayer(this.getData('olmap'));
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayer = function() {
    this.ensureLayer_();
  };


  /**
   * Ensure that the layer is properly configured and applied to the map.
   *
   * @return {undefined}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.ensureLayer_ =
      function() {
    var layer = this.layer;
    if (!this.staticLayer_) {
      var urls = this.createUrls();
      var res = [];
      for (var i = layer.minZoom; i <= layer.maxZoom; i++) {
        res.push(i);
      }
      this.setData('olmap', new OpenLayers.Layer.XYZ(layer.name, urls, {
        isBaseLayer: false,
        sphericalMercator: true,
        wrapDateLine: true,
        transitionEffect: 'resize'
      }));
      this.map.addLayer(this.getData('olmap'));
      this.staticLayer_ = this.getData('olmap');
    }
  };


  /**
   * Create the URLs for loading tiles.
   *
   * @return {Array.<string>} An array of URLs
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls =
      function() {
    var layer = this.layer;
    var urls = [];
    var length = layer.subdomains.length;
    for (var i = 0; i < length; i++) {
      var subdomain = layer.subdomains[i];
      var url = layer.url;
      url = url.replace(/\{d\}/, subdomain);
      url = url.replace(/\{z\}/, '${z}');
      url = url.replace(/\{x\}/, '${x}');
      url = url.replace(/\{y\}/, '${y}');
      urls.push(url);
    }
    return urls;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.showLayer = function() {
    this.getData('olmap').setVisibility(true);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.hideLayer =
      function() {
    this.getData('olmap').setVisibility(false);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayerOpacity =
      function(opacity) {
    this.getData('olmap').setOpacity(opacity);
  };


  return aeris.maps.openlayers.layerstrategies.Tile;

});
