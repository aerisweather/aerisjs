define([
  'aeris/util',
  'aeris/api/models/aerisbatchmodel',
  'mocks/aeris/jsonp',
  'mocks/mockfactory',
  'aeris/model',
  'aeris/api/models/aerisapimodel'
], function(_, AerisBatchModel, MockJSONP, MockFactory, Model, AerisApiModel) {

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
    var mockJSONP;
    var SERVER_STUB = 'SERVER_STUB';
    var mockModel_A, mockModel_B;

    beforeEach(function() {
      mockJSONP = new MockJSONP();
      mockModel_A = new MockApiModel();
      mockModel_B = new MockApiModel();

      batchModel = new AerisBatchModel(null, {
        jsonp: mockJSONP,
        server: SERVER_STUB
      });
    });


    describe('fetch', function() {

      describe('when models have been added', function() {

        beforeEach(function() {
          batchModel.set({
            modelA: mockModel_A,
            modelB: mockModel_B
          });
        });


        describe('the jsonp request url', function() {

          it('should target the \'batch\' endpoint on the AerisApi server', function() {
            batchModel.fetch();

            expect(mockJSONP.getRequestedUrl()).toMatch(SERVER_STUB + '/batch');
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

              expect(mockJSONP.getRequestedUrl()).toMatch(actionRe);
            });

          });

          describe('when no id is set', function() {

            it('should use no endpoint action', function() {
              var hasActionRe = new RegExp('/[a-z]+/[a-z]+');
              batchModel.unset('id');
              batchModel.fetch();

              expect(mockJSONP.getRequestedUrl()).not.toMatch(hasActionRe);
            });

          });

        });

        describe('the jsonp request data', function() {

          describe('the \'requests\' parameter', function() {
            var requestsParam, modelAParams;

            beforeEach(function() {
              modelAParams = new Model({
                foo: 'bar',
                faz: 'baz'
              });
              mockModel_A.getParams.andReturn(modelAParams);

              batchModel.fetch();

              requestsParam = mockJSONP.getRequestedData().requests;
            });

            describe('each component model request', function() {

              it('should contain the endpoint for the model', function() {
                [mockModel_A, mockModel_B].forEach(function(model) {
                  expect(requestsParam).toMatch('/' + model.getEndpoint());
                });
              });

              it('should contain serialized and encoded model params', function() {
                expect(requestsParam).toMatch(
                  mockModel_A.getEndpoint() +
                    // Note that request params order is not known,
                    // so we need to check in either order
                    '%3F(foo=bar%26faz=baz|faz=baz%26foo=bar)'
                );
              });

              it('should be comma-separated', function() {
                // Matches /[whatever],/[whatever]
                expect(requestsParam).toMatch(/\/.*,\/.*/i);
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

          expect(mockJSONP.getRequestedData().foo).toEqual('bar');
          expect(mockJSONP.getRequestedData().faz).toEqual('baz');
        });

      });

    });

    describe('parse', function() {
      var batchResponse, modelResponse_A, modelResponse_B;
      var PARSED_STUB_A, PARSED_STUB_B;

      beforeEach(function() {
        batchModel.set({
          modelA: mockModel_A,
          modelB: mockModel_B
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

        mockModel_A.parse = jasmine.createSpy('parse_A').
          andReturn(PARSED_STUB_A);
        mockModel_B.parse = jasmine.createSpy('parse_A').
          andReturn(PARSED_STUB_B);


        // Fetch is required for parse logic
        batchModel.fetch();
      });

      it('should parse the response for each model, and set it on the model', function() {
        var attrs = batchModel.parse(batchResponse);

        expect(mockModel_A.parse).toHaveBeenCalledWith(modelResponse_A);
        expect(mockModel_B.parse).toHaveBeenCalledWith(modelResponse_B);

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
        mockModel_A.toJSON.andReturn(json_A);
        mockModel_B.toJSON.andReturn(json_B);

        batchModel.set({
          modelA: mockModel_A,
          modelB: mockModel_B,
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


  });


});
