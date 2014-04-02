define(['aeris/util'], function(_) {
  var MockGeolocationResults = function(opt_position) {
    var position = _.defaults(opt_position || {}, {
      coords: {},
      timestamp: new Date().getTime()
    });

    _.defaults(position.coords, {
      latitude: 45.12345,
      longitude: -90.7890,
      accuracy: 12345,
      altitude: 100,
      altitudeAccuracy: 25,
      heading: 90,
      speed: 50
    });

    return position;
  };

  return MockGeolocationResults;
});
