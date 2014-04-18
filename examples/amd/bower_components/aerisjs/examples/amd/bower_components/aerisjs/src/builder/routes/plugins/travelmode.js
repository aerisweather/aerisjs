define([
  'aeris/maps/routes/waypoint',
  'aeris/maps/routes/errors/invalidtravelmodeerror'
], function(Waypoint, InvalidTravelModeError) {

  function createTravelModeError(invalidMode) {
    var errMsg = '\'' + invalidMode + '\' is not a valid travel mode. ' +
      'Valid travel modes are: \'' + getTravelModes().join('\', \'') + '\'.';

    return new InvalidTravelModeError(errMsg);
  }


  function getTravelModes() {
    return Object.keys(Waypoint.travelMode);
  }



  return function(pluginOptions) {
    return {
      resolvers: {
        travelMode: function(resolver, refName, refObj, wire) {
          var travelMode = Waypoint.travelMode[refName];

          if (!travelMode) {
            resolver.reject(createTravelModeError(travelMode));
            return;
          }

          resolver.resolve(travelMode);
        }
      }
    };
  };
});
