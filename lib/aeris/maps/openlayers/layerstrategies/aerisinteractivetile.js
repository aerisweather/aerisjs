define(['aeris', 'aeris/jsonp', './tile'], function(aeris) {

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
      function(aerisMap) {


    aeris.maps.openlayers.layerstrategies.Tile.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.AerisInteractiveTile,
                 aeris.maps.openlayers.layerstrategies.Tile);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      setBaseLayer = function(layer) {
    var that = this;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.openlayers.layerstrategies.Tile.prototype.setBaseLayer.
          call(that, layer);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.setLayer =
      function(layer) {
    var that = this;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayer.
          call(that, layer);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      createUrls = function(layer) {
    var urls = aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls.
        call(this, layer);
    var length = urls.length;
    for (var i = 0; i < length; i++) {
      var url = urls[i];
      url = url.replace(/\{t\}/, layer.time);
      urls[i] = url;
    }
    return urls;
  };


  return aeris.maps.openlayers.layerstrategies.AerisInteractiveTile;

});
