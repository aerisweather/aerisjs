define([
  'aeris/util',
  'wire',
  'testUtils'
], function(_, wire, testUtil) {
  var plugins = ['application/plugin/attrresolver'];

  var throwUncatchable = function(e) {
    _.defer(function() {
      throw e;
    })
  };

  describe('An AttResolver WireJS Plugin', function() {

    it('should resolve a model attribute', function() {
      wire({
        someModel: {
          create: {
            module: 'aeris/model',
            args: [{
              deep: {
                nested: {
                  attr: 'value'
                }
              }
            }]

          }
        },

        deepNestedValue: { $ref: 'attr!someModel.deep.nested.attr' },

        undefinedValue: { $ref: 'attr!someModel.foo.bar.waz'},

        plugins: plugins
      }).then(function(ctx) {
          expect(ctx.deepNestedValue).toEqual('value');
          expect(ctx.undefinedValue).toEqual(undefined);
          testUtil.setFlag();
        }).
        otherwise(throwUncatchable);

      waitsFor(testUtil.checkFlag, '500', 'Wire to complete');
    });

    it('should complain if the model doesn\'t exist', function() {
      wire({
          deepNestedValue: { $ref: 'attr!someModel.deep.nested.attr' },

          plugins: plugins
        }).
        then(
          function() {},
          function() {
            testUtil.setFlag();
          }
        );

      waitsFor(testUtil.checkFlag, '500', 'Wire to complete');
    });

  });

});
