define([
  'ai/util',
  'ai/api/mixins/aerisapibehavior',
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
    var aerisApi, mockParams;
    
    beforeEach(function() {
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
    
  });
});
