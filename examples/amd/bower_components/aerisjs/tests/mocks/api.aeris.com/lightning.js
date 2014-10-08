define([
  'aeris/util',
  './response'
], function(_, Response) {
  /**
   * Create a stubbed response to the Aeris API 'lightning' endpoint.
   *
   * @param {Number} count Response count.
   * @return {Object} Stub Aeris API Response
   */
  return function LightningResponse(count) {
    return Response(count, function(i) {
      return {
        ob: {
          timestamp: 1403114830 + i,
          dateTimeISO: '2014-06-18T18:07:10+00:00',
          pulse: {
            type: 'cg',
            peakamp: -26966
          }
        },
        obTimestamp: 1403114830,
        pulse: {
          type: 'cg',
          peakamp: -26966
        },
        relativeTo: {
          lat: 30.60009387355,
          long: -88.330078125,
          bearing: 198,
          bearingENG: 'SSW',
          distanceKM: 3.695,
          distanceMI: 2.296
        }
      };
    });
  };
});
