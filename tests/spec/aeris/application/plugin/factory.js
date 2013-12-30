define([
  'wire',
  'testUtils',
  'aeris/model'
], function(wire, testUtil, Model) {
  describe('The WireJS factory plugin', function() {
    var modId;
    var plugins = [ 'application/plugin/factory' ];

    beforeEach(function() {
      modId = _.unique('MockModule_');
    });

    describe('Integration', function() {

      it('should create a Model with default attributes and options', function() {
        wire({
          ModelFactory: {
            factory: {
              module: 'aeris/model',
              args: [
                {
                  color: 'blue',
                  width: 100
                }
              ]
            }
          },
          $plugins: plugins
        }).then(function(context) {
            var modelInstance;

            expect(context.ModelFactory).toBeDefined();
            expect(_.isFunction(context.ModelFactory)).toEqual(true);

            modelInstance = new context.ModelFactory({
              color: 'red'
            });

            expect(modelInstance.get('color')).toEqual('red');
            expect(modelInstance.get('width')).toEqual(100);

            testUtil.setFlag();
          }, _.throwUncatchable).otherwise(_.throwUncatchable);

        waitsFor(testUtil.checkFlag, 1000, 'wire to resolve');
      });

    });

  });
});
