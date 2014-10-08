define([
  'aeris/util',
  'aeris/directions/googledirectionsservice',
  'mocks/google/maps/directionsservice',
  'mocks/google/maps/latlng',
  'mocks/google/maps/travelmode',
  'mocks/aeris/directions/promises/promisetofetchgoogledirections'
], function(_, GoogleDirectionsService, MockDirectionsServiceApi, MockLatLng, StubTravelMode, MockPromiseToFetchDirections) {
  var google_orig = window.google;

  function restoreGoogle() {
    window.google = google_orig;
  }


  describe('A GoogleDirectionsService', function() {
    var directionsService, mockDirectionsApi;
    var STUB_ORIGIN = [12, 34];
    var STUB_DESTINATION = [56, 78];

    mockDirectionsApi = new MockDirectionsServiceApi();

    beforeEach(function() {
      MockLatLng.stubAsGoogleLatLng();
      StubTravelMode.stubAsGoogleTravelMode();

      directionsService = new GoogleDirectionsService({
        PromiseToFetchDirections: MockPromiseToFetchDirections,
        directionsServiceApi: mockDirectionsApi
      });
    });


    afterEach(function() {
      restoreGoogle();
    });




    describe('fetchPath', function() {

      it('should request directions from the LatLng origin', function() {
        directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION, {
          travelMode: 'WALKING'
        });

        mockDirectionsApi.shouldHaveRequestedWithOriginLatLon(STUB_ORIGIN);
      });

      it('should request directions from the LatLng destination', function() {
        directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION, {
          travelMode: 'WALKING'
        });

        mockDirectionsApi.shouldHaveRequestedWithDestinationLatLon(STUB_DESTINATION);
      });

      it('should request directions with the specified travelMode (as google TravelMode)', function() {
        directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION, {
          travelMode: 'WALKING'
        });

        mockDirectionsApi.shouldHaveRequestedWithTravelMode(StubTravelMode.WALKING);
      });

      it('should settle it\'s promise with the returned response and status', function() {
        var STUB_RESPONSE = 'Stub Response', STUB_STATUS = 'Stub status.';

        var promise = directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION, {
          travelMode: 'WALKING'
        });

        mockDirectionsApi.resolveRequestWith(STUB_RESPONSE, STUB_STATUS);

        promise.shouldHaveSettledWithResponse(STUB_RESPONSE);
        promise.shouldHaveSettledWithStatus(STUB_STATUS);
      });


      describe('if directions api throws an error', function() {
        var STUB_ERROR = new Error();

        beforeEach(function() {
          mockDirectionsApi.route.andCallFake(function() {
            throw STUB_ERROR;
          });
        });


        it('should reject the promise with the thrown error', function() {
          var thrownError;

          try {
            directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION, {
              travelMode: 'WALKING'
            });
          }
          catch (e) {
            thrownError = e;
          }

          expect(thrownError).toEqual(STUB_ERROR);
        });
      });

    });

  });

});
