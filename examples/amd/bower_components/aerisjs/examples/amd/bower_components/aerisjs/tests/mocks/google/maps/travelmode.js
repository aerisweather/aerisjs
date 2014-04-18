define([
  'aeris/util'
], function() {
  var TravelMode = {};

  var modes = {
    WALKING: 'WALKING',
    DRIVING: 'DRIVING',
    BICYCLING: 'BICYLING',
    TRANSIT: 'TRANSIT'
  };

  _.extend(TravelMode, modes);

  TravelMode.stubAsGoogleTravelMode = function() {
    TravelMode.defaultAsObject_(window, 'google');
    TravelMode.defaultAsObject_(google, 'maps');

    google.maps.TravelMode = modes;
  };

  TravelMode.defaultAsObject_ = function(ns, objName) {
    ns[objName] || (ns[objName] = {});
  };

  return TravelMode;
});
