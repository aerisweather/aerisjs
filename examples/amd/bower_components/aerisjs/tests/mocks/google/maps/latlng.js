define([
  'aeris/util'
], function(_) {
  var MockLatLng = function(lat, lon) {
    var stubbedMethods = [
      'lat',
      'lng'
    ];

    _.extend(this, jasmine.createSpyObj('mockLatLng', stubbedMethods));

    this.lat.andReturn(lat);
    this.lng.andReturn(lon);
  };

  MockLatLng.stubAsGoogleLatLng = function() {
    MockLatLng.defaultAsObject_(window, 'google');
    MockLatLng.defaultAsObject_(google, 'maps');

    google.maps.LatLng = MockLatLng;
  };

  MockLatLng.defaultAsObject_ = function(ns, objName) {
    ns[objName] || (ns[objName] = {});
  };


  return MockLatLng;
});
