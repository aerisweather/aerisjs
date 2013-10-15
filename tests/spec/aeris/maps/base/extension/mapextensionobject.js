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
    });

    describe('remove', function() {
      it('should set the map to null', function() {
        var test = testFactory();

        spyOn(test.obj, 'set');
        spyOn(test.obj, 'get').andCallFake(function(prop) {
          if (prop === 'map') { return test.map; }
          return null;
        });

        test.obj.remove();
        expect(test.obj.set).toHaveBeenCalledWith('map', null);
      });

      it('should do nothing if there is no map set', function() {
        var test = testFactory();

        spyOn(test.obj, 'set');
        spyOn(test.obj, 'get').andReturn(null);

        test.obj.remove();
        expect(test.obj.set).not.toHaveBeenCalled();
      });
    });

  });
});
