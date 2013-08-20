define([
  'aeris/util', './tile',
  'base/layerstrategies/mixins/aerisinteractivetile',
], function(_) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with OpenLayers.
   */


  _.provide('aeris.maps.openlayers.layerstrategies.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.openlayers.layerstrategies.Tile}
   * @extends {aeris.maps.layerstrategies.mixins.AerisInteractiveTile}
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile = function() {
    aeris.maps.openlayers.layerstrategies.Tile.call(this);
  };
  _.inherits(aeris.maps.openlayers.layerstrategies.AerisInteractiveTile,
                 aeris.maps.openlayers.layerstrategies.Tile);
  _.extend(
    aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype,
    aeris.maps.layerstrategies.mixins.AerisInteractiveTile);


   /**
    * @param {string} time A timestamp of the layer.
    * @override
    */
   aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
       createInstanceLayer = function(layer, time, opt_options) {
     var urls = this.createUrls(layer, time);
     return aeris.maps.openlayers.layerstrategies.Tile.prototype.
         createInstanceLayer.call(this, layer, opt_options, urls);
   };


  /**
   * @param {string} time A timestamp of the layer.
   * @override
   */
  aeris.maps.openlayers.layerstrategies.AerisInteractiveTile.prototype.
      createUrls = function(layer, time) {
    time = time || layer.time;
    var urls = aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls.
        call(this, layer);
    var length = urls.length;
    for (var i = 0; i < length; i++) {
      var url = urls[i];
      url = url.replace(/\{t\}/, time);
      urls[i] = url;
    }
    return urls;
  };


  return aeris.maps.openlayers.layerstrategies.AerisInteractiveTile;

});
