define([
  'aeris/util',
  'aeris/api/mixins/aerisapibehavior',
  'mocks/mockfactory'
], function(_, AerisApiBehavior, MockFactory) {
  var ConcreteAerisApi = function(options) {
    this.params_ = options.params;
  };
  _.extend(ConcreteAerisApi.prototype, AerisApiBehavior);

  var MockParams = new MockFactory({
    methods: [
      'set',
      'setBounds',
      'addFilter',
      'removeFilter',
      'resetFilter',
      'addQuery',
      'removeQuery',
      'resetQuery',
      'get'
    ]
  });


  describe('AerisApiBehavior', function() {
    var aerisApi, mockParams, OPTIONS_STUB;

    beforeEach(function() {
      OPTIONS_STUB = { STUB: 'OPTIONS_STUB' };
      mockParams = new MockParams();
      aerisApi = new ConcreteAerisApi({
        params: mockParams
      });
    });


    describe('setParams', function() {
      var ATTRS_STUB = { stub: 'ATTRS_STUB' };

      it('should set params attributes', function() {
        mockParams.set.andCallFake(function(attrs, opts) {
          expect(attrs).toEqual(ATTRS_STUB);
        });

        aerisApi.setParams(ATTRS_STUB);
      });

      it('should always validate', function() {
        mockParams.set.andCallFake(function(attrs, opts) {
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

  });
});
