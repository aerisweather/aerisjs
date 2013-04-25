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
  aeris.maps.openlayers.layerstrategies.Tile = function(aerisMap) {


    aeris.maps.LayerStrategy.call(this, aerisMap);

  }
  aeris.inherits(aeris.maps.openlayers.layerstrategies.Tile,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.setBaseLayer =
      function(layer) {
    this.ensureLayer_(layer);
    this.map.setBaseLayer(layer.openlayers_);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayer =
      function(layer) {
    this.ensureLayer_(layer);
  };


  /**
   * Ensure that the layer is properly configured and applied to the map.
   *
   * @param {aeris.maps.Tile} layer A Tile Layer to get required attributes.
   * @return {undefined}
   * @private
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.ensureLayer_ =
      function(layer) {
    if (!layer.openlayers_) {
      var urls = this.createUrls(layer);
      var res = [];
      for (var i = layer.minZoom; i <= layer.maxZoom; i++) {
        res.push(i);
      }
      layer.openlayers_ = new OpenLayers.Layer.XYZ(layer.name, urls, {
        isBaseLayer: false,
        sphericalMercator: true,
        wrapDateLine: true,
        transitionEffect: 'resize'
      });
      this.map.addLayer(layer.openlayers_);
    }
  };


  /**
   * Create the URLs for loading tiles.
   *
   * @param {aeris.maps.Tile} layer A Tile Layer to get required attributes.
   * @return {Array.<string>} An array of URLs
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls =
      function(layer) {
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
  aeris.maps.openlayers.layerstrategies.Tile.prototype.showLayer =
      function(layer) {
    layer.openlayers_.setVisibility(true);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.hideLayer =
      function(layer) {
    layer.openlayers_.setVisibility(false);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayerOpacity =
      function(layer, opacity) {
    layer.openlayers_.setOpacity(opacity);
  };


  return aeris.maps.openlayers.layerstrategies.Tile;

});
