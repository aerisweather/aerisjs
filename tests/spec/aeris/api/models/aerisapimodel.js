define([
  'aeris/util',
  'aeris/api/models/aerisapimodel',
  'mocks/aeris/config',
  'mocks/aeris/jsonp'
], function(_, AerisApiModel, MockConfig, MockJSONP) {

  var NoResultsResponse = function() {
    return {
      success: true,
      error: {
        code: 'warn_no_data',
        description: 'No data was returned for the request.'
      },
      response: []
    };
  };

  describe('An AerisApiModel', function() {
    var apiModel;
    var jsonp;
    var SERVER_STUB, ENDPOINT_STUB, ID_STUB;

    beforeEach(function() {
      jsonp = new MockJSONP();

      ENDPOINT_STUB = 'ENDPOINT_STUB';
      SERVER_STUB = 'TEST://SERVER.STUB';
      ID_STUB = 'ID_STUB';

      apiModel = new AerisApiModel({
        id: ID_STUB
      }, {
        jsonp: jsonp,
        server: SERVER_STUB,
        endpoint: ENDPOINT_STUB
      });

      MockConfig.stubApiKeys();
    });

    afterEach(function() {
      MockConfig.restore();
    });



    describe('fetch', function() {
      var fetchOptions;
      var onError, onSuccess;

      beforeEach(function() {
        onError = jasmine.createSpy('onError');
        onSuccess = jasmine.createSpy('onSuccess');
        fetchOptions = {
          error: onError,
          success: onSuccess
        };
      });


      it('should append the model id onto the request url', function() {
        apiModel.fetch();

        expect(jsonp.getRequestedUrl()).toEqual(SERVER_STUB + '/' + ENDPOINT_STUB + '/' + ID_STUB);
      });

      it('should not require a model id', function() {
        apiModel.id = null;

        apiModel.fetch();
        expect(jsonp.getRequestedUrl()).toEqual(SERVER_STUB + '/' + ENDPOINT_STUB + '/');
      });

    });


    describe('parse', function() {
      var modelA, modelB, modelC;

      beforeEach(function() {
        modelA = {
          model: 'A'
        };
        modelB = {
          model: 'B'
        };
        modelC = {
          model :'C'
        };
      });



      describe('when the raw data is an array of models', function() {

        it('should return the first model', function() {
          var rawData = [modelA, modelB, modelC];

          expect(apiModel.parse(rawData)).toEqual(modelA);
        });
      });

      describe('when the raw data contains a `response` property', function() {

        describe('when the `response` property is an array of models', function() {

          it('should return the first model in the response array', function() {
            var rawData = {
              response: [modelA, modelB, modelC]
            };

            expect(apiModel.parse(rawData)).toEqual(modelA);
          });
        });

        describe('when the `response` property is a single model', function() {

          it('should return the response object', function() {
            var rawData = {
              response: modelA
            };

            expect(apiModel.parse(rawData)).toEqual(modelA);
          });

        });

      });

      describe('when the raw data is a single model', function() {
        // For example, when the collection is using the model's
        // #parse method to parse a raw data collection.

        it('should return the raw data model', function() {
          var rawData = modelA;

          expect(apiModel.parse(rawData)).toEqual(modelA);
        });

      });

    });


    describe('testFilter', function() {

      // It's the job of child classes to
      // implement testFilter.
      it('it should return false, by default', function() {
        expect(apiModel.testFilter()).toEqual(true);
      });

    });

  });

});
