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
      function(aerisMap, layer, data) {


    aeris.maps.openlayers.layerstrategies.Tile.call(this, aerisMap, layer,
                                                    data);

  };
  aeris.inherits(aeris.maps.openlayers.layerstrategies.AerisInteractiveTile,
                 aeris.maps.openlayers.layerstrategies.Tile);


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      setBaseLayer = function() {
    var that = this;
    var layer = this.layer;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.openlayers.layerstrategies.Tile.prototype.setBaseLayer.
          call(that);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      setLayer = function() {
    var that = this;
    var layer = this.layer;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayer.call(that);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      createUrls = function() {
    var urls = aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls.
        call(this);
    var length = urls.length;
    for (var i = 0; i < length; i++) {
      var url = urls[i];
      url = url.replace(/\{t\}/, this.layer.time);
      urls[i] = url;
    }
    return urls;
  };


  return aeris.maps.openlayers.layerstrategies.AerisInteractiveTile;

});
