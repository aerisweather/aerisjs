define([
  'aeris/util',
  'api/endpoint/collection/aerisapicollection',
  'aeris/model',
  'api/params/model/params'
], function(_, AerisApiCollection, Model, Params) {

  var MockParams = function() {
    Model.apply(this, arguments);
  }

  _.inherits(MockParams, Model);


  var MockJSONP = function() {
    this.get = jasmine.createSpy('get');
  }

  MockJSONP.prototype.getRequestedUrl = function() {
    return this.get.mostRecentCall.args[0];
  };

  MockJSONP.prototype.getRequestedData = function() {
    return this.get.mostRecentCall.args[1];
  };

  MockJSONP.prototype.getRequestedCallback = function() {
    return this.get.mostRecentCall.args[2];
  };


  var MockSuccessResponse = function() {
    return {
      success: true
    };
  };

  var MockFailResponse = function() {
    return {
      success: false
    }
  };


  function TestFactory(opt_options) {
    var options = _.extend({
      server: 'SERVER_STUB',
      action: 'ACTION_STUB',
      endpoint: 'ENDPOINT_STUB',
      params: new MockParams(),
      jsonp: new MockJSONP()
    }, opt_options);

    this.collection = new AerisApiCollection(options.models, options);

    this.options = options;
  }


  describe('An AerisApiCollection', function() {

    describe('constructor', function() {

      it('should create a new Params model', function() {
        var apiCollection = new AerisApiCollection();

        expect(apiCollection.getParams()).toBeInstanceOf(Params);
      });

      it('should set a params model', function() {
        var myParams = new Model();
        var apiCollection = new AerisApiCollection(null, {
          params: myParams
        });

        expect(apiCollection.getParams()).toEqual(myParams);
      });

      it('should set a params object to a model', function() {
        var paramsObj = {
          to: 'here',
          from: 'there'
        };
        var apiCollection = new AerisApiCollection(null, {
          params: paramsObj
        });

        expect(apiCollection.getParams().get('to')).toEqual('here');
        expect(apiCollection.getParams().get('from')).toEqual('there');
      });

    });

    describe('sync', function() {

      it('should restrict usage to GET requests', function() {
        var test = new TestFactory();
        var restrictedMethods = [
          'create',
          'update',
          'delete',
          'hack'
        ];

        _.each(restrictedMethods, function(method) {
          expect(function() {
            test.collection.sync(method);
          }).toThrowType('InvalidArgumentError');
        });

        // Should not throw error
        test.collection.sync('read');
      });

    });


    describe('fetch', function() {
      var test, apiCollection, jsonp, params;
      var server, action, endpoint;

      beforeEach(function() {
        test = new TestFactory();
        params = test.options.params;
        apiCollection = test.collection;
        jsonp = test.options.jsonp;

        server = test.options.server;
        action = test.options.action;
        endpoint = test.options.endpoint;
      });

      it('should target SERVERENDPOINT/ACTION/', function() {
        apiCollection.fetch();

        expect(jsonp.getRequestedUrl()).toEqual(server + endpoint + '/' + action + '/');
      });

      it('should trigger a request event', function() {
        var onRequest = jasmine.createSpy('onRequest');
        apiCollection.on('request', onRequest);

        apiCollection.fetch();

        expect(onRequest).toHaveBeenCalledWith(apiCollection);
      });

      it('should send parameters as request data', function() {
        var PARAMS_JSON = {
          foo: 'bar',
          waz: 'baz'
        };
        params.set(PARAMS_JSON);

        apiCollection.fetch();

        expect(jsonp.getRequestedData()).toEqual(PARAMS_JSON);
      });


      describe('On complete', function() {
        var jsonpCallback, SUCCESS_RESPONSE, FAIL_RESPONSE;
        var fetchPromise, onSuccess, onError, onComplete;

        beforeEach(function() {
          onSuccess = jasmine.createSpy('onSuccess');
          onError = jasmine.createSpy('onError');
          onComplete = jasmine.createSpy('onComplete');

          fetchPromise = apiCollection.fetch({
            success: onSuccess,
            error: onError,
            complete: onComplete
          });
          jsonpCallback = jsonp.getRequestedCallback();

          SUCCESS_RESPONSE = new MockSuccessResponse();
          FAIL_RESPONSE = new MockFailResponse();
        });


        it('should trigger a \'sync\' event on success', function() {
          var onSync = jasmine.createSpy('onSync');
          apiCollection.on('sync', onSync);

          jsonpCallback(SUCCESS_RESPONSE);

          expect(onSync).toHaveBeenCalledWith(apiCollection, SUCCESS_RESPONSE);
        });

        it('should resolve it\'s promise with the jsonp data', function() {
          var onResolve = jasmine.createSpy('onResolve');
          fetchPromise.done(onResolve);

          jsonpCallback(SUCCESS_RESPONSE);

          expect(onResolve).toHaveBeenCalledWith(SUCCESS_RESPONSE);
        });

        it('should call the \'success\' option on success', function() {
          jsonpCallback(SUCCESS_RESPONSE);

          expect(onSuccess).toHaveBeenCalledWithSomeOf(SUCCESS_RESPONSE);
        });

        it('should call the \'complete\' option on success', function() {
          jsonpCallback(SUCCESS_RESPONSE);

          expect(onComplete).toHaveBeenCalledWithSomeOf(SUCCESS_RESPONSE);
        });

        it('should throw an ApiResponseError on failure', function() {
          expect(function() {
            jsonpCallback(FAIL_RESPONSE);
          }).toThrowType('APIResponseError');
        });

      })
    });

  });

});
