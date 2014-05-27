define([
  'aeris/util',
  'testErrors/untestedspecerror',
  'aeris/geocode/googlegeocodeservice',
  'aeris/geocode/geocodeservicestatus'
], function(_, UntestedSpecError, GoogleGeocodeService, GeocodeServiceStatus) {

  /**
   * @return {Object} A canned google.maps.GeocoderResults object,
   *                  simulating a successful request.
   */
  function getSuccessResponse() {
    return [{
        geometry: {
          location: new google.maps.LatLng(45, -90)
        }
      }];
  }

  /**
   * @return {Object} A canned google.maps.GeocoderResults object,
   *                  simulating an unsuccessful request.
   */
  function getErrorResponse() {
    return [];
  }

  /**
   * @return {Object} A stubbed google.maps.Geocoder instance.
   */
  function getStubbedGoogleService(opt_options) {
    var options = _.extend({
      success: true
    }, opt_options);
    var service = {
      geocode: jasmine.createSpy('google geocode stub')
    };
    var response = options.success ? getSuccessResponse() : getErrorResponse();
    var status = options.success ? google.maps.GeocoderStatus.OK : google.maps.GeocoderStatus.REQUEST_DENIED;

    // Stub geocode method to immediate
    // invoke callback with canned response
    service.geocode.andCallFake(function(query, cb) {
      cb(response, status);
    });

    return service;
  }

  /**
   * Provides assets commonly needed for test specs.
   *
   * @param {Object=} opt_options
   * @return {Object} Test objects.
   */
  function testFactory(opt_options) {
    var options = _.extend({
      success: true
    }, opt_options);
    var googleService = getStubbedGoogleService({ success: options.success });
    var gcs = new GoogleGeocodeService();

   gcs.setGoogleService(googleService);

   return {
     gcs: gcs,
     googleService: googleService
   };
  }

  describe('The GoogleGeocodeService', function() {
    it('should query the google geocoding service', function() {
      var test = testFactory();
      var location = 'somewhere over the rainbow';

      // Mock google geocode method,
      // and check for correct params
      test.googleService.geocode.andCallFake(function(query, cb) {
        expect(query).toEqual({
          address: location
        });
      });

      test.gcs.geocode(location);

      expect(test.googleService.geocode).toHaveBeenCalled();
    });

    it('should handle api errors', function() {
      var test = testFactory({
        success: false
      });
      var failSpy = jasmine.createSpy('fail')
        .andCallFake(function(res) {
          expect(res.latLon).toBeUndefined();
          expect(res.status.apiCode).toEqual(google.maps.GeocoderStatus.REQUEST_DENIED);
          expect(res.status.code).toEqual(GeocodeServiceStatus.API_ERROR);
        });

      test.gcs.geocode('someplace').fail(failSpy);

      expect(failSpy).toHaveBeenCalled();
    });

    it('should return successful api responses', function() {
      var test = testFactory({
        success: true
      });
      var successSpy = jasmine.createSpy('success')
        .andCallFake(function(res) {
          var resLocation = getSuccessResponse()[0].geometry.location;
          expect(res.latLon).toEqual([
            parseFloat(resLocation.lat()),
            parseFloat(resLocation.lng())
          ]);
          expect(res.status.apiCode).toEqual(google.maps.GeocoderStatus.OK);
          expect(res.status.code).toEqual(GeocodeServiceStatus.OK);
        });

      test.gcs.geocode('someplace').done(successSpy);

      expect(successSpy).toHaveBeenCalled();
    });
  });
});
