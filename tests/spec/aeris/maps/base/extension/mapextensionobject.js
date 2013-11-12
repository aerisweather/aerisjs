define([
  'aeris/util',
  'sinon',
  'testUtils',
  'aeris/promise',
  'base/extension/mapextensionobject',
  'testErrors/untestedspecerror',
  'base/abstractstrategy',
  'mocks/map'
], function(_, sinon, testUtil, Promise, MapExtensionObject, UntestedSpecError, AbstractStrategy, MockMap) {

  function testFactory(opt_options) {
    var options = _.extend({
      map: getStubbedMap()
    }, opt_options);

    var obj = new MapExtensionObject(null, {
      strategy: options.strategy
    });

    return {
      obj: obj,
      map: options.map
    };
  }


  var StrategyFactory = function() {
    var Strategy = jasmine.createSpy(_.uniqueId('MockStrategyCtor_'));

    Strategy.prototype.destroy = jasmine.createSpy('MockStrategy#destroy');

    return Strategy;
  };


  function getStubbedMap() {
    return new MockMap();
  }


  function errBack(e) {
    throw e;
  }



  describe('A MapExtensionObject', function() {

    describe('constructor', function() {

      it('should set a strategy', function() {
        var Strategy = StrategyFactory();

        spyOn(MapExtensionObject.prototype, 'setStrategy');

        new MapExtensionObject(undefined, {
          strategy: Strategy
        });

        expect(MapExtensionObject.prototype.setStrategy).toHaveBeenCalledWith(Strategy);
      });

      it('should load a strategy from a string path', function() {
        spyOn(MapExtensionObject.prototype, 'loadStrategy').andReturn(new Promise());

        new MapExtensionObject(undefined, {
          strategy: 'mock/strategy'
        });

        expect(MapExtensionObject.prototype.loadStrategy).toHaveBeenCalledWith('mock/strategy');
      });

      it('should not require a strategy argument', function() {
        // Shouldn't throw an error
        new MapExtensionObject();
      });

      it('should accept null as a strategy', function() {
        new MapExtensionObject(undefined, {
          strategy: null
        });
      });


      it('should set the map to null, if no map is set', function() {
        var obj = new MapExtensionObject();

        expect(obj.get('map')).toEqual(null);
      });

    });

    describe('validate', function() {
      it('should require a valid aeris map', function() {
        var test = testFactory();

        expect(function() {
          test.obj.set('map', { foo: 'bar' }, { validate: true });
        }).toThrowType('ValidationError');

        expect(function() {
          test.obj.set('map', undefined, { validate: true });
        }).toThrowType('ValidationError');
      });

      it('should allow setting the map to null', function() {
        var test = testFactory();
        test.obj.set('map', null, { validate: true });
      });

      it('should not allow setting the map to non-null falsy values', function() {
        var spec = function(falsy) {
          expect(function() {
            var test = testFactory();
            test.obj.set('map', falsy, { validate: true });
          }).toThrowType('ValidationError');
        };

        _.each([
          undefined,
          -1,
          0,
          NaN,
          false,
          ''
        ], spec, this);
      });
    });


    describe('setStrategy', function() {

      it('should instantiate a strategy', function() {
        var Strategy = StrategyFactory();
        var obj = new MapExtensionObject();

        obj.setStrategy(Strategy);
        expect(Strategy).toHaveBeenCalledWith(obj);
      });

      it('should remove any existing strategy', function() {
        var OldStrategy = StrategyFactory();
        var NewStrategy = StrategyFactory();
        var obj = new MapExtensionObject();

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
        var obj = new MapExtensionObject();

        _(invalids).each(function(baddy) {
          expect(function() {
            obj.setStrategy(baddy);
          }).toThrowType('InvalidArgumentError');
        });

      });

    });


    describe('loadStrategy', function() {
      var Strategy;

      beforeEach(function() {
        Strategy = StrategyFactory();


        require.config({
          map: {
            '*': {
              strategy: 'mockStrategyType'
            }
          }
        });

        define('mockStrategyType/mockStrategyModule', function() {
          return Strategy;
        });

        spyOn(MapExtensionObject.prototype, 'setStrategy');
      });
      afterEach(function() {
        require.setStrategy('gmaps');
      });


      it('should set the strategy to a named ReqJS module', function() {
        var obj = new MapExtensionObject();

        obj.loadStrategy('mockStrategyModule').
          done(testUtil.setFlag).
          fail(errBack);

        waitsFor(testUtil.checkFlag, 100, 'load to complete');
        runs(function() {
          expect(obj.setStrategy).toHaveBeenCalledWith(Strategy);
          expect(obj.setStrategy).toHaveBeenCalledInTheContextOf(obj);
        });
      });

      it('should complain if the strategy module doesn\'t exist', function() {
        var obj = new MapExtensionObject();

        obj.loadStrategy('no/module/here').
          fail(function(e) {
            expect(e.name).toEqual('InvalidArgumentError');
            testUtil.setFlag();
          });

        waitsFor(testUtil.checkFlag, 100, 'load promise to be rejected');
      });

    });
    
    
    describe('removeStrategy', function() {
      
      it('should do nothing if no strategy exists', function() {
        var obj = new MapExtensionObject();

        // Just don't throw an error
        obj.removeStrategy();
      });
      
      it('should destroy any existing strategy', function() {
        var obj = new MapExtensionObject();
        var Strategy = StrategyFactory();

        obj.setStrategy(Strategy);

        obj.removeStrategy();
        expect(Strategy.prototype.destroy).toHaveBeenCalled();
      });
      
      it('should do nothing the second time you call it, because it has no longer has a reference to the strategy.', function() {
        var obj = new MapExtensionObject();
        var Strategy = StrategyFactory();

        obj.setStrategy(Strategy);

        obj.removeStrategy();
        obj.removeStrategy();
        expect(Strategy.prototype.destroy.callCount).toEqual(1);
      });
      
    });


    describe('setMap', function() {
      var spies;
      var test;

      beforeEach(function() {
        test = testFactory();
        spies = jasmine.createSpyObj('events', [
          'onSet',
          'onRemove'
        ]);

        test.obj.on('map:set', spies.onSet);
        test.obj.on('map:remove', spies.onRemove);
      });

      afterEach(function() {
        test.obj.off();
      });

      it('should trigger a \'map:set\' event when setting a map', function() {
        test.obj.setMap(test.map);

        expect(spies.onSet).toHaveBeenCalledWithSomeOf(test.obj, test.map);
        expect(spies.onRemove).not.toHaveBeenCalled();
      });

      it('should not trigger a \'map:set\' if the map hasn\'t changed', function() {
        test.obj.setMap(test.map);

        test.obj.setMap(test.map);

        // Map hasn't changed,
        // So our handler should not be called a second time.
        expect(spies.onSet.callCount).toEqual(1);
      });

      it('should trigger a \'map:remove\' event when unsetting a map', function() {
        test.obj.setMap(test.map);

        test.obj.setMap(null);
        expect(spies.onRemove).toHaveBeenCalledWithSomeOf(test.obj, null);

        // Should only have been called once from the
        // original 'setMap(test.map)'
        expect(spies.onSet.callCount).toEqual(1);
      });

      it('should not trigger a \'map:remove\' event if the map was already removed', function() {
        test.obj.setMap(test.map);

        test.obj.setMap(null);
        test.obj.setMap(null);

        expect(spies.onRemove.callCount).toEqual(1);
      });

    });

  });
});
