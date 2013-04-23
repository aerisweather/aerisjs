define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support Tile layer with Google
   *               Maps.
   */


  aeris.provide('aeris.maps.gmaps.layermanager.Tile');


  /**
   * A strategy for support Tile layers with Google Maps.
   *
   * @const
   */
  aeris.maps.gmaps.layermanager.Tile = {};


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.Tile.setBaseLayer = function(map, layer) {
    aeris.maps.gmaps.layermanager.Tile.ensureLayer_(map, layer);
    map.setMapTypeId(layer.name);
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.Tile.setLayer = function(map, layer) {
    aeris.maps.gmaps.layermanager.Tile.ensureLayer_(map, layer);
    map.overlayMapTypes.push(layer.gmaps_);
  };


  /**
   * Generate MapTypeOptions for Google Maps.
   *
   * @param {aeris.maps.Tile} layer A Tile Layer to get required attributes.
   * @return {Object} Generated MapTypeOptions
   * @private
   */
  aeris.maps.gmaps.layermanager.Tile.createMapTypeOptions_ = function(layer) {
    var mapTypeOptions = {
      getTileUrl: function(coord, zoom) {
        var zfactor = layer.zoomFactor(zoom);

        var subdomain = layer.subdomains[Math.floor(Math.random() * 
                                                   layer.subdomains.length)];

        var url = layer.url;
        url = url.replace(/\{d\}/, subdomain);
        url = url.replace(/\{z\}/, zfactor);
        url = url.replace(/\{x\}/, coord.x);
        url = url.replace(/\{y\}/, coord.y);

        return url;
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
   * @param {Object} map The map to ensure the layer has been created for.
   * @param {aeris.maps.Tile} layer A Tile Layer to get required attributes.
   * @return {undefined}
   * @private
   */
  aeris.maps.gmaps.layermanager.Tile.ensureLayer_ = function(map, layer) {
    if (!layer.gmaps_) {
      var mapTypeOptions =
          aeris.maps.gmaps.layermanager.Tile.createMapTypeOptions_(layer);
      layer.gmaps_ = new google.maps.ImageMapType(mapTypeOptions);
      map.mapTypes.set(layer.name, layer.gmaps_);
    }
  };


  return aeris.maps.gmaps.layermanager.Tile;

});
