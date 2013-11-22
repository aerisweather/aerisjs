define([
  'aeris/util',
  'sinon',
  'api/endpoint/collection/aerisapicollection',
  'aeris/aerisapi'
], function(_, sinon, AerisApiCollection, AerisApi) {

  function TestFactory(opt_options) {
    var options = _.extend({
      endpoints: [{ name: 'someendpoint' }],
      params: undefined,
      models: undefined,
      api: new MockApi()
    }, opt_options);

    this.collection = new AerisApiCollection(options.models, {
      endpoints: options.endpoints,
      params: options.params,
      api: options.api
    });

    this.options = options;
  }


  function MockApi() {
    spyOn(this, 'fetchBatch');
  }
  _.inherits(MockApi, AerisApi);
  MockApi.prototype = sinon.createStubInstance(AerisApi);


  describe('An AerisApiCollection', function() {

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

  });

});
