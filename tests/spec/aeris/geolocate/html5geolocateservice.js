define([
  'aeris/util',
  'testUtils',
  'geolocate/html5geolocateservice',
  'geolocate/geolocateposition',
  'geolocate/geolocateerror'
], function(_, testUtils, HTML5GeolocateService, GeolocatePosition, GeolocateError) {

  
  function getStubbedNavigator(opt_options) {
    var options = _.extend({
      position: getCannedNavigatorPosition()
    }, opt_options);

    return {
      geolocation: {
        getCurrentPosition: jasmine.createSpy('getCurrentPosition'),
        watchPosition: jasmine.createSpy('watchPosition'),
        clearWatch: jasmine.createSpy('clearWatch')
      }
    };
  }

  function getCannedError(opt_options) {
    return _.extend({
      message: 'something went horribly wrong',
        code: 1
    }, opt_options);
  }

  function getCannedNavigatorPosition(opt_options) {
    return _.extend({
      coords: {
        latitude: 45.12345,
        longitude: -90.7890,
        accuracy: 12345,
        altitude: 100,
        altitudeAccuracy: 25,
        heading: 90,
        speed: 50
      },
      timestamp: (new Date()).getTime()
    }, opt_options);
  }

  function testFactory(opt_options) {
    var options = _.extend({
      navigator: getStubbedNavigator()
    }, opt_options);

    var gls = new HTML5GeolocateService(options);

    return {
      gls: gls,
      navigator: options.navigator
    };
  }

  describe('The HTML5 Geolocation Service', function() {

    describe('getCurrentPosition', function() {

      it('should request the users current position', function() {
        var glsOptions = {
          enableHighAccuracy: true,
          maximumAge: 12345,
          timeout: 67890
        };
        var test = testFactory(glsOptions);
        test.gls.getCurrentPosition();

        // Check that options were passed to navigator
        test.navigator.geolocation.getCurrentPosition.andCallFake(
          function(onsuccess, onerror, options) {
            expect(options).toEqual(glsOptions);
          }
        );

        expect(test.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      });

      it('should return the users current position', function() {
        var test = testFactory();
        var position = getCannedNavigatorPosition();

        // Return canned position object
        test.navigator.geolocation.getCurrentPosition.andCallFake(
          function(onSuccess, onError, options) {
            onSuccess(position);
          }
        );

        test.gls.getCurrentPosition().done(function(res) {
          expect(res.latLon).toEqual([position.coords.latitude, position.coords.longitude]);
          expect(res.altitude).toEqual(position.coords.altitude);
          expect(res.altitudeAccuracy).toEqual(position.coords.altitudeAccuracy);
          expect(res.accuracy).toEqual(position.coords.accuracy);
          expect(res.heading).toEqual(position.coords.heading);
          expect(res.speed).toEqual(position.coords.speed);
          expect(res.timestamp).toEqual(position.timestamp);
          testUtils.setFlag();
        });
        waitsFor(testUtils.checkFlag, 'getCurrentPosition to resolve', 25);
      });

      it('should handle errors from the HTML5 geolocator', function() {
        var test = testFactory();
        var error = getCannedError();

        test.navigator.geolocation.getCurrentPosition.andCallFake(
          function(onSuccess, onError, options) {
            onError(error);
          }
        );

        test.gls.getCurrentPosition().fail(function(res) {
          expect(res.message).toEqual(error.message);
          expect(res.code).toEqual(error.code);
          testUtils.setFlag();
        });
        waitsFor(testUtils.checkFlag, 'getCurrentPosition to fail', 25);
      });

      it('should reject the request if HTML5 geolocation is not available', function() {
        var test = testFactory({
          navigator: 'IE8 FTW'
        });

        test.gls.getCurrentPosition().fail(function(res) {
          expect(res.code).toEqual(GeolocateError.POSITION_UNAVAILABLE);
          testUtils.setFlag();
        });
        waitsFor(testUtils.checkFlag, 'getCurrentPosition to fail', 25);
      });
    });

    describe('watchPostion', function() {
      it('should use the HTML5 geolocation API', function() {
        var test = testFactory();

        test.gls.watchPosition();

        expect(test.navigator.geolocation.watchPosition).toHaveBeenCalled();
      });

      it('should return the user\'s location', function() {
        var test = testFactory();
        var cannedPosition = getCannedNavigatorPosition();

        // Return canned data
        test.navigator.geolocation.watchPosition.andCallFake(
          function(onSuccess, onError, options) {
            onSuccess(cannedPosition);
          }
        );

        test.gls.watchPosition(function(res) {
            expect(res.latLon).toEqual([cannedPosition.coords.latitude, cannedPosition.coords.longitude]);
            expect(res.altitude).toEqual(cannedPosition.coords.altitude);
            expect(res.altitudeAccuracy).toEqual(cannedPosition.coords.altitudeAccuracy);
            expect(res.accuracy).toEqual(cannedPosition.coords.accuracy);
            expect(res.heading).toEqual(cannedPosition.coords.heading);
            expect(res.speed).toEqual(cannedPosition.coords.speed);
            expect(res.timestamp).toEqual(cannedPosition.timestamp);
            testUtils.setFlag();
          });
        waitsFor(testUtils.checkFlag, 'watchPosition to resolve');
      });

      it('should return the user\'s location multiple times', function() {
        var cb = jasmine.createSpy('watchPosition callback');
        var test = testFactory();

        test.navigator.geolocation.watchPosition.
          andCallFake(function(onSuccess, onError, options) {
            onSuccess(getCannedNavigatorPosition());
            onSuccess(getCannedNavigatorPosition());
            onSuccess(getCannedNavigatorPosition());
          });

        test.gls.watchPosition(cb);

        expect(cb.callCount).toEqual(3);
      });

      it('should handle errors', function() {
        var test = testFactory();
        var cannedError = getCannedError();

        test.navigator.geolocation.watchPosition.
          andCallFake(function(onSuccess, onError, options) {
            onError(cannedError);
          });

        test.gls.watchPosition(function() {}, function(error) {
          expect(error.message).toEqual(cannedError.message);
          expect(error.code).toEqual(cannedError.code);
          testUtils.setFlag();
        });
        waitsFor(testUtils.checkFlag, 'watchPosition to fail', 25);
      });
    });

    describe('clearWatch', function() {
      it('should stop watching for changes in position', function() {
        var test = testFactory();
        var watchID = 123;

        test.navigator.geolocation.watchPosition.andReturn(watchID);

        test.gls.watchPosition();
        test.gls.clearWatch();

        expect(test.navigator.geolocation.clearWatch).toHaveBeenCalledWith(watchID);
      });
    });

    describe('isSupported', function() {
      it('should return true if HTML5 geolocation is supported', function() {
        var test = testFactory({
          navigator: window.navigator
        });

        expect(test.gls.isSupported()).toEqual(true);
      });

      it('should return false if HTML5 geolocation is not supported', function() {
        var test = testFactory({
          navigator: 'IE8 FTW'
        });

        expect(test.gls.isSupported()).toEqual(false);
      });
    });

  });
});
