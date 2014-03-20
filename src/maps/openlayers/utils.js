define([
  'aeris/util'
], function(_) {
  /**
   * Utility library for OpenLayers.
   *
   * @alias aeris.maps.openlayers.utils
   */
  var mapUtil = {
    /**
     * @param {Object} evt OpenLayers event object.
     * @param {OpenLayers.Map} map
     * @return {aeris.maps.LatLon} Simple lat/lon array.
     * @method getLatLonFromEvent
     */
    getLatLonFromEvent: function(evt, map) {
      var lonLat = map.getLonLatFromPixel(evt.xy);
      var lonLatGeo = lonLat.clone();

      if (map.getProjection() != 'EPSG:4326') {
        lonLatGeo.transform(
          map.getProjectionObject(),
          new OpenLayers.Projection('EPSG:4326')
        );
      }

      return [lonLatGeo.lat, lonLatGeo.lon];
    },

    arrayToLonLat: function(latLon) {
      var lonLat = new OpenLayers.LonLat(latLon[1], latLon[0]);
      lonLat.transform(
        new OpenLayers.Projection('EPSG:4326'),
        new OpenLayers.Projection('EPSG:900913')
      );
      return lonLat;
    },

    lonLatToArray: function(lonLat) {
      var lonLatGeo = lonLat.clone();
      lonLatGeo.transform(
        new OpenLayers.Projection('EPSG:900913'),
        new OpenLayers.Projection('EPSG:4326')
      );

      return [lonLatGeo.lat, lonLatGeo.lon];
    },

    boundsToArray: function(bounds) {
      var neLonLat = new OpenLayers.LonLat(bounds.left, bounds.top);
      var swLonLat = new OpenLayers.LonLat(bounds.right, bounds.bottom);
      var ne = this.lonLatToArray(neLonLat);
      var sw = this.lonLatToArray(swLonLat);

      return [sw, ne];
    },

    listenTo: function(view, eventObj, ctx) {
      _.each(eventObj, function(handler, topic) {
        view.events.register(topic, ctx, handler);
      }, this);
    }
  };

  return mapUtil;
});
