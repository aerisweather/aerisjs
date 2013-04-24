define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support Tile layer with Google
   *               Maps.
   */


  aeris.provide('aeris.maps.gmaps.layermanager.Tile');


  /**
   * A strategy for support Tile layers with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerManagerStrategy}
   */
  aeris.maps.gmaps.layermanager.Tile = function(aerisMap) {


    aeris.maps.LayerManagerStrategy.call(this, aerisMap);


    /**
     * The node index of the next added tile layer.
     *
     * @type {number}
     * @private
     */
    this.uncontrolledIndex_ = 0;

  };
  aeris.inherits(aeris.maps.gmaps.layermanager.Tile,
                 aeris.maps.LayerManagerStrategy);


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.setBaseLayer = function(layer) {
    this.ensureLayer_(layer);
    this.map.setMapTypeId(layer.name);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.setLayer = function(layer) {
    this.ensureLayer_(layer);
    this.map.overlayMapTypes.push(this.getLayerData(layer, 'layer'));
    this.setLayerData(layer, 'index', this.uncontrolledIndex_++);
  };


  /**
   * Generate MapTypeOptions for Google Maps.
   *
   * @param {aeris.maps.Tile} layer A Tile Layer to get required attributes.
   * @return {Object} Generated MapTypeOptions
   * @private
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.createMapTypeOptions_ =
      function(layer) {
    var that = this;
    var mapTypeOptions = {
      getTileUrl: function(coord, zoom) {
        return that.createUrl(layer, coord, zoom);
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
   * @param {aeris.maps.Tile} layer A Tile Layer to get required attributes.
   * @return {undefined}
   * @private
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.ensureLayer_ = function(layer) {
    if (!this.getLayerData(layer, 'layer')) {
      var mapTypeOptions = this.createMapTypeOptions_(layer);
      this.setLayerData(layer, 'layer',
                        new google.maps.ImageMapType(mapTypeOptions));
      this.map.mapTypes.set(layer.name, this.getLayerData(layer, 'layer'));
    }
  };


  /**
   * Create the URL for loading tiles.
   *
   * @param {aeris.maps.Tile} layer A Tile Layer to get required attributes.
   * @param {google.maps.Point} coord The starting coordinate of a tile.
   * @param {number} zoom The current map zoom level.
   * @return {string} The URL for loading a specific tile.
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.createUrl =
      function(layer, coord, zoom) {
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
  aeris.maps.gmaps.layermanager.Tile.prototype.showLayer = function(layer) {
    var div = this.getDiv_(layer);
    div.style.display = 'block';
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.hideLayer = function(layer) {
    var div = this.getDiv_(layer);
    div.style.display = 'none';
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.setLayerOpacity =
      function(layer, opacity) {
    this.getLayerData(layer, 'layer').setOpacity(opacity);
  };


  /**
   * Get the div of a specific layer.
   *
   * @param {aeris.maps.Tile} layer The tile layer of the div being requested.
   * @return {Element}
   */
  aeris.maps.gmaps.layermanager.Tile.prototype.getDiv_ = function(layer) {
    var index = this.getLayerData(layer, 'index');
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


  return aeris.maps.gmaps.layermanager.Tile;

});
