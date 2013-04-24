define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support of Tile layer with
   *               OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layermanager.Tile');


  /**
   * A strategy for support of Tile layer with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerManagerStrategy}
   */
  aeris.maps.openlayers.layermanager.Tile = function(aerisMap) {


    aeris.maps.LayerManagerStrategy.call(this, aerisMap);

  }
  aeris.inherits(aeris.maps.openlayers.layermanager.Tile,
                 aeris.maps.LayerManagerStrategy);


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.Tile.prototype.setBaseLayer =
      function(layer) {
    this.ensureLayer_(layer);
    this.map.setBaseLayer(layer.openlayers_);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.Tile.prototype.setLayer =
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
  aeris.maps.openlayers.layermanager.Tile.prototype.ensureLayer_ =
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
  aeris.maps.openlayers.layermanager.Tile.prototype.createUrls =
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
  aeris.maps.openlayers.layermanager.Tile.prototype.showLayer =
      function(layer) {
    layer.openlayers_.setVisibility(true);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.Tile.prototype.hideLayer =
      function(layer) {
    layer.openlayers_.setVisibility(false);
  };


  return aeris.maps.openlayers.layermanager.Tile;

});
