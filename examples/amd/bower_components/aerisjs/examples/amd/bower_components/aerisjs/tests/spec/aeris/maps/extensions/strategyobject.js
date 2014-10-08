define([
  'aeris/util',
  'aeris/maps/extensions/strategyobject',
  'aeris/promise',
  'testUtils',
  'mocks/require'
], function(_, StrategyObject, Promise, testUtil, MockRequire) {

  var StrategyTypeFactory = function() {
    var Strategy = jasmine.createSpy(_.uniqueId('MockStrategyCtor_'));

    Strategy.prototype.destroy = jasmine.createSpy('MockStrategy#destroy');

    return Strategy;
  };


  function errBack(e) {
    throw e;
  }


  describe('StrategyObject', function() {

    describe('constructor', function() {

      it('should set a strategy', function() {
        var Strategy = StrategyTypeFactory();

        spyOn(StrategyObject.prototype, 'setStrategy');

        new StrategyObject({
          strategy: Strategy
        });

        expect(StrategyObject.prototype.setStrategy).toHaveBeenCalledWith(Strategy);
      });

      it('should not require a strategy argument', function() {
        // Shouldn't throw an error
        new StrategyObject();
      });

      it('should accept null as a strategy', function() {
        new StrategyObject({
          strategy: null
        });
      });

    });


    describe('setStrategy', function() {

      it('should instantiate a strategy', function() {
        var Strategy = StrategyTypeFactory();
        var obj = new StrategyObject();

        obj.setStrategy(Strategy);
        expect(Strategy).toHaveBeenCalledWith(obj);
      });

      it('should remove any existing strategy', function() {
        var OldStrategy = StrategyTypeFactory();
        var NewStrategy = StrategyTypeFactory();
        var obj = new StrategyObject();

        obj.setStrategy(OldStrategy);

        spyOn(obj, 'removeStrategy');
        obj.setStrategy(NewStrategy);

        expect(obj.removeStrategy).toHaveBeenCalled();
      });

      it('should reject invalid constructor', function() {
        var invalids = [
          { foo: 'bar' },
          new Date(),
          undefined
        ];
        var obj = new StrategyObject();

        _(invalids).each(function(baddy) {
          expect(function() {
            obj.setStrategy(baddy);
          }).toThrowType('InvalidArgumentError');
        });

      });

    });


    describe('removeStrategy', function() {

      it('should do nothing if no strategy exists', function() {
        var obj = new StrategyObject();

        // Just don't throw an error
        obj.removeStrategy();
      });

      it('should destroy any existing strategy', function() {
        var obj = new StrategyObject();
        var Strategy = StrategyTypeFactory();

        obj.setStrategy(Strategy);

        obj.removeStrategy();
        expect(Strategy.prototype.destroy).toHaveBeenCalled();
      });

      it('should do nothing the second time you call it, because it has no longer has a reference to the strategy.', function() {
        var obj = new StrategyObject();
        var Strategy = StrategyTypeFactory();

        obj.setStrategy(Strategy);

        obj.removeStrategy();
        obj.removeStrategy();
        expect(Strategy.prototype.destroy.callCount).toEqual(1);
      });

    });

    describe('resetStrategy', function() {
      var strategyObject, StrategyType;

      beforeEach(function() {
        strategyObject = new StrategyObject();
        StrategyType = StrategyTypeFactory();
      });


      describe('if no strategy has been set', function() {

        it('should throw an error', function() {
          expect(function() {
            strategyObject.resetStrategy();
          }).toThrow('Unable to reset strategy: no strategy has yet been defined');
        });

      });

      describe('if a strategy has been set', function() {

        beforeEach(function() {
          strategyObject.setStrategy(StrategyType);
        });


        it('should set the same strategy again', function() {
          spyOn(strategyObject, 'setStrategy');
          strategyObject.resetStrategy();

          expect(strategyObject.setStrategy).toHaveBeenCalledWith(StrategyType);
        });

        describe('if a strategy has then been removed', function() {

          beforeEach(function() {
            strategyObject.removeStrategy();
          });

          it('should set the same strategy again', function() {
            spyOn(strategyObject, 'setStrategy');
            strategyObject.resetStrategy();

            expect(strategyObject.setStrategy).toHaveBeenCalledWith(StrategyType);
          });

        });

      });

    });

  });

});
