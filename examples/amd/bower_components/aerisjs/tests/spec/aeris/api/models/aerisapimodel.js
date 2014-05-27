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


    describe('testFilter', function() {

      // It's the job of child classes to
      // implement testFilter.
      it('it should return false, by default', function() {
        expect(apiModel.testFilter()).toEqual(true);
      });

    });

  });

});
