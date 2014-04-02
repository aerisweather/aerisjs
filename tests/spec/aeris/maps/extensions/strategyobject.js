define([
  'aeris/util',
  'aeris/maps/extensions/strategyobject',
  'aeris/promise',
  'testUtils',
  'mocks/require'
], function(_, StrategyObject, Promise, testUtil, MockRequire) {

  var StrategyFactory = function() {
    var Strategy = jasmine.createSpy(_.uniqueId('MockStrategyCtor_'));

    Strategy.prototype.destroy = jasmine.createSpy('MockStrategy#destroy');

    return Strategy;
  };


  function errBack(e) {
    throw e;
  }


  describe('A StrategyObject', function() {

    describe('constructor', function() {

      it('should set a strategy', function() {
        var Strategy = StrategyFactory();

        spyOn(StrategyObject.prototype, 'setStrategy_');

        new StrategyObject({
          strategy: Strategy
        });

        expect(StrategyObject.prototype.setStrategy_).toHaveBeenCalledWith(Strategy);
      });

      it('should load a strategy from a string path', function() {
        spyOn(StrategyObject.prototype, 'loadStrategy_').andReturn(new Promise());

        new StrategyObject({
          strategy: 'mock/strategy'
        });

        expect(StrategyObject.prototype.loadStrategy_).toHaveBeenCalledWith('mock/strategy');
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


    describe('setStrategy_', function() {

      it('should instantiate a strategy', function() {
        var Strategy = StrategyFactory();
        var obj = new StrategyObject();

        obj.setStrategy_(Strategy);
        expect(Strategy).toHaveBeenCalledWith(obj);
      });

      it('should remove any existing strategy', function() {
        var OldStrategy = StrategyFactory();
        var NewStrategy = StrategyFactory();
        var obj = new StrategyObject();

        obj.setStrategy_(OldStrategy);

        spyOn(obj, 'removeStrategy');
        obj.setStrategy_(NewStrategy);

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
            obj.setStrategy_(baddy);
          }).toThrowType('InvalidArgumentError');
        });

      });

    });


    describe('loadStrategy_', function() {
      var Strategy, mockRequire;

      beforeEach(function() {
        Strategy = StrategyFactory();

        mockRequire = new MockRequire();
        mockRequire.useMockRequire();
        mockRequire.useMockDefine();

        define('aeris/maps/strategy/mockStrategyModule', function() {
          return Strategy;
        });

        spyOn(StrategyObject.prototype, 'setStrategy_');
      });

      afterEach(function() {
        mockRequire.restore();
      });



      it('should set the strategy to a named ReqJS module', function() {
        var obj = new StrategyObject();

        obj.loadStrategy_('mockStrategyModule').
          done(testUtil.setFlag).
          fail(errBack);

        waitsFor(testUtil.checkFlag, 100, 'load to complete');
        runs(function() {
          expect(obj.setStrategy_).toHaveBeenCalledWith(Strategy);
          expect(obj.setStrategy_).toHaveBeenCalledInTheContextOf(obj);
        });
      });

      it('should complain if the strategy module doesn\'t exist', function() {
        var obj = new StrategyObject();

        obj.loadStrategy_('no/modules/here').
          fail(function(e) {
            expect(e.name).toEqual('InvalidArgumentError');
            testUtil.setFlag();
          });

        waitsFor(testUtil.checkFlag, 100, 'load promise to be rejected');
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
        var Strategy = StrategyFactory();

        obj.setStrategy_(Strategy);

        obj.removeStrategy();
        expect(Strategy.prototype.destroy).toHaveBeenCalled();
      });

      it('should do nothing the second time you call it, because it has no longer has a reference to the strategy.', function() {
        var obj = new StrategyObject();
        var Strategy = StrategyFactory();

        obj.setStrategy_(Strategy);

        obj.removeStrategy();
        obj.removeStrategy();
        expect(Strategy.prototype.destroy.callCount).toEqual(1);
      });

    });

  });

});
