define([
  'aeris/util',
  'testErrors/untestedspecerror',
  'aeris/geocode/mapquestgeocodeservice',
  'aeris/geocode/config',
  'aeris/geocode/geocodeservicestatus'
], function(_, UntestedSpecError, MapQuestGeocodeService, geocodeConfig, GeocodeServiceStatus) {


  function getStubbedJSONP(opt_options) {
    var options = _.extend({
      response: null
    }, opt_options);
    var getSpy = jasmine.createSpy('jsonp get');

    // Provide a canned API response
    if (options.response) {
      getSpy.andCallFake(function(url, data, cb) {
        cb(options.response);
      });
    }

    return {
      get: getSpy
    };
  }

  function getSuccessResponse() {
    return {
      results: [{
        locations: [{
          latLng: {
            lat: '45.123',
            lng: '-90.879'
          }
        }]
      }],
      info: {
        statuscode: '100',
        messages: [
          'some response message',
          'another response message'
        ]
      }
    };
  }

  function getErrorResponse() {
    return {
      info: {
        statuscode: '500',
        messages: [
          'something went horribly wrong',
          'and it\'s clearly all your fault.'
        ]
      }
    };
  }

  function testFactory(opt_options) {
    var options = _.extend({
      apiId: 'abcd1234',
      apiResponse: null
    }, opt_options);
    var jsonp = getStubbedJSONP({
      response: options.apiResponse
    });
    var gcs = new MapQuestGeocodeService({
      apiId: options.apiId
    });

   gcs.setJSONP(jsonp);

   return {
     gcs: gcs,
     jsonp: jsonp,
     apiId: options.apiId,
     apiResponse: options.apiResponse
   };
  }

  describe('The MapQuestGeocodeService', function() {

    describe('geocode', function() {

      describe('should require a valid apiKey, either from...', function() {
        var apiId_orig = geocodeConfig.get('apiId');
        var API_ID_STUB = 'API_ID_STUB';

        beforeEach(function() {
          geocodeConfig.set('apiId', null);
        });


        afterEach(function() {
          geocodeConfig.set('apiId', apiId_orig);
        });



        it('\'aeris/geocode/config\'', function() {
          var geocoder = new MapQuestGeocodeService();
          expect(function() {
            geocoder.geocode();
          }).toThrowType('InvalidConfigError');

          geocodeConfig.set('apiId', API_ID_STUB);
          geocoder.geocode();
        });

        it('constructor options', function() {
          var geocoder = new MapQuestGeocodeService();
          expect(function() {
            geocoder.geocode();
          }).toThrowType('InvalidConfigError');

          geocoder = new MapQuestGeocodeService({
            apiId: API_ID_STUB
          });
          geocoder.geocode();
        });
      });

      it('should query the mapquest geocoding service', function() {
        var test = testFactory();
        var location = 'somewhere over the rainbow';

        test.jsonp.get.andCallFake(function(url, data, cb) {
          expect(url).toEqual('//open.mapquestapi.com/geocoding/v1/address' +
            '?key=' + test.apiId);
          expect(data).toEqual({
            location: location
          });
        });

        test.gcs.geocode(location);

        expect(test.jsonp.get).toHaveBeenCalled();
      });

      it('should handle api errors', function() {
        var test = testFactory({
          apiResponse: getErrorResponse()
        });
        var failSpy = jasmine.createSpy('fail')
          .andCallFake(function(res) {
            expect(res.latLon).toEqual([]);
            expect(res.status).toEqual({
              apiCode: test.apiResponse.info.statuscode,
              code: GeocodeServiceStatus.API_ERROR,
              message: test.apiResponse.info.messages.join('; ')
            });
          });

        test.gcs.geocode('someplace').fail(failSpy);

        expect(failSpy).toHaveBeenCalled();
      });

      it('should reject the promise if no results are returned', function() {
        var test;
        var failSpy = jasmine.createSpy('failSpy');
        var resp = getSuccessResponse();
        resp.results = [];

        // Set expectations on failSpy params
        failSpy.andCallFake(function(res) {
          expect(res.latLon).toEqual([]);
          expect(res.status.code).toEqual(GeocodeServiceStatus.NO_RESULTS);
        });


        test = testFactory({
          apiResponse: resp
        });

        test.gcs.geocode('someplace').
          fail(failSpy);

        expect(failSpy).toHaveBeenCalled();
      });

      it('should return sucessful api responses', function() {
        var test = testFactory({
          apiResponse: getSuccessResponse()
        });
        var successSpy = jasmine.createSpy('success')
          .andCallFake(function(res) {
            var resLocation = test.apiResponse.results[0].locations[0];
            expect(res.latLon).toEqual([
              parseFloat(resLocation.latLng.lat),
              parseFloat(resLocation.latLng.lng)
            ]);
            expect(res.status).toEqual({
              apiCode: test.apiResponse.info.statuscode,
              code: GeocodeServiceStatus.OK,
              message: test.apiResponse.info.messages.join('; ')
            });
          });

        test.gcs.geocode('someplace').done(successSpy);

        expect(successSpy).toHaveBeenCalled();
      });

      it('should handle an unexpected api response', function() {
        var test = testFactory({
          apiResponse: { foo: 'bar' }
        });
        var failSpy = jasmine.createSpy('failSpy')
          .andCallFake(function(res) {
            expect(res.latLon).toEqual([]);
            expect(res.status.code).toEqual(GeocodeServiceStatus.API_ERROR);
            expect(res.status.apiCode).toEqual('');
          });

        test.gcs.geocode('someplace').fail(failSpy);

        expect(failSpy).toHaveBeenCalled();
      });

    });


  });
});
