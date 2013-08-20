define(['aeris/util', 'base/layerstrategy', './mixins/div'], function(_) {

  /**
   * @fileoverview Layer manager strategy for support Tile layer with Google
   *               Maps.
   */


  _.provide('aeris.maps.gmaps.layerstrategies.Tile');


  /**
   * A strategy for support Tile layers with Google Maps.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.layerstrategies.mixins.Div}
   */
  aeris.maps.gmaps.layerstrategies.Tile = function() {
    aeris.maps.LayerStrategy.call(this);
  };
  _.inherits(aeris.maps.gmaps.layerstrategies.Tile,
                 aeris.maps.LayerStrategy);
  _.extend(aeris.maps.gmaps.layerstrategies.Tile.prototype,
               aeris.maps.gmaps.layerstrategies.mixins.Div);


  /**
   * @param {Object} opt_options An option mapTypeOptions
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.createInstanceLayer =
      function(layer, opt_options) {
    var mapTypeOptions = opt_options || this.createMapTypeOptions(layer);
    var instanceLayer = new google.maps.ImageMapType(mapTypeOptions);
    return instanceLayer;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.registerInstanceLayer = 
      function(instanceLayer, map) {
    map.mapTypes.set(instanceLayer.name, instanceLayer);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.unregisterInstanceLayer =
      function(instanceLayer, map) {
    map.mapTypes.set(instanceLayer.name, null);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.setBaseInstanceLayer = 
      function(instanceLayer, map) {
    map.setMapTypeId(instanceLayer.name);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.setInstanceLayer =
      function(instanceLayer, map) {
    map.overlayMapTypes.push(instanceLayer);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.removeInstanceLayer =
      function(instanceLayer, map) {
    var layers = map.overlayMapTypes.getArray();
    var length = layers.length;
    for (var i = 0; i < length; i++) {
      var layer = layers[i];
      if (layer === instanceLayer) {
        map.overlayMapTypes.removeAt(i);
        break;
      }
    }
  };


  /**
   * Generate MapTypeOptions for Google Maps.
   *
   * @param {aeris.maps.Layer} layer The Aeris Layer to gather information.
   * @return {Object} Generated MapTypeOptions
   * @protected
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.createMapTypeOptions =
      function(layer) {
    var that = this;
    var mapTypeOptions = {
      getTileUrl: function(coord, zoom) {
        return that.createUrl(coord, zoom, layer);
      },
      tileSize: new google.maps.Size(256, 256),
      minZoom: layer.minZoom,
      maxZoom: layer.maxZoom,
      name : layer.name
    };

    return mapTypeOptions;
  };


  /**
   * Create the URL for loading tiles.
   *
   * @param {google.maps.Point} coord The starting coordinate of a tile.
   * @param {number} zoom The current map zoom level.
   * @param {aeris.maps.Layer} layer The Aeris Layer to gather information.
   * @return {string} The URL for loading a specific tile.
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.createUrl =
      function(coord, zoom, layer) {
    var zfactor = layer.zoomFactor(zoom);

    var subdomain = layer.subdomains[Math.floor(Math.random() *
                                                layer.subdomains.length)];

    var url = layer.getUrl();
    url = url.replace(/\{d\}/, subdomain);
    url = url.replace(/\{z\}/, zfactor);
    url = url.replace(/\{x\}/, coord.x);
    url = url.replace(/\{y\}/, coord.y);

    return url;
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.setLayerOpacity =
      function(layer, opacity) {
    layer.setOpacity(opacity);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.initializeLayer =
      function(layer, instanceLayer) {
    google.maps.event.addListenerOnce(instanceLayer, 'tilesloaded',
      function() {
        layer.initialized.resolve();
      });
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.getDiv = function(map) {
    var div = map.getPanes().mapPane.lastChild;
    return div;
  };


  return aeris.maps.gmaps.layerstrategies.Tile;

});
