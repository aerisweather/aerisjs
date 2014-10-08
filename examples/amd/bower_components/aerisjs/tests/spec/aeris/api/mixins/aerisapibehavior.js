define([
  'aeris/util',
  'aeris/api/mixins/aerisapibehavior',
  'aeris/events',
  'aeris/model',
  'aeris/errors/apiresponseerror',
  'mocks/mockfactory',
  'mocks/aeris/jsonp'
], function(_, AerisApiBehavior, Events, Model, ApiResponseError, MockFactory, MockJSONP) {
  var ConcreteAerisApi = function(options) {
    this.params_ = options.params;
    this.jsonp_ = options.jsonp;

    Events.call(this);
  };
  _.extend(ConcreteAerisApi.prototype, AerisApiBehavior);
  _.extend(ConcreteAerisApi.prototype, Events.prototype);

  var MockParams = new MockFactory({
    methods: [
      'setBounds',
      'addFilter',
      'removeFilter',
      'resetFilter',
      'addQuery',
      'removeQuery',
      'resetQuery'
    ],
    inherits: Model
  });


  describe('AerisApiBehavior', function() {
    var aerisApi, mockParams, jsonp, OPTIONS_STUB;

    beforeEach(function() {
      OPTIONS_STUB = { STUB: 'OPTIONS_STUB' };
      mockParams = new MockParams();
      jsonp = new MockJSONP();
      aerisApi = new ConcreteAerisApi({
        params: mockParams,
        jsonp: jsonp
      });
    });


    describe('setParams', function() {
      var ATTRS_STUB = { stub: 'ATTRS_STUB' };

      it('should set params attributes', function() {
        spyOn(mockParams, 'set').andCallFake(function(attrs, opts) {
          expect(attrs).toEqual(ATTRS_STUB);
        });

        aerisApi.setParams(ATTRS_STUB);
      });

      it('should always validate', function() {
        spyOn(mockParams, 'set').andCallFake(function(attrs, opts) {
          expect(opts.validate).toEqual(true);
        });

        aerisApi.setParams(ATTRS_STUB);
      });

    });

    describe('*Filter methods', function() {
      var FILTER_STUB = 'FILTER_STUB';

      it('should proxy params *Filter methods', function() {
        _.each([
          'addFilter',
          'removeFilter',
          'resetFilter'
        ], function(methodName) {
          aerisApi[methodName](FILTER_STUB, OPTIONS_STUB);
          expect(mockParams[methodName]).toHaveBeenCalledWith(FILTER_STUB, OPTIONS_STUB);
        });
      });

    });


    describe('*Query methods', function() {
      var QUERY_STUB = 'QUERY_STUB';


      it('should proxy params *Query command methods', function() {
        _.each([
          'addQuery',
          'removeQuery',
          'resetQuery'
        ], function(methodName) {
          aerisApi[methodName](QUERY_STUB, OPTIONS_STUB);
          expect(mockParams[methodName]).toHaveBeenCalledWith(QUERY_STUB, OPTIONS_STUB);
        });
      });

    });


    describe('sync', function() {

      describe('when the response contains an error object', function() {
        var ERROR_CODE_STUB, RESPONSE_STUB;

        function getFetchError() {
          var error;

          aerisApi.sync('read', aerisApi, {}).
            // Assuming fetch is stubbed to be synchronous
            fail(function(err) {
              error = err;
            });

          if (!error) {
            throw 'Fetch did not throw an error.';
          }

          return error;
        }

        beforeEach(function() {
          ERROR_CODE_STUB = 'ERROR_CODE_STUB';
          RESPONSE_STUB = {
            success: false,
            error: {
              code: ERROR_CODE_STUB,
              description: 'ERR_DESCR_STUB'
            }
          };
          jsonp.resolveWith(RESPONSE_STUB);
        });


        it('should reject with an AeriApiResponseError', function() {
          expect(getFetchError()).toBeInstanceOf(ApiResponseError);
        });

        describe('the AeriApiResponseError', function() {

          it('should contain the error code', function() {
            expect(getFetchError().code).toEqual(ERROR_CODE_STUB);
          });

          it('should contain the response object', function() {
            expect(getFetchError().responseObject).toEqual(RESPONSE_STUB);
          });

        });

      });

    });

  });
});
