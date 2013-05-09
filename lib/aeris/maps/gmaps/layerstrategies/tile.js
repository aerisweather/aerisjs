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
  aeris.maps.gmaps.layerstrategies.Tile = function() {
    aeris.maps.LayerStrategy.call(this);


    /**
     * The node index of the next added tile layer.
     *
     * @type {number}
     * @protected
     */
    //this.uncontrolledIndex = 0;


    /**
     * The position of the layer in the Google Map's overlays.
     *
     * @type {number}
     * @protected
     */
    //this.position = null;

  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.Tile,
                 aeris.maps.LayerStrategy);


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

    var url = layer.url
    url = url.replace(/\{d\}/, subdomain);
    url = url.replace(/\{z\}/, zfactor);
    url = url.replace(/\{x\}/, coord.x);
    url = url.replace(/\{y\}/, coord.y);

    return url;
  };


  /**
   * @param {Node} div The div container for the layer.
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.showLayer =
      function(div) {
    div.style.display = 'block';
  };


  /**
   * @param {} div The div container for the layer.
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.hideLayer =
      function(div) {
    div.style.display = 'none';
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.setLayerOpacity =
      function(layer, opacity) {
    layer.setOpacity(opacity);
  };


  /**
   * Get the div of a specific layer.
   *
   * @return {Element}
   */
  aeris.maps.gmaps.layerstrategies.Tile.prototype.getDiv = function(index) {
    index = index || this.getData('index');
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
    length = uncontrolledDiv.childNodes.length;
    var j = 0;
    var returnNode = null;
    for (var i = 0; i < length; i++) {
      var node = uncontrolledDiv.childNodes[i].childNodes[0].childNodes[0];
      if (node.childNodes.length === 0)
        continue;
      if (j === index) {
        returnNode = uncontrolledDiv.childNodes[i]
        break;
      }
      j++;
    }
    return returnNode;
  }


  return aeris.maps.gmaps.layerstrategies.Tile;

});
