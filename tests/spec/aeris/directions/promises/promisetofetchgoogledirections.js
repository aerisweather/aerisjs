define([
  'aeris/util',
  'aeris/directions/promises/promisetofetchgoogledirections',
  'aeris/maps/strategy/utils'
], function(_, PromiseToFetchGoogleDirections, mapUtil) {

  var MockLatLng = function(opt_lat, opt_lon) {
    var lat = opt_lat || 45;
    var lon = opt_lon || -90;

    this.lat = jasmine.createSpy('lat').andReturn(lat);
    this.lng = jasmine.createSpy('lon').andReturn(lon);
  };




  describe('A PromiseToFetchGoogleDirections', function() {
    var promise;
    var STUB_RESPONSE_OK, STUB_RESPONSE_UNEXPECTED, STUB_RESPONSE_NO_RESULTS;
    var STUB_ROUTES, STUB_PATH, STUB_DISTANCE;
    var google_orig = window.google;

    function defineGoogleDirectionsStatus() {
      window.google = window.google || {};
      window.google.maps = google.maps || {
        DirectionsStatus: {
          OK: 'OK',
          ZERO_RESULTS: 'ZERO_RESULTS'
        }
      };
    }

    beforeEach(function() {
      promise = new PromiseToFetchGoogleDirections();

      spyOn(promise, 'rejectBecauseApiError');
      spyOn(promise, 'rejectBecauseNoResults');
      spyOn(promise, 'resolveWithPathAndDistance');

      defineGoogleDirectionsStatus();

      STUB_DISTANCE = 1234.56;
      STUB_PATH = [new MockLatLng(), new MockLatLng(), new MockLatLng()];
      STUB_ROUTES = [{
        overview_path: STUB_PATH,
        legs: [{
          distance: {
            value: STUB_DISTANCE
          }
        }]
      }];

      STUB_RESPONSE_OK = {
        routes: STUB_ROUTES
      };

      STUB_RESPONSE_UNEXPECTED = {
        foo: 'bar'
      };

      STUB_RESPONSE_NO_RESULTS = {
        routes: []
      };
    });


    afterEach(function() {
      window.google = google_orig;
    });


    describe('settleUsingResponse', function() {

      beforeEach(function() {
        spyOn(promise, 'resolveUsingResponse');
      });


      it('should resolve for a successful response', function() {
        var OK_STATUS = google.maps.DirectionsStatus.OK;

        promise.settleUsingResponse(STUB_RESPONSE_OK, OK_STATUS);

        expect(promise.resolveUsingResponse).
          toHaveBeenCalledWith(STUB_RESPONSE_OK, OK_STATUS);
      });

      it('should reject for no results', function() {
        var ZERO_RESULTS_STATUS = google.maps.DirectionsStatus.ZERO_RESULTS;
        promise.settleUsingResponse(STUB_RESPONSE_NO_RESULTS, ZERO_RESULTS_STATUS);

        expect(promise.rejectBecauseNoResults).toHaveBeenCalledWith(ZERO_RESULTS_STATUS);
      });

      it('should reject for an unexpected response', function() {
        var UNEXPECTED_STATUS = 'SOME_API_CODE';
        promise.settleUsingResponse(STUB_RESPONSE_UNEXPECTED, UNEXPECTED_STATUS);

        expect(promise.rejectBecauseApiError).toHaveBeenCalledWith(UNEXPECTED_STATUS);
      });

    });


    describe('resolveUsingResponse', function() {

      function getResolvedPath() {
        return promise.resolveWithPathAndDistance.mostRecentCall.args[0];
      }
      function getResolvedDistance() {
        return promise.resolveWithPathAndDistance.mostRecentCall.args[1];
      }
      function getResolvedStatus() {
        return promise.resolveWithPathAndDistance.mostRecentCall.args[2];
      }

      function shouldResolveWithPath(expectedPath) {
        expect(getResolvedPath()).toEqual(expectedPath);
      }
      function shouldResolveWithDistance(expectedDistance) {
        expect(getResolvedDistance()).toEqual(expectedDistance);
      }
      function shouldResolveWithStatus(expectedStatus) {
        expect(getResolvedStatus()).toEqual(expectedStatus);
      }


      it('should resolve with a latLon path from the response', function() {
        promise.resolveUsingResponse(STUB_RESPONSE_OK, google.maps.DirectionsStatus.OK);

        shouldResolveWithPath(mapUtil.latLngToPath(STUB_PATH));
      });

      it('should resolve with the distance from the response', function() {
        promise.resolveUsingResponse(STUB_RESPONSE_OK, google.maps.DirectionsStatus.OK);

        shouldResolveWithDistance(STUB_DISTANCE);
      });

      it('should resolve with the response status', function() {
        promise.resolveUsingResponse(STUB_RESPONSE_OK, google.maps.DirectionsStatus.OK);

        shouldResolveWithStatus(google.maps.DirectionsStatus.OK);
      });

    });

  });

});
