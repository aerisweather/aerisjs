define(
  /**
   * Utility library for OpenLayers.
   *
   * @alias aeris.maps.openlayers.utils
   */
  {
    /**
     * @param {Object} evt OpenLayers event object.
     * @param {OpenLayers.Map} map
     * @return {Array.<number>} Simple lat/lon array.
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
    }
  }
);
