define([
  'aeris/util',
  'aeris/geolocate/html5geolocateservice',
  'aeris/geolocate/errors/geolocateserviceerror',
  'mocks/window/navigator',
  'mocks/window/geolocationresults',
  'mocks/window/geolocationerror'
], function(_, HTML5GeolocateService, GeolocateServiceError, MockNavigator, MockGeolocationResults, MockGeolocationError) {
  var root = this;
  var navigator_orig = root.navigator;

  function stubGlobalNavigator(mock) {
    root.navigator = mock;
  }
  function restoreGlobalNavigator() {
    root.navigator = navigator_orig;
  }


  describe('The HTML5 Geolocation Service', function() {
    var geolocator, navigator, position;
    var onResolve, onReject;
    var NAVIGATOR_OPTIONS = {
      enableHighAccuracy: false,
      maximumAge: 12345,
      timeout: 54321
    };
    var LAT_STUB = 12.345;
    var LON_STUB = 54.321;

    beforeEach(function() {
      var geolocatorOptions;
      navigator = new MockNavigator();
      geolocatorOptions = _.extend({}, NAVIGATOR_OPTIONS, {
        navigator: navigator
      });
      geolocator = new HTML5GeolocateService(geolocatorOptions);

      position = new MockGeolocationResults({
        coords: {
          latitude: LAT_STUB,
          longitude: LON_STUB
        }
      });

      onResolve = jasmine.createSpy('onResolve');
      onReject = jasmine.createSpy('onReject');

      onResolve.getPosition = _.bind(function() {
        if (!this.callCount) { throw new Error('onResolve was never called'); }
        return this.mostRecentCall.args[0];
      }, onResolve);

      onReject.getError = _.bind(function() {
        if (!this.callCount) { throw new Error('onrReject was never called'); }
        return this.mostRecentCall.args[0];
      }, onReject);

      stubGlobalNavigator(new MockNavigator());
    });


    afterEach(function() {
      restoreGlobalNavigator();
    });



    describe('getCurrentPosition', function() {

      it('should request the users current position from the navigator', function() {
        geolocator.getCurrentPosition();

        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        expect(navigator.geolocation.getCurrentPosition.getOptions()).toEqual(NAVIGATOR_OPTIONS);
      });

      it('should resolve with the users current position', function() {
        geolocator.getCurrentPosition().done(onResolve);
        navigator.geolocation.getCurrentPosition.resolve(position);

        expect(onResolve).toHaveBeenCalled();
        expect(onResolve.getPosition().latLon).toEqual([LAT_STUB, LON_STUB]);
      });

      it('should handle errors from the HTML5 geolocator', function() {
        geolocator.getCurrentPosition().fail(onReject);
        navigator.geolocation.getCurrentPosition.reject(new MockGeolocationError());

        expect(onReject).toHaveBeenCalled();
        expect(onReject.getError().name).toEqual('GeolocateServiceError');
      });

      it('should reject the request if HTML5 geolocation is not available', function() {
        stubGlobalNavigator(null);

        geolocator.getCurrentPosition().fail(onReject);

        expect(onReject).toHaveBeenCalled();
        expect(onReject.getError().name).toEqual('GeolocateServiceError');
        expect(onReject.getError().code).toEqual(GeolocateServiceError.POSITION_UNAVAILABLE);
      });
    });

    describe('watchPostion', function() {
      it('should use the HTML5 geolocation API', function() {
        geolocator.watchPosition();

        expect(navigator.geolocation.watchPosition).toHaveBeenCalled();
        expect(navigator.geolocation.watchPosition.getOptions()).toEqual(NAVIGATOR_OPTIONS);
      });

      it('should return the user\'s location', function() {
        geolocator.watchPosition(onResolve);
        navigator.geolocation.watchPosition.resolve(position);

        expect(onResolve).toHaveBeenCalled();
        expect(onResolve.getPosition().latLon).toEqual([LAT_STUB, LON_STUB]);
      });

      it('should return the user\'s location multiple times', function() {
        var COUNT = 3;
        geolocator.watchPosition(onResolve);

        _.times(COUNT, function() {
          navigator.geolocation.watchPosition.resolve(position);
        });

        expect(onResolve.callCount).toEqual(COUNT);
      });

      it('should handle errors', function() {
        geolocator.watchPosition(null, onReject);
        navigator.geolocation.watchPosition.reject(new MockGeolocationError());

        expect(onReject.getError().name).toEqual('GeolocateServiceError');
      });

      it('should invoke the errback if HTML5 navigation is not supported', function() {
        stubGlobalNavigator(null);

        geolocator.watchPosition(null, onReject);

        expect(onReject).toHaveBeenCalled();
        expect(onReject.getError().name).toEqual('GeolocateServiceError');
        expect(onReject.getError().code).toEqual(GeolocateServiceError.POSITION_UNAVAILABLE);
      });
    });

    describe('clearWatch', function() {
      it('should stop watching for changes in position', function() {
        var WATCH_ID_STUB = 12345;
        navigator.geolocation.watchPosition.andReturn(WATCH_ID_STUB);
        geolocator.watchPosition();

        geolocator.clearWatch();

        expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(WATCH_ID_STUB);
      });
    });

    describe('isSupported', function() {
      it('should return true if HTML5 geolocation is supported', function() {
        stubGlobalNavigator(new MockNavigator());

        expect(HTML5GeolocateService.isSupported()).toEqual(true);
      });

      it('should return false if HTML5 geolocation is not supported', function() {
        stubGlobalNavigator(null);

        expect(HTML5GeolocateService.isSupported()).toEqual(false);
      });
    });

  });
});
