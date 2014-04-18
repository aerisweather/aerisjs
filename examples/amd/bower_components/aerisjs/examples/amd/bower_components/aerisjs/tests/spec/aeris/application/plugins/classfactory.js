define([
  'aeris/model',
  'wire!./fixtures/config/classfactory'
], function(Model, ctx) {
  describe('The WireJS ClassFactory plugin', function() {
    describe('Integration', function() {

      it('should create a Model with default attributes and options', function() {
        var modelInstance;

        expect(ctx.ModelFactory).toBeDefined();
        expect(_.isFunction(ctx.ModelFactory)).toEqual(true);

        modelInstance = new ctx.ModelFactory({
          color: 'red'
        });

        expect(modelInstance).toBeInstanceOf(Model);
        expect(modelInstance.get('color')).toEqual('red');
        expect(modelInstance.get('width')).toEqual(100);
      });

    });

  });
});
