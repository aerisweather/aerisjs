define([
  'aeris/util',
  'aeris/api/collections/aerisapiclientcollection',
  'aeris/api/collections/aerisapicollection',
  'aeris/subsetcollection',
  'aeris/collection',
  'aeris/model',
  'mocks/mockfactory'
], function(_, AerisApiClientCollection, AerisApiCollection, SubsetCollection, Collection, Model, MockFactory) {

  var MockFilter = Model;

  var MockFilterCollection = function(opt_models) {
    Collection.call(this, opt_models);
  };
  _.inherits(MockFilterCollection, Collection);


  var MockParams = function(opt_attrs) {
    var attrs = _.defaults(opt_attrs || {}, {
      filter: new MockFilterCollection()
    });

    Model.call(this, attrs);
  };
  _.inherits(MockParams, Model);

  var MockApiModel = new MockFactory({
    inherits: Model,
    methods: [
      'testFilterCollection',
      'testFilter'
    ]
  });

  MockApiModel.prototype.testFilterCollection = function() {
    return false;
  };

  MockApiModel.prototype.testFilter = function() {
    return false;
  };


  var MockApiCollection = new MockFactory({
    inherits: Collection,
    methods: [
      'getParams',
      'setParams',
      'setFrom',
      'setTo',
      'setBounds',
      'addFilter',
      'removeFilter',
      'resetFilter',
      'addQuery',
      'removeQuery',
      'resetQuery',
      'getQuery'
    ],
    constructor: function(opt_models, opt_options) {
      var options = _.defaults(opt_options || {}, {
        params: new MockParams()
      });

      this.ctorArgs_ = _.argsToArray(arguments);

      this.params_ = options.params;
    }
  });

  MockApiCollection.prototype.getCtorArgs = function() {
    return this.ctorArgs_;
  };

  MockApiCollection.prototype.getCtorModels = function() {
    return this.ctorArgs_[0];
  };

  MockApiCollection.prototype.getCtorOptions = function() {
    return this.ctorArgs_[1];
  };

  MockApiCollection.prototype.stubParams = function(params) {
    this.params_ = params;
  };


  MockApiCollection.prototype.getParams = function() {
    return this.params_;
  };


  describe('An AerisApiClientCollection', function() {
    var aerisApiClientCollection;
    var mockFilterCollection, mockParams, mockApiCollection;
    var MockSourceCollectionType;

    beforeEach(function() {
      mockFilterCollection = new MockFilterCollection();
      mockParams = new MockParams({
        filter: mockFilterCollection
      });
      mockApiCollection = new MockApiCollection(null, {
        params: mockParams
      });

      // Mock the SourceCollection to always return our mockApiCollection instance
      MockSourceCollectionType = jasmine.createSpy('MockAerisApiCollection').
        andReturn(mockApiCollection);

      aerisApiClientCollection = new AerisApiClientCollection(null, {
        SourceCollectionType: MockSourceCollectionType
      });
    });


    describe('constructor', function() {

      it('should create a SourceCollection', function() {
        expect(MockSourceCollectionType).toHaveBeenCalled();
      });

      describe('the created source collection', function() {

        it('should have been constructed with any models provided to the subset collection', function() {
          var MODELS_STUB = [
            { STUB: 'MODELS_STUB_A' },
            { STUB: 'MODELS_STUB_B' }
          ];

          new AerisApiClientCollection(MODELS_STUB, {
            SourceCollectionType: MockSourceCollectionType
          });

          expect(MockSourceCollectionType.mostRecentCall.args[0]).toEqual(MODELS_STUB);
        });

        it('should have been constructed with api options (params, endpoint, action, model, server)', function() {
          var PARAMS_STUB = 'PARAMS_STUB', ENDPOINT_STUB = 'ENDPOINT_STUB', ACTION_STUB = 'ACTION_STUB';
          var MODEL_STUB = 'MODEL_STUB', SERVER_STUB = 'SERVER_STUB';
          var apiOptions = {
            params: PARAMS_STUB,
            endpoint: ENDPOINT_STUB,
            action: ACTION_STUB,
            model: MODEL_STUB,
            server: SERVER_STUB
          };
          var otherOptions = {
            SourceCollectionType: MockSourceCollectionType,
            foo: 'bar',
            faz: 'baz'
          };

          new AerisApiClientCollection(null, _.extend({}, apiOptions, otherOptions));

          expect(MockSourceCollectionType.mostRecentCall.args[1]).toEqual(apiOptions);
          expect(MockSourceCollectionType.mostRecentCall.args[1]).not.toEqual(otherOptions);
        });

      });

    });


    describe('Client side filter bindings to API Filters', function() {

      beforeEach(function() {
        spyOn(AerisApiClientCollection.prototype, 'setClientFilter');
        spyOn(AerisApiClientCollection.prototype, 'removeClientFilter');
      });


      function itShouldUpdateClientFilters() {

        it('should set a client side filter', function() {
          expect(aerisApiClientCollection.setClientFilter).toHaveBeenCalled();
        });

        it('should set a client side filter using API filters', function() {
          var theSetFilter = aerisApiClientCollection.setClientFilter.mostRecentCall.args[0];
          var mockApiModel = new MockApiModel();
          var TEST_RESULT_STUB = 'TEST_RESULT_STUB';

          mockApiModel.testFilterCollection.andReturn(TEST_RESULT_STUB);

          // The filter set on the client collection
          // will use the model's 'testFilterCollection' method
          // to check that the model passes the filters
          expect(theSetFilter(mockApiModel)).toEqual(TEST_RESULT_STUB);
          expect(mockApiModel.testFilterCollection).toHaveBeenCalledWith(mockFilterCollection);
        });

      }

      function itShouldRemoveClientFilters() {

        it('should remove client side filters ', function() {
          expect(aerisApiClientCollection.removeClientFilter).toHaveBeenCalled();
        });
      }

      describe('on construction', function() {

        describe('if filters are defined as ctor options', function() {

          beforeEach(function() {
            mockFilterCollection.add(new MockFilter());

            aerisApiClientCollection = new AerisApiClientCollection(null, {
              SourceCollectionType: MockSourceCollectionType,
              params: mockParams
            });
          });


          itShouldUpdateClientFilters();

        });

        describe('if no filters are defined as ctor options', function() {

          it('should not set any client filters', function() {
            mockFilterCollection.reset();
            aerisApiClientCollection = new AerisApiClientCollection(null, {
              SourceCollectionType: MockSourceCollectionType,
              params: mockParams
            });
          });

        });

      });

      describe('when API filters are added', function() {

        beforeEach(function() {
          mockFilterCollection.add(new MockFilter());
        });

        itShouldUpdateClientFilters();


      });

      describe('when API filters are removed', function() {
        var mockFilterA, mockFilterB;

        beforeEach(function() {
          mockFilterA = new MockFilter(), mockFilterB = new MockFilter();
          mockFilterCollection.add([mockFilterA, mockFilterB]);
        });

        describe('if all filters are removed', function() {

          beforeEach(function() {
            mockFilterCollection.remove([mockFilterA, mockFilterB]);
          });


          itShouldRemoveClientFilters();

        });

        describe('if some filters remain', function() {

          beforeEach(function() {
            mockFilterCollection.remove(mockFilterA);
          });


          itShouldUpdateClientFilters();

        });

      });


      describe('when API filters change', function() {

        beforeEach(function() {
          var mockFilter = new MockFilter();

          mockFilterCollection.add(mockFilter);
          mockFilter.set('foo', 'bar');
        });


        itShouldUpdateClientFilters();

      });


      describe('when API filters are reset', function() {

        describe('if all filters are removed', function() {

          beforeEach(function() {
            mockFilterCollection.reset();
          });


          itShouldRemoveClientFilters();

        });

        describe('if new filters are added', function() {

          beforeEach(function() {
            mockFilterCollection.reset([new MockFilter(), new MockFilter()]);
          });


          itShouldUpdateClientFilters();

        });

      });

    });

    function shouldProxyMethod(sourceObj, sourceName, sourceMethod, opt_proxyMethod) {
      var proxyMethod = opt_proxyMethod || sourceMethod;

      describe(proxyMethod, function() {

        it('should proxy the ' + sourceName + '#' + sourceMethod + ' method', function() {
          var args = ['ARG_A', 'ARG_B', 'ARG_C'];
          aerisApiClientCollection[proxyMethod].apply(aerisApiClientCollection, args);

          expect(sourceObj[sourceMethod]).toHaveBeenCalled();
        });

      });

    }

    describe('SubsetCollection proxy methods', function() {

      var shouldProxySubsetCollectionMethod = _.partial(shouldProxyMethod, SubsetCollection.prototype, 'SubsetCollection');

      beforeEach(function() {
        _.each([
          'setFilter',
          'removeFilter',
          'setLimit',
          'removeLimit'
        ], function(methodName) {
          spyOn(SubsetCollection.prototype, methodName);
        });
      });


      shouldProxySubsetCollectionMethod('setFilter', 'setClientFilter');
      shouldProxySubsetCollectionMethod('removeFilter', 'removeClientFilter');
      shouldProxySubsetCollectionMethod('setLimit', 'setClientLimit');
      shouldProxySubsetCollectionMethod('removeLimit', 'removeClientLimit');

    });


    describe('AerisApiCollection proxy methods', function() {

      var aerisApiProxyMethods = [
        'getParams',
        'setParams',
        'setFrom',
        'setTo',
        'setBounds',
        'addFilter',
        'removeFilter',
        'resetFilter',
        'addQuery',
        'removeQuery',
        'resetQuery',
        'getQuery'
      ];
      _.each(aerisApiProxyMethods, function(methodName) {
        it('should proxy the mockApiColleciton#' + methodName + ' method', function() {
          var args = ['ARG_A', 'ARG_B', 'ARG_C'];
          aerisApiClientCollection[methodName].apply(aerisApiClientCollection, args);

          expect(mockApiCollection[methodName]).toHaveBeenCalled();
        });
      });

    });


  });

});
