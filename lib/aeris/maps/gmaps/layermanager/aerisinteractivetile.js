define(['aeris', 'aeris/jsonp', './tile'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with Google maps.
   */


  aeris.provide('aeris.maps.gmaps.layermanager.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with Google maps.
   *
   * @constructor
   * @extends {aeris.maps.gmaps.layermanager.Tile}
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile = function(aerisMap) {


    aeris.maps.gmaps.layermanager.Tile.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.gmaps.layermanager.AerisInteractiveTile,
                 aeris.maps.gmaps.layermanager.Tile);


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile.prototype.setBaseLayer =
      function(layer) {
    var that = this;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.gmaps.layermanager.Tile.prototype.setBaseLayer.
          call(that, layer);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile.prototype.setLayer =
      function(layer) {
    var that = this;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.gmaps.layermanager.Tile.prototype.setLayer.call(that, layer);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile.prototype.createUrl =
      function(layer, coord, zoom) {
    var url = aeris.maps.gmaps.layermanager.Tile.prototype.createUrl.
        call(this, layer, coord, zoom);
    url = url.replace(/\{t\}/, layer.time);
    return url;
  };


  return aeris.maps.gmaps.layermanager.AerisInteractiveTile;

});
