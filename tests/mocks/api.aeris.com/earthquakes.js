define([
  'aeris/util',
  './response'
], function(_, Response) {
  /**
   * Create a stubbed response to the Aeris API 'earthquakes' endpoint.
   *
   * @param {Number} count Response count.
   * @return {Object} Stub Aeris API Response
   */
  return function EarthquakeResponse(count) {
    return Response(count, function(i) {
      return {
        report: {
          id: _.uniqueId('MockEarthquakeReport_'),
          timestamp: 1e11 + i * 1000 * 60 * 60,
          dateTimeISO: '2012-03-13T08:44:13-07:00',
          mag: 1 + i / 10,
          type: 'mini',
          depthKM: 1.23,
          depthMI: 4.56,
          region: 'STUB_REGION_' + i,
          location: 'STUB_LOCATION_' + i
        },
        place: {
          name: 'STUB_NAME_' + i,
          state: 'STUB_STATE_' + i,
          country: 'STUB_COUNTRY_' + i
        },
        profile: {
          tz: 'STUB_TZ_' + i
        }
      };
    });
  };
});
