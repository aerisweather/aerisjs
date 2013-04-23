define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview fileoverview
   */


  aeris.provide('aeris.maps.gmaps.layermanager.Tile');


  /**
   * @const
   */
  aeris.maps.gmaps.layermanager.Tile = {};


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.Tile.setBaseLayer = function(map, layer) {
    if (!layer.gmaps_) {
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
      layer.gmaps_ = new google.maps.ImageMapType(mapTypeOptions);
      map.mapTypes.set('osm', layer.gmaps_);
    }
    map.setMapTypeId('osm');
  };


  return aeris.maps.gmaps.layermanager.Tile;

});
