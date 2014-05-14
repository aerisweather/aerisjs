define([
  'aeris/util',
  'aeris/api/collections/aerisapicollection',
  'aeris/model',
  'aeris/promise',
  'aeris/api/params/models/params',
  'mocks/aeris/jsonp'
], function(_, AerisApiCollection, Model, Promise, Params, MockJSONP) {

  var MockParams = function() {
    Model.apply(this, arguments);
  };

  _.inherits(MockParams, Model);


  var MockSuccessResponse = function() {
    return {
      success: true,
      response: [
        {
          mock: 'response data'
        }
      ]
    };
  };

  var MockFailResponse = function() {
    return {
      success: false,
      response: []
    };
  };


  var MockNoResultsResponse = function() {
    return {
      success: true,
      error: {
        code: 'warn_no_data',
        description: 'No data was returned for the request.'
      },
      response: []
    };
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


  describe('AerisApiCollection', function() {

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
          foo: 'bar',
          faz: 'baz'
        };
        var apiCollection = new AerisApiCollection(null, {
          params: paramsObj
        });

        expect(apiCollection.getParams().get('foo')).toEqual('bar');
        expect(apiCollection.getParams().get('faz')).toEqual('baz');
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

      it('should target SERVER/ENDPOINT/ACTION/', function() {
        apiCollection.fetch();

        expect(jsonp.getRequestedUrl()).toEqual(server + '/' + endpoint + '/' + action + '/');
      });

      it('should accept an empty action', function() {
        var test = new TestFactory({
          action: ''
        });
        test.collection.fetch();

        expect(test.options.jsonp.getRequestedUrl()).
          toEqual(test.options.server + '/' + test.options.endpoint + '/');
      });

      it('should trigger a request event', function() {
        var onRequest = jasmine.createSpy('onRequest');
        var REQUEST_OPTIONS_STUB = { STUB: 'REQUEST_OPTIONS_STUB' };
        apiCollection.on('request', onRequest);

        onRequest.andCallFake(function(collection, promise) {
          expect(collection).toEqual(apiCollection);
          expect(promise).toBeInstanceOf(Promise);
        });

        apiCollection.fetch();

        expect(onRequest).toHaveBeenCalled();
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

      it('should not create duplicate models, when using the `remove: false` option', function() {
        // This is regarding a bug in Backbone.js.
        // See https://github.com/jashkenas/backbone/issues/3147#issuecomment-43108388
        // and http://jsfiddle.net/tT2D9/3/
        var ModelWithNestedId = function(attrs, opts) {
          Model.call(this, attrs, opts);
        };
        _.inherits(ModelWithNestedId, Model);

        ModelWithNestedId.prototype.parse = function(data) {
          data.id = data.report.id;
          return data;
        };

        apiCollection = new TestFactory({
          model: ModelWithNestedId
        }).collection;

        // Stub response data
        apiCollection.sync = function(method, model, options) {
          var promise = new Promise();
          var data = {
            success: true,
            response: [
              {
                report: {
                  id: 'A'
                }
              },
              {
                report: {
                  id: 'B'
                }
              }
            ]
          };

          options.success(data);
          promise.resolve(data);

          return promise;
        };

        apiCollection.fetch({
          remove: false
        });
        expect(apiCollection.length).toEqual(2);

        apiCollection.fetch({
          remove: false
        });
        expect(apiCollection.length).toEqual(2);
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

          onSync.andCallFake(function(collection, resp) {
            expect(collection).toEqual(apiCollection);
            expect(resp).toEqual(SUCCESS_RESPONSE);
          });

          jsonpCallback(SUCCESS_RESPONSE);

          expect(onSync).toHaveBeenCalled();
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

      });
    });

  });

});
