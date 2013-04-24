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
    this.map.overlayMapTypes.push(layer.gmaps_);
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
    var mapTypeOptions = {
      getTileUrl: function(coord, zoom) {
        return layer.getTileUrl(coord.x, coord.y, zoom);
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
    if (!layer.gmaps_) {
      var mapTypeOptions = this.createMapTypeOptions_(layer);
      layer.gmaps_ = new google.maps.ImageMapType(mapTypeOptions);
      this.map.mapTypes.set(layer.name, layer.gmaps_);
    }
  };


  return aeris.maps.gmaps.layermanager.Tile;

});
