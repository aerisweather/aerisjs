define([
  'aeris/util',
  './response'
], function(_, Response) {
  /**
   * Create a stubbed response to the Aeris API 'fires' endpoint.
   *
   * @param {Number} count Response count.
   * @return {Object} Stub Aeris API Response
   */
  return function FiresResponse(count) {
    return Response(count, function(i) {
      return {
        report: {
          id: 173828 + i,
          type: 'M',
          timestamp: 1326931200,
          dateTimeISO: '2012-01-18T18:00:00-06:00',
          name: null,
          location: '3 SSW of coates',
          startDateISO: null,
          startTimestamp: null,
          conf: 96,
          areaKM: 1,
          areaMI: 0.4,
          areaAC: 247.1,
          perContained: null,
          sat: {
            widthKM: 1,
            widthMI: 0.6,
            heightKM: 1,
            heightMI: 0.6,
            tempK: 352.6,
            tempC: 79.4,
            tempF: 175,
            source: 'GSFC',
            sat: 'A'
          },
          expContainedTimestamp: 1375315200,
          expContainedISO: '2013-07-31T16:00:00-08:00',
          cause: 'lightning',
          imtType: 2,
          fuels: 'black spruce, heavy blow-down. high 2441813.00 388comm',
          terrain: 'high'
        },
        place: {
          name: 'coates',
          state: 'mn',
          country: 'us'
        },
        profile: {
          tz: 'America/Chicago'
        },
        relative: {
          lat: 44.97997,
          long: -93.26384,
          bearing: 152,
          bearingENG: 'SSE',
          distanceKM: 36.558,
          distanceMI: 22.716
        }
      };
    });
  };
});
