define([
  'aeris/util',
  'testUtils',
  'aeris/maps/extensions/mapextensionobject',
  'aeris/maps/abstractstrategy',
  'testErrors/untestedspecerror',
  'mocks/map'
], function(_, testUtil, MapExtensionObject, AbstractStrategy, UntestedSpecError,  MockMap) {

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


  function getStubbedMap() {
    return new MockMap();
  }


  function throwError(e) {
    throw e;
  }



  describe('A MapExtensionObject', function() {

    describe('constructor', function() {


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


    describe('getView', function() {
      var VIEW_STUB;

      var MockStrategy = function() {
      };

      MockStrategy.prototype.getView = function() {
        return VIEW_STUB;
      };

      beforeEach(function() {
        VIEW_STUB = { view: 'stub' };
      });


      it('should return the strategy\'s view', function() {
        var object = new MapExtensionObject(null, {
          strategy: MockStrategy
        });

        expect(object.getView()).toEqual(VIEW_STUB);
      });


      it('should complain if there\'s no strategy set', function() {
        var object = new MapExtensionObject(null, {
          strategy: function() { return null; }
        });

        expect(function() {
          object.getView();
        }).toThrow();
      });

    });


    describe('requestView', function() {
      var view;


      var MockStrategy = function() {
      };
      _.inherits(MockStrategy, AbstractStrategy);

      MockStrategy.prototype.getView = jasmine.createSpy('getView').
        andCallFake(function() {
          return view;
        });

      define('aeris/maps/strategy/mockStrategy', function() {
        return MockStrategy;
      });

      beforeEach(function() {
        view = { id: _.uniqueId('StubView_') };
      });


      it('should immediately resolve with the strategy\'s view, if a strategy is set', function() {
        var obj = new MapExtensionObject();
        var onResolved = jasmine.createSpy('onResolved');

        obj.setStrategy_(MockStrategy);

        obj.requestView().
          done(function(res) {
            expect(res).toEqual(view);
          }).
          done(onResolved).
          fail(throwError);

        expect(onResolved).toHaveBeenCalled();
      });

      it('should resolve with a strategy\'s view, once the strategy is loaded', function() {
        var obj = new MapExtensionObject();
        var onResolved = jasmine.createSpy('onResolved');

        spyOn(obj, 'getView').andReturn(view);

        obj.requestView().
          done(function(res) {
            expect(res).toEqual(view);
          }).
          done(onResolved).
          fail(throwError);

        obj.trigger('strategy:set', new MockStrategy());

        expect(onResolved).toHaveBeenCalled();
      });

    });

  });
});
