define([
  'aeris/util',
  'testUtils',
  'aeris/jsonp',
  'geolocate/freegeoipgeolocateservice',
  'geolocate/geolocateerror'
], function(_, testUtils, JSONP, FreeGeoIpGeolocateService, GeolocateError) {

  function testFactory(opt_options) {
    var options = _.extend({
      jsonp: {
        get: jasmine.createSpy('jsonp.get')
      },
      ip_address: '123.456.789.10',
      response: getCannedResponse()
    }, opt_options);

    var gls = new FreeGeoIpGeolocateService(options);

    options.jsonp.get.andCallFake(function(url, params, cb) {
      cb(options.response);
    });

    return {
      gls: gls,
      jsonp: options.jsonp,
      ip: options.ip_address,
      response: options.response
    };
  }

  function getCannedResponse() {
    return {
      areacode: '612',
      city: 'Minneapolis',
      country_code: 'US',
      country_name: 'United States',
      ip: '173.160.127.46',
      latitude: 44.98,
      longitude: -93.2638,
      metro_code: '613',
      region_code: 'MN',
      region_name: 'Minnesota',
      zipcode: ''
    };
  }

  describe('The FreeGeoIPGeolocateService', function() {

    describe('isSupported', function() {
      it('should return true', function() {
        var test = testFactory();

        expect(test.gls.isSupported()).toEqual(true);
      });
    });

    describe('getCurrentPosition', function() {
      it('should query the FreeGeoIP API', function() {
        var test = testFactory();

        test.jsonp.get.andCallFake(function(url, params, cb) {
          expect(url).toEqual('http://freegeoip.net/json/' + test.ip);
        });

        test.gls.getCurrentPosition();
        expect(test.jsonp.get).toHaveBeenCalled();
      });

      it('should respond with data from the FreeGeoIP API', function() {
        var test = testFactory();

        test.gls.getCurrentPosition().done(function(res) {
          expect(res.latLon).toEqual([
            test.response.latitude,
            test.response.longitude
          ]);
          testUtils.setFlag();
        });
        waitsFor(testUtils.checkFlag, 'getCurrentPosition to resolve', 25);
      });

      it('should reject the request if the FreeGeoIP API data is malformed.', function() {
        var test = testFactory();

        test.jsonp.get.andCallFake(function(url, params, cb) {
          cb('foo');
        });

        test.gls.getCurrentPosition().fail(function(error) {
          expect(error.code).toEqual(GeolocateError.POSITION_UNAVAILABLE);
          testUtils.setFlag();
        });
        waitsFor(testUtils.checkFlag, 'getCurrentPosition to fail', 25);
      });
    });


    describe('watchPosition', function() {
      it('should query the FreeGeoIP API at a set interval', function() {
        var test = testFactory();

        spyOn(test.gls, 'getCurrentPosition').andCallThrough();

        test.gls.watchPosition(null, null, { interval: 25 });

        window.setTimeout(function() {
          // Call at 0 ms
          // Call at 25 ms
          // Call at 50 ms
          expect(test.gls.getCurrentPosition.callCount).toEqual(3);
          testUtils.setFlag();
        }, 60);
        waitsFor(testUtils.checkFlag, 'setTimeout', 75);
      });
    });

    describe('clearWatch', function() {
      it('should stop quering the FreeGeoIP API', function() {
        var test = testFactory();

        spyOn(test.gls, 'getCurrentPosition').andCallThrough();

        test.gls.watchPosition(null, null, { interval: 25 });
        test.gls.clearWatch();

        window.setTimeout(function() {
          // Call at 0 ms
          // then stops calling...
          expect(test.gls.getCurrentPosition.callCount).toEqual(1);
          testUtils.setFlag();
        }, 60);
        waitsFor(testUtils.checkFlag, 'setTimeout', 75);
      });
    });

  });
});
