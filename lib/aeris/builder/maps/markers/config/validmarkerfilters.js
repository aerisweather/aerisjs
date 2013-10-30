define([
  'api/endpoint/config/validfilters'
], function(validFilters) {
  /**
   * Returns validFilters, mapped to marker class names.
   * As:
   *  {
   *    'MarkersClassName': [
   *      'filterNameA',
   *      'filterNameB',
   *      ...
   *    ],
   *    ...
   *  }
   *
   * @class aeris.builder.maps.markers.config.validMarkerFilters
   * @static
   */
  return {
    'EarthquakeMarkers': validFilters.earthquakes,
    'StormReportMarkers': validFilters.stormreports,
    'LightningMarkers': validFilters.lightning,
    'FireMarkers': validFilters.fires
  };
});

