define(['aeris', 'base/layerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support Tile layer with Google
   *               Maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.Tile');


  /**
   * A strategy for support Tile layers with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   */
  aeris.maps.gmaps.layerstrategies.Tile = function(aerisMap, layer, data) {


    aeris.maps.LayerStrategy.call(this, aerisMap, layer, data);


    /**
     * The node index of the next added tile layer.
     *
     * @type {number}
     * @private
     */
    this.uncontrolledIndex_ = 0;

  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.Tile,
                 aeris.maps.LayerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.setBaseLayer = function() {
    this.ensureLayer_();
    this.map.setMapTypeId(this.layer.name);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.setLayer = function() {
    this.ensureLayer_();
    this.map.overlayMapTypes.push(this.getData('gmap'));
    this.setData('index', this.uncontrolledIndex_++);
  };


  /**
   * Generate MapTypeOptions for Google Maps.
   *
   * @return {Object} Generated MapTypeOptions
   * @private
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.createMapTypeOptions_ =
      function() {
    var that = this;
    var layer = this.layer;
    var mapTypeOptions = {
      getTileUrl: function(coord, zoom) {
        return that.createUrl(coord, zoom);
      },
      tileSize: new google.maps.Size(256, 256),
      minZoom: layer.minZoom,
      maxZoom: layer.maxZoom
    };

    return mapTypeOptions;
  };


  /**
   * Ensure that the layer is properly configured at applied to a map.
   *
   * @return {undefined}
   * @private
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.ensureLayer_ = function() {
    if (!this.getData('gmap')) {
      var mapTypeOptions = this.createMapTypeOptions_(this.layer);
      this.setData('gmap', new google.maps.ImageMapType(mapTypeOptions));
      this.map.mapTypes.set(this.layer.name, this.getData('gmap'));
    }
  };


  /**
   * Create the URL for loading tiles.
   *
   * @param {google.maps.Point} coord The starting coordinate of a tile.
   * @param {number} zoom The current map zoom level.
   * @return {string} The URL for loading a specific tile.
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.createUrl =
      function(coord, zoom) {
    var layer = this.layer;

    var zfactor = layer.zoomFactor(zoom);

    var subdomain = layer.subdomains[Math.floor(Math.random() *
                                                layer.subdomains.length)];

    var url = layer.url
    url = url.replace(/\{d\}/, subdomain);
    url = url.replace(/\{z\}/, zfactor);
    url = url.replace(/\{x\}/, coord.x);
    url = url.replace(/\{y\}/, coord.y);

    return url;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.showLayer = function() {
    var div = this.getDiv_();
    div.style.display = 'block';
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.hideLayer = function() {
    var div = this.getDiv_();
    div.style.display = 'none';
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.setLayerOpacity =
      function(opacity) {
    this.getData('gmap').setOpacity(opacity);
  };


  /**
   * Get the div of a specific layer.
   *
   * @return {Element}
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.getDiv_ = function() {
    var index = this.getData('index');
    var mapDiv = this.map.getDiv().childNodes[0].childNodes[0].childNodes[0];
    var uncontrolledDiv = null;
    var length = mapDiv.childNodes.length;
    for (var i = 0; i < length; i++) {
      var node = mapDiv.childNodes[i];
      if (parseInt(node.style.zIndex) == 100) {
        uncontrolledDiv = node;
        break;
      }
    }
    return uncontrolledDiv.childNodes[index];
  }


  return aeris.maps.gmaps.layerstrategies.Tile;

});
