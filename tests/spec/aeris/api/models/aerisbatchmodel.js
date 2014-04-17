define([
  'aeris/util',
  'aeris/api/models/aerisbatchmodel',
  'mocks/aeris/jsonp',
  'aeris/model'
], function(_, AerisBatchModel, MockJSONP, Model) {

  AerisBatchModel.prototype.jasmineToString = function() {
    return 'AerisBatchModel_' + this.cid;
  };

  var MockApiModel = function(opt_attrs, opt_options) {
    Model.call(this, opt_attrs, opt_options);
  };
  _.inherits(MockApiModel, Model);

  MockApiModel.prototype.jasmineToString = function() {
    return 'MockApiModel_' + this.cid;
  };

  MockApiModel.prototype.getEndpoint = function() {
    return _.template('MockApiModel{id}ENDPOINTSTUB', {
      id: this.cid
    });
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

    describe('constructor', function() {

      it('should add the provided models (option)', function() {
        var mockModel_A = new MockApiModel();
        var mockModel_B = new MockApiModel();

        spyOn(AerisBatchModel.prototype, 'addModel');

        batchModel = new AerisBatchModel(null, {
          models: [mockModel_A, mockModel_B],
          jsonp: mockJSONP
        });

        expect(batchModel.addModel).toHaveBeenCalledInTheContextOf(batchModel);
        expect(batchModel.addModel).toHaveBeenCalledWith(mockModel_A);
        expect(batchModel.addModel).toHaveBeenCalledWith(mockModel_B);
      });

    });

    describe('fetch', function() {

      describe('when models have been added', function() {

        beforeEach(function() {
          batchModel.addModel(mockModel_A);
          batchModel.addModel(mockModel_B);
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
            var requestsParam;

            beforeEach(function() {
              batchModel.fetch();

              requestsParam = mockJSONP.getRequestedData().requests;
            });

            describe('each component model request', function() {

              it('should contain the endpoint for the model', function() {
                [mockModel_A, mockModel_B].forEach(function(model) {
                  expect(requestsParam).toMatch('/' + model.getEndpoint());
                });
              });

              it('should be comma-separated', function() {
                expect(requestsParam).toMatch(/\/[a-z|0-9]+,\/[a-z|0-9]+/i);
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
        mockJSONP.resolveWith(batchResponse);
      });

      beforeEach(function() {
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

        batchModel.addModel(mockModel_A);
        batchModel.addModel(mockModel_B);


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
      });

      it('should combine the responses into a single object, using each model\'s \'parse\' method', function() {
        var attrs = batchModel.parse(batchResponse);

        expect(mockModel_A.parse).toHaveBeenCalledWith(modelResponse_A);
        expect(mockModel_B.parse).toHaveBeenCalledWith(modelResponse_B);

        expect(attrs.attrA).toEqual(PARSED_STUB_A.attrA);
        expect(attrs.attrB).toEqual(PARSED_STUB_B.attrB);
      });

      it('should override common properties, in the order in which the ApiModels were added', function() {
        var attrs = batchModel.parse(batchResponse);

        // Should use model B's attr, overriding the same
        // attr from the response for A, because model B was added
        // after model A.
        expect(attrs.commonAttr).toEqual(PARSED_STUB_B.commonAttr);
      });

    });

  });


});
