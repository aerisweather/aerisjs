define([
  'aeris/util',
  'gmaps/layerstrategies/tile',
  'base/layerstrategies/mixins/aerisinteractivetile'
], function(_) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with Google maps.
   */


  _.provide('aeris.maps.gmaps.layerstrategies.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with Google maps.
   *
   * @constructor
   * @extends {aeris.maps.gmaps.layerstrategies.Tile}
   * @extends {aeris.maps.layerstrategies.mixins.AerisInteractiveTile}
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile = function() {
    aeris.maps.gmaps.layerstrategies.Tile.call(this);
  };
  _.inherits(aeris.maps.gmaps.layerstrategies.AerisInteractiveTile,
                 aeris.maps.gmaps.layerstrategies.Tile);
  _.extend(
    aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype,
    aeris.maps.layerstrategies.mixins.AerisInteractiveTile);


   /**
    * @param {string} time A timestamp of the layer.
    * @override
    */
   aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
       createInstanceLayer = function(layer, time, opt_options) {
     var options = this.createMapTypeOptions(layer, time);
     opt_options = opt_options || {};
     _.extend(options, opt_options);
     return aeris.maps.gmaps.layerstrategies.Tile.prototype.
         createInstanceLayer.call(this, layer, options);
   };


  /**
   * @param {string} time A timestamp of the layer.
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.
      createMapTypeOptions = function(layer, time) {
    var mapTypeOptions = aeris.maps.gmaps.layerstrategies.Tile.prototype.
        createMapTypeOptions.call(this, layer);
    if (time) {
      var that = this;
      mapTypeOptions.getTileUrl = function(coord, zoom) {
        return that.createUrl(coord, zoom, layer, time);
      };
    }

    return mapTypeOptions;
  };


  /**
   * @param {string} time A timestamp of the layer.
   * @override
   */
  aeris.maps.gmaps.layerstrategies.AerisInteractiveTile.prototype.createUrl =
      function(coord, zoom, layer, time) {
    var url = aeris.maps.gmaps.layerstrategies.Tile.prototype.createUrl.
        call(this, coord, zoom, layer);
    url = url.replace(/\{t\}/, time);
    return url;
  };


  return aeris.maps.gmaps.layerstrategies.AerisInteractiveTile;

});
