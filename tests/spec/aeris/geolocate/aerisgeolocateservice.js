define([
  'aeris/util',
  'aeris/geolocate/aerisgeolocateservice',
  'aeris/geolocate/errors/geolocateserviceerror',
  'mocks/aeris/api/models/aerisapimodel',
  'mocks/api.aeris.com/places',
  'aeris/promise'
], function(_, AerisGeolocateService, GeolocateServiceError, MockAerisApiModel, PlacesSuccessResponse, Promise) {

  function PlacesApiResponseError(opt_code, opt_message) {
    var code = opt_code || 'invalid_location';
    var message = opt_message || 'MESSAGE_STUB';

    return {
      name: 'APIResponseError',
      code: code,
      message: message
    };
  }

  describe('AerisGeolocateService', function() {
    var aerisGeolocateService, placeApi;
    var MockPlaceApi = MockAerisApiModel;

    beforeEach(function() {
      aerisGeolocateService = new AerisGeolocateService({
        PlaceApi: function(attrs, opts) {
          return placeApi = new MockPlaceApi(attrs, opts);
        }
      });
    });

    describe('geolocate', function() {

      it('should query the Aeris /places API with a location of `:auto`', function() {
        aerisGeolocateService.getCurrentPosition();

        expect(placeApi.fetch).toHaveBeenCalled();
        expect(placeApi.getParams().get('p')).toEqual(':auto');
      });

      it('should return a promise', function() {
        expect(aerisGeolocateService.getCurrentPosition()).toBeInstanceOf(Promise);
      });

      describe('on a successful response', function() {
        var onResolve, apiResponse, geolocatePosition;

        beforeEach(function() {
          apiResponse = PlacesSuccessResponse();
          onResolve = jasmine.createSpy('onResolve').
            andCallFake(function(resp) {
              geolocatePosition = resp;
            });

          aerisGeolocateService.getCurrentPosition().
            done(onResolve);

          placeApi.andResolveWith(apiResponse);
        });


        it('should resolve the promise to geolocate with a GeolocatePosition object', function() {
          expect(onResolve).toHaveBeenCalled();
          expect(geolocatePosition).not.toBeUndefined();
        });

        describe('the GeolocatePosition object', function() {

          it('should contain the latLon from the API response', function() {
            expect(geolocatePosition.latLon).toEqual([
              apiResponse.response.loc.lat,
              apiResponse.response.loc.long
            ]);
          });

        });

      });

      describe('on a error response', function() {
        var onReject, geolocateServiceError;

        beforeEach(function() {
          onReject = jasmine.createSpy('onResolve').
            andCallFake(function(err) {
              geolocateServiceError = err;
            });

          aerisGeolocateService.getCurrentPosition().
            fail(onReject);


          it('should reject the promise to geolocate with a GeolocateServiceError', function() {
            placeApi.andRejectWith(PlacesApiResponseError());

            expect(onReject).toHaveBeenCalled();
            expect(geolocateServiceError).not.toBeUndefined();
          });

          describe('the GeolocateServiceError object', function() {

            it('should contain a GeolocateServiceEror.POSITION_UNAVAILABLE code (for invalid_location)', function() {
              placeApi.andRejectWith(PlacesApiResponseError('invalid_location'));

              expect(geolocateServiceError.code).toEqual(GeolocateServiceError.POSITION_UNAVAILABLE);
            });

            it('should contain a GeolocateServiceEror.PERMISSION_DENIED code (for invalid_client)', function() {
              placeApi.andRejectWith(PlacesApiResponseError('invalid_client'));

              expect(geolocateServiceError.code).toEqual(GeolocateServiceError.PERMISSION_DENIED);
            });

            it('should contain the error message', function() {
              placeApi.andRejectWith(PlacesApiResponseError('invalid_location', 'STUB_MESSAGE'));

              expect(geolocateServiceError.message).toEqual('STUB_MESSAGE');
            });

          });

        });

      });

    });

  });
});

