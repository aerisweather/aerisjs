define([
  'aeris/util',
  'wire!./fixtures/config/attrresolver'
], function(_, ctx) {
  describe('An AttResolver WireJS Plugin', function() {

    it('should resolve a model attribute', function() {
      expect(ctx.modelAttr.deepNestedValue).toEqual('value');
      expect(ctx.modelAttr.undefinedValue).toEqual(undefined);
    });

  });

});
