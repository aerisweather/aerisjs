define([
  'aeris/util',
  'sinon',
  'base/extension/mapextensionobject',
  'testErrors/untestedspecerror',
  'base/abstractstrategy',
  'mocks/map'
], function(_, Sinon, MapExtensionObject, UntestedSpecError, AbstractStrategy, MockMap) {

  function testFactory(opt_options) {
    var options = _.extend({
      strategy: getStubbedStrategy(),
      map: getStubbedMap()
    }, opt_options);

    var obj = new MapExtensionObject(null, {
      strategy: options.strategy
    });

    return {
      strategy: options.strategy,
      obj: obj,
      map: options.map
    };
  }


  function getStubbedStrategy() {
    var ns = {};
    ns.Strategy = function() {

    };

    spyOn(ns, 'Strategy');

    return ns.Strategy;
  }


  function getStubbedMap() {
    return new MockMap();
  }



  describe('A MapExtensionObject', function() {

    describe('constructor', function() {
      it('should require a strategy', function() {
        expect(function() {
          testFactory({
            strategy: null
          });
        }).toThrowType('InvalidArgumentError');
      });

      it('should instantiate a strategy', function() {
        var test = testFactory();

        expect(test.strategy).toHaveBeenCalled();
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
