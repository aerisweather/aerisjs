define([
  'aeris/util',
  'aeris/geolocate/geolocateserviceresolver'
], function(_, GeolocateServiceResolver) {

  var MockSupportedGeolocateService = function(options) {
    MockSupportedGeolocateService.calledWithOptions = options;
  };
  MockSupportedGeolocateService.isSupported = jasmine.createSpy('isSupported').andReturn(true);

  var MockUnsupportedGeolocateService = function(options) {
    MockUnsupportedGeolocateService.calledWithOptions = options;
  };
  MockUnsupportedGeolocateService.isSupported = jasmine.createSpy('isSupported').andReturn(false);

  describe('A GeolocateServiceResolver', function() {
    var STUB_OPTIONS = { STUB: 'OPTIONS'};

    beforeEach(function() {
      MockSupportedGeolocateService.calledWithOptions = null;
      MockUnsupportedGeolocateService.calledWithOptions = null;
    });


    describe('resolveService', function() {

      it('should return an instance of the GeolocateService option, if it is supported', function() {
        var resolver = new GeolocateServiceResolver({
          GeolocateService: MockSupportedGeolocateService,
          FallbackGeolocateService: MockUnsupportedGeolocateService,
          geolocateServiceOptions: STUB_OPTIONS
        });

        expect(resolver.resolveService()).toBeInstanceOf(MockSupportedGeolocateService);
        expect(MockSupportedGeolocateService.calledWithOptions).toEqual(STUB_OPTIONS);
      });

      it('should return an instance of the FallbackGeolocateService option, if the GeolocateService option is not supported', function() {
        var resolver = new GeolocateServiceResolver({
          GeolocateService: MockUnsupportedGeolocateService,
          FallbackGeolocateService: MockSupportedGeolocateService,
          geolocateServiceOptions: STUB_OPTIONS
        });

        expect(resolver.resolveService()).toBeInstanceOf(MockSupportedGeolocateService);
        expect(MockSupportedGeolocateService.calledWithOptions).toEqual(STUB_OPTIONS);
      });

    });

  });

});
