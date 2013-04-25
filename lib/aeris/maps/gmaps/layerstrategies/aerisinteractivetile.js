define(['aeris', 'aeris/jsonp', './tile'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with Google maps.
   */


  aeris.provide('aeris.maps.gmaps.layerstrategies.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with Google maps.
   *
   * @constructor
   * @extends {aeris.maps.gmaps.layerstrategies.Tile}
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile =
      function(aerisMap, layer, data) {


    aeris.maps.gmaps.layerstrategies.Tile.call(this, aerisMap, layer, data);

  };
  aeris.inherits(aeris.maps.gmaps.layerstrategies.AerisInteractiveTile,
                 aeris.maps.gmaps.layerstrategies.Tile);


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.setBaseLayer =
      function() {
    var that = this;
    var layer = this.layer
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.gmaps.layerstrategies.Tile.prototype.setBaseLayer.
          call(that);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.setLayer =
      function() {
    var that = this;
    var layer = this.layer;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.gmaps.layerstrategies.Tile.prototype.setLayer.call(that);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.createUrl =
      function(coord, zoom) {
    var url = aeris.maps.gmaps.layerstrategies.Tile.prototype.createUrl.
        call(this, coord, zoom);
    url = url.replace(/\{t\}/, this.layer.time);
    return url;
  };


  return aeris.maps.gmaps.layerstrategies.AerisInteractiveTile;

});
