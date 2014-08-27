define([
  'aeris/util',
  'aeris/api/models/aerisbatchmodel',
  'mocks/aeris/jsonp',
  'mocks/mockfactory',
  'aeris/model',
  'aeris/api/models/aerisapimodel',
  'aeris/errors/apiresponseerror'
], function(_, AerisBatchModel, MockJSONP, MockFactory, Model, AerisApiModel, ApiResponseError) {

  AerisBatchModel.prototype.jasmineToString = function() {
    return 'AerisBatchModel_' + this.cid;
  };

  var MockApiModel = MockFactory({
    inherits: AerisApiModel,
    methods: [
      'getParams',
      'parse',
      'toJSON'
    ],
    name: 'MockApiModel'
  });

  MockApiModel.prototype.getEndpoint = function() {
    return _.template('MockApiModel{id}ENDPOINTSTUB', {
      id: this.cid
    });
  };


  MockApiModel.prototype.getParams = function() {
    return new Model();
  };

  MockApiModel.prototype.parse = function(data) {
    return data;
  };

  MockApiModel.prototype.toJSON = function() {
    return _.clone(this.attributes);
  };


  describe('AerisBatchModel', function() {
    var batchModel;
    var jsonp;
    var SERVER_STUB = 'SERVER_STUB';
    var modelA, modelB;

    beforeEach(function() {
      jsonp = new MockJSONP();
      modelA = new MockApiModel();
      modelB = new MockApiModel();

      batchModel = new AerisBatchModel(null, {
        jsonp: jsonp,
        server: SERVER_STUB
      });
    });


    describe('fetch', function() {

      describe('when models have been added', function() {

        beforeEach(function() {
          batchModel.set({
            modelA: modelA,
            modelB: modelB
          });
        });


        describe('the jsonp request url', function() {

          it('should target the \'batch\' endpoint on the AerisApi server', function() {
            batchModel.fetch();

            expect(jsonp.getRequestedUrl()).toMatch(SERVER_STUB + '/batch');
          });

          describe('when an id is set', function() {
            var BATCH_ID_STUB = 'BATCH_ID_STUB';

            beforeEach(function() {
              batchModel.set('id', BATCH_ID_STUB);
            });


            it('should use the id as the endpoint action', function() {
              // match /:endpoint/:id
              var actionRe = new RegExp('/[a-z]+/' + BATCH_ID_STUB);
              batchModel.fetch();

              expect(jsonp.getRequestedUrl()).toMatch(actionRe);
            });

          });

          describe('when no id is set', function() {

            it('should use no endpoint action', function() {
              var hasActionRe = new RegExp('/[a-z]+/[a-z]+');
              batchModel.unset('id');
              batchModel.fetch();

              expect(jsonp.getRequestedUrl()).not.toMatch(hasActionRe);
            });

          });

        });

        describe('the jsonp request data', function() {

          describe('the \'requests\' parameter', function() {
            var requestsParam, modelAParams;
            var CLIENT_ID_STUB = 'CLIENT_ID_STUB', CLIENT_SECRET_STUB = 'CLIENT_SECRET_STUB';

            beforeEach(function() {
              modelAParams = new Model({
                foo: 'bar',
                faz: 'baz',
                client_id: CLIENT_ID_STUB,
                client_secret: CLIENT_SECRET_STUB
              });
              modelA.getParams.andReturn(modelAParams);

              batchModel.fetch();

              requestsParam = jsonp.getRequestedData().requests;
            });


            it('should include a client_id and client_secret param, copied from any model', function() {
              expect(jsonp.getRequestedData().client_id).toEqual(CLIENT_ID_STUB);
              expect(jsonp.getRequestedData().client_secret).toEqual(CLIENT_SECRET_STUB);
            });

            describe('each component model request', function() {

              it('should contain the endpoint for the model', function() {
                [modelA, modelB].forEach(function(model) {
                  expect(requestsParam).toMatch('/' + model.getEndpoint());
                });
              });

              it('should contain serialized and encoded model params', function() {
                expect(requestsParam).toMatch(
                  modelA.getEndpoint() +
                    // Note that request params order is not known,
                    // so we need to check in either order
                    '%3F(foo=bar%26faz=baz|faz=baz%26foo=bar)'
                );
              });

              it('should be comma-separated', function() {
                // Matches /[whatever],/[whatever]
                expect(requestsParam).toMatch(/\/.*,\/.*/i);
              });

              // Duplicating the client_id/client_secret for every model can
              // potentially cause the url length to exceed the limit.
              it('should not include the client_id/client_secret params in individual model params', function() {
                expect(requestsParam).not.toMatch(CLIENT_ID_STUB);
                expect(requestsParam).not.toMatch(CLIENT_SECRET_STUB);
              });

            });


          });

        });

        it('should contain the batch model params', function() {
          batchModel.setParams({
            foo: 'bar',
            faz: 'baz'
          });

          batchModel.fetch();

          expect(jsonp.getRequestedData().foo).toEqual('bar');
          expect(jsonp.getRequestedData().faz).toEqual('baz');
        });

      });

      describe('response handling', function() {

        function getFetchError() {
          var error;

          batchModel.fetch().
            // Assuming fetch is stubbed to be synchronous
            fail(function(err) {
              error = err;
            });

          if (!error) {
            throw 'Fetch did not throw an error.';
          }

          return error;
        }

        describe('when any individual model response contains an error', function() {
          var ERROR_CODE_STUB, BATCH_RESPONSE_STUB, ERROR_RESPONSE_STUB;

          beforeEach(function() {
            ERROR_CODE_STUB = 'ERROR_CODE_STUB';
            ERROR_RESPONSE_STUB = {
              success: false,
              error: {
                code: ERROR_CODE_STUB,
                description: 'STUB_ERROR_DESCRIPTION'
              },
              response: []
            };
            BATCH_RESPONSE_STUB = {
              success: true,
              error: null,
              response: {
                responses: [
                  {
                    success: true,
                    error: null,
                    response: [
                      {}
                    ]
                  },
                  {
                    success: false,
                    error: {
                      code: ERROR_CODE_STUB,
                      description: 'STUB_ERROR_DESCRIPTION'
                    },
                    response: []
                  }
                ]
              }
            };
            jsonp.resolveWith(BATCH_RESPONSE_STUB);
          });


          it('should reject with an ApiResponseError', function() {
            expect(getFetchError()).toBeInstanceOf(ApiResponseError);
          });

          it('should reject with the correct error code', function() {
            expect(getFetchError().code).toEqual(ERROR_CODE_STUB);
          });

          it('should reject with the response object', function() {
            expect(getFetchError().responseObject).toEqual(ERROR_RESPONSE_STUB);
          });

        });


        describe('when the top level response contains an error', function() {
          var ERROR_CODE_STUB, BATCH_RESPONSE_STUB;

          beforeEach(function() {
            ERROR_CODE_STUB = 'STUB_ERROR_CODE';
            BATCH_RESPONSE_STUB = {
              success: false,
              error: {
                code: ERROR_CODE_STUB,
                description: 'STUB_ERROR_DESCRIPTION'
              }
            };

            jsonp.resolveWith(BATCH_RESPONSE_STUB);
          });

          it('should reject with an ApiResponseError', function() {
            expect(getFetchError()).toBeInstanceOf(ApiResponseError);
          });

          it('should reject with the correct error code', function() {
            expect(getFetchError().code).toEqual(ERROR_CODE_STUB);
          });

          it('should reject with the response object', function() {
            expect(getFetchError().responseObject).toEqual(BATCH_RESPONSE_STUB);
          });

        });

      });

    });

    describe('parse', function() {
      var batchResponse, modelResponse_A, modelResponse_B;
      var PARSED_STUB_A, PARSED_STUB_B;

      beforeEach(function() {
        batchModel.set({
          modelA: modelA,
          modelB: modelB
        });

        modelResponse_A = { STUB: 'RESPONSE_A' };
        modelResponse_B = { STUB: 'RESPONSE_B' };

        batchResponse = {
          success: true,
          error: null,
          response: {
            responses: [
              modelResponse_A,
              modelResponse_B
            ]
          }
        };


        PARSED_STUB_A = {
          attrA: 'ATTR_A_STUB',
          commonAttr: 'COMMON_ATTR_STUB_A'
        };
        PARSED_STUB_B = {
          attrB: 'ATTR_B_STUB',
          commonAttr: 'COMMON_ATTR_STUB_B'
        };

        modelA.parse = jasmine.createSpy('parse_A').
          andReturn(PARSED_STUB_A);
        modelB.parse = jasmine.createSpy('parse_A').
          andReturn(PARSED_STUB_B);


        // Fetch is required for parse logic
        batchModel.fetch();
      });

      it('should parse the response for each model, and set it on the model', function() {
        var attrs = batchModel.parse(batchResponse);

        expect(modelA.parse).toHaveBeenCalledWith(modelResponse_A);
        expect(modelB.parse).toHaveBeenCalledWith(modelResponse_B);

        expect(attrs.modelA.attributes).toEqual(PARSED_STUB_A);
        expect(attrs.modelB.attributes).toEqual(PARSED_STUB_B);
      });

    });

    describe('toJSON', function() {
      var json_A;
      var json_B;


      beforeEach(function() {
        json_A = { stub: 'modelAttr_A' };
        json_B = { stub: 'modelAttr_B' };
        modelA.toJSON.andReturn(json_A);
        modelB.toJSON.andReturn(json_B);

        batchModel.set({
          modelA: modelA,
          modelB: modelB,
          foo: 'bar'
        });
      });


      it('should toJSON\'ify nested models', function() {
        var json = batchModel.toJSON();

        expect(json.modelA).toEqual(json_A);
        expect(json.modelB).toEqual(json_B);
      });

      it('should include all attributes (besides nested models)', function() {
        var json = batchModel.toJSON();

        expect(json.foo).toEqual('bar');
      });

    });


    describe('clear', function() {

      it('should clear all nested models', function() {
        batchModel.set({
          modelA: modelA,
          modelB: modelB
        });
        modelA.set({ foo: 'data' });
        modelB.set({ faz: 'data' });

        batchModel.clear();
        expect(modelA.has('foo')).toEqual(false);
        expect(modelB.has('faz')).toEqual(false);
      });

      it('should not remove nested models', function() {
        batchModel.set({
          modelA: modelA,
          modelB: modelB
        });

        batchModel.clear();
        expect(batchModel.get('modelA')).toEqual(modelA);
        expect(batchModel.get('modelB')).toEqual(modelB);
      });

      it('should remove all non-model attributes', function() {
        batchModel.set({
          modelA: modelA,
          modelB: modelB,
          foo: 'bar'
        });

        batchModel.clear();
        expect(batchModel.has('foo')).toEqual(false);
      });

    });


  });


});
