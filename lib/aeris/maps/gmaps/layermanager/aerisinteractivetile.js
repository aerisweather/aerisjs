define(['aeris', 'base/layermanagerstrategy'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for supporting Aeris Interactive
   *               Tiles with Google maps.
   */


  aeris.provide('aeris.maps.gmaps.layermanager.AerisInteractiveTile');


  /**
   * A strategy for supporting Aeris Interactive Tiles with Google maps.
   *
   * @const
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile = {};


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile.setBaseLayer =
      function(map, layer) {
    aeris.jsonp.get('http://tile.aerisapi.com/' +
                    aeris.config.apiId + '_' + aeris.config.apiKey +
                    '/radar.jsonp',
      {}, function(data) {
        var time = data.files[0].time;
        aeris.maps.gmaps.layermanager.AerisInteractiveTile.ensureLayer_(map,
                                                                        layer);
        map.setMapTypeId(layer.name);
      }, 'radarTimes');
  };


  /**
   * @override
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile.setLayer =
      function(map, layer) {
    aeris.jsonp.get('http://tile.aerisapi.com/' +
                    aeris.config.apiId + '_' + aeris.config.apiKey +
                    '/radar.jsonp',
      {}, function(data) {
        var time = data.files[0].time;
        aeris.maps.gmaps.layermanager.AerisInteractiveTile.ensureLayer_(map,
                                                                        layer,
                                                                        time);
        map.overlayMapTypes.push(layer.gmaps_);
      }, 'radarTimes');
  };


  /**
   * Generate MapTypeOptions for Google Maps.
   *
   * @param {aeris.maps.AerisInteractiveTile} layer An Aeris Interactive Tile
   *     Layer to get required attributes.
   * @param {string} time Timestamp to use for interpolation of tile url.
   * @return {Object} Generated MapTypeOptions
   * @private
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile.createMapTypeOptions_ =
      function(layer, time) {
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
        url = url.replace(/\{t\}/, time);

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
   * @param {aeris.maps.AerisInteractiveTile} layer An Aeris Interactive Tile
   *     Layer to get required attributes.
   * @param {string} time Timestamp to use for interpolation of tile url.
   * @return {undefined}
   * @private
   */
  aeris.maps.gmaps.layermanager.AerisInteractiveTile.ensureLayer_ =
      function(map, layer, time) {
    if (!layer.gmaps_) {
      var mapTypeOptions =
          aeris.maps.gmaps.layermanager.AerisInteractiveTile.
              createMapTypeOptions_(layer, time);
      layer.gmaps_ = new google.maps.ImageMapType(mapTypeOptions);
      map.mapTypes.set(layer.name, layer.gmaps_);
    }
  };


  return aeris.maps.gmaps.layermanager.AerisInteractiveTile;

});
