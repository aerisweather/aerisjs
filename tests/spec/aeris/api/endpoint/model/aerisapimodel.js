define([
  'aeris/util',
  'api/endpoint/model/aerisapimodel',
  'aeris/config',
  'mocks/aeris/jsonp'
], function(_, AerisApiModel, aerisConfig, MockJSONP) {

  var NoResultsResponse = function() {
    return {
      success: true, 
      error: {
        code: "warn_no_data", 
        description: "No data was returned for the request."
      }, 
      response: []
    }
  };

  describe('An AerisApiModel', function() {
    var apiModel;
    var jsonp;
    var SERVER_STUB, ENDPOINT_STUB, ID_STUB;
    var API_ID_STUB, API_SECRET_STUB;
    var apiId_orig = aerisConfig.get('apiId');
    var apiSecret_orig = aerisConfig.get('apiSecret');

    beforeEach(function() {
      jsonp = new MockJSONP();

      ENDPOINT_STUB = 'ENDPOINT_STUB';
      SERVER_STUB = 'TEST://SERVER.STUB/';
      ID_STUB = 'ID_STUB';

      API_ID_STUB = 'API_ID_STUB';
      API_SECRET_STUB = 'API_SECRET_STUB';

      apiModel = new AerisApiModel({
        id: ID_STUB
      }, {
        jsonp: jsonp,
        server: SERVER_STUB,
        endpoint: ENDPOINT_STUB
      });

      aerisConfig.set({
        apiId: API_ID_STUB,
        apiSecret: API_SECRET_STUB
      });
    });

    afterEach(function() {
      aerisConfig.set({
        apiId: apiId_orig,
        apiSecret: apiSecret_orig
      })
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
        }
      });


      it('should errback if the model cannot be found on the server', function() {
        jsonp.respondWith(new NoResultsResponse());

        expect(function() {
          apiModel.fetch(fetchOptions);
        }).toThrowType('APIResponseError');

        expect(onError).toHaveBeenCalled();
      });

    });

  });

});
