define(['aeris', 'aeris/jsonp', './tile'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layermanager.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.openlayers.layermanager.Tile}
   */
  aeris.maps.openlayers.layermanager.AerisInteractiveTile =
      function(aerisMap) {


    aeris.maps.openlayers.layermanager.Tile.call(this, aerisMap);

  };
  aeris.inherits(aeris.maps.openlayers.layermanager.AerisInteractiveTile,
                 aeris.maps.openlayers.layermanager.Tile);


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.AerisInteractiveTile.prototype.
      setBaseLayer = function(layer) {
    var that = this;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.openlayers.layermanager.Tile.prototype.setBaseLayer.
          call(that, layer);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.AerisInteractiveTile.prototype.setLayer =
      function(layer) {
    var that = this;
    aeris.jsonp.get(layer.metadataUrl, {}, function(data) {
      layer.time = data.files[0].time;
      aeris.maps.openlayers.layermanager.Tile.prototype.setLayer.
          call(that, layer);
    }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layermanager.AerisInteractiveTile.prototype.
      createUrls = function(layer) {
    var urls = aeris.maps.openlayers.layermanager.Tile.prototype.createUrls.
        call(this, layer);
    var length = urls.length;
    for (var i = 0; i < length; i++) {
      var url = urls[i];
      url = url.replace(/\{t\}/, layer.time);
      urls[i] = url;
    }
    return urls;
  };


  return aeris.maps.openlayers.layermanager.AerisInteractiveTile;

});
