define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting OSM layer with Google
   *               Maps.
   */


  aeris.provide('aeris.maps.gmaps.layermanager.OSM');


  /**
   * A strategy for supporting OSM layers with Google Maps.
   *
   * @const
   */
  aeris.maps.gmaps.layermanager.OSM = {};


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.OSM.setBaseLayer =
      function(map, layer) {
    if (!layer.gmaps_) {
      var mapTypeOptions = {
        getTileUrl: function(coord, zoom) {
          var zfactor = Math.pow(2, zoom);

          var subdomains = ['a', 'b', 'c'];
          var subdomain = subdomains[Math.floor(Math.random() * 3)];

          var url = 'http://' + subdomain + '.tile.openstreetmap.org/' +
                    zoom + '/' + coord.x + '/' + coord.y + '.png';

          return url;
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 0,
        maxZoom: 18
      };
      layer.gmaps_ = new google.maps.ImageMapType(mapTypeOptions);
      map.mapTypes.set('osm', layer.gmaps_);
    }
    map.setMapTypeId('osm');
  };


  return aeris.maps.gmaps.layermanager.OSM;

});
