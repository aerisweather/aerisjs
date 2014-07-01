define([
  'aeris/util',
  'mocks/api.aeris.com/places',
  'aeris/geocode/geocodeservicestatus',
  'aeris/geocode/aerisgeocodeservice',
  'mocks/aeris/api/models/aerisapimodel',
  'aeris/promise'
], function(_, PlacesSuccessResponse, GeocodeServiceStatus, AerisGeocodeService, MockAerisApiModel, Promise) {

  function PlacesApiResponseError(opt_code, opt_message) {
    var code = opt_code || 'invalid_location';
    var message = opt_message || 'MESSAGE_STUB';

    return {
      name: 'APIResponseError',
      code: code,
      message: message
    };
  }

  describe('AerisGeocodeService', function() {
    var aerisGeocodeSerivce;
    var MockPlaceApi = MockAerisApiModel;
    var placeApi;

    beforeEach(function() {
      aerisGeocodeSerivce = new AerisGeocodeService({
        PlaceApi: function(attrs, opts) {
          return placeApi = new MockPlaceApi(attrs, opts);
        }
      });
    });


    describe('geocode', function() {
      var placeName = 'STUB_PLACE_NAME';


      it('should query the Aeris API using the provided place name', function() {
        aerisGeocodeSerivce.geocode(placeName);

        expect(placeApi.getParams().get('p')).toEqual(placeName);
        expect(placeApi.fetch).toHaveBeenCalled();
      });

      it('should return a promise', function() {
        expect(aerisGeocodeSerivce.geocode(placeName)).toBeInstanceOf(Promise);
      });

      describe('on a successful response', function() {
        var onResolve, geocodeServiceResponse;

        beforeEach(function() {
          onResolve = jasmine.createSpy('onResolve');

          aerisGeocodeSerivce.geocode(placeName).
            done(onResolve);

          // Grab the geocode response object.
          onResolve.andCallFake(function(resp) {
            geocodeServiceResponse = resp;
          });
        });


        it('should resolve with a GeocodeServiceResponse object', function() {
          placeApi.andResolveWith(PlacesSuccessResponse());

          expect(onResolve).toHaveBeenCalled();
        });

        describe('the GeocodeServiceResponse object', function() {

          it('should include the an aeris.LatLon object, from the API response', function() {
            var apiResponse = PlacesSuccessResponse();
            placeApi.andResolveWith(apiResponse);


            expect(geocodeServiceResponse.latLon).toEqual([
              apiResponse.response.loc.lat, apiResponse.response.loc.long
            ]);
          });

          it('should have a status code of aeris.geocode.GeocodeServiceStatus.OK', function() {
            placeApi.andResolveWith(PlacesSuccessResponse());

            expect(geocodeServiceResponse.status.code).toEqual(GeocodeServiceStatus.OK);
          });

          it('should have and apiCode of `undefined`.', function() {
            placeApi.andResolveWith(PlacesSuccessResponse());

            expect(geocodeServiceResponse.status.apiCode).toEqual(undefined);
          });

        });

      });

      describe('an error response', function() {
        var onReject, geocodeServiceResponse;

        beforeEach(function() {
          onReject = jasmine.createSpy('onReject');

          aerisGeocodeSerivce.geocode(placeName).
            fail(onReject);

          onReject.andCallFake(function(resp) {
            geocodeServiceResponse = resp;
          });
        });

        it('should reject with a GeocodeServiceResponseObject', function() {
          placeApi.andRejectWith(PlacesApiResponseError());

          expect(onReject).toHaveBeenCalled();
        });

        describe('the GeocodeServiceResponse object', function() {

          it('should have an `undefined` latLon property', function() {
            placeApi.andRejectWith(PlacesApiResponseError());

            expect(geocodeServiceResponse.latLon).toBeUndefined();
          });

          describe('when the API response code is `invalid_location`', function() {

            beforeEach(function() {
              placeApi.andRejectWith(PlacesApiResponseError('invalid_location'));
            });


            it('should have a status code of aeris.geocode.GeocodeServiceStatus.NO_RESULTS', function() {
              expect(geocodeServiceResponse.status.code).toEqual(GeocodeServiceStatus.NO_RESULTS);
            });

            it('should have an apiCode of `invalid_location`', function() {
              expect(geocodeServiceResponse.status.apiCode).toEqual('invalid_location');
            });

          });

          describe('when the API response code is `invalid_client`', function() {

            beforeEach(function() {
              placeApi.andRejectWith(PlacesApiResponseError('invalid_client'));
            });

            it('should have a status code of aeris.geocode.GeocodeServiceStatus.API_ERROR', function() {
              expect(geocodeServiceResponse.status.code).toEqual(GeocodeServiceStatus.API_ERROR);
            });

            it('should have an apiCode of `invalid_client`', function() {
              expect(geocodeServiceResponse.status.apiCode).toEqual('invalid_client');
            });

          });

        });

      });

    });

  });

});
