define([
  'aeris/api/config/validfilters'
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
   * @class validMarkerFilters
   * @namespace aeris.builder.maps.markers.config
   * @static
   */
  return {
    'EarthquakeMarkers': validFilters.earthquakes,
    'StormReportMarkers': validFilters.stormreports,
    'LightningMarkers': validFilters.lightning,
    'FireMarkers': validFilters.fires
  };
});

