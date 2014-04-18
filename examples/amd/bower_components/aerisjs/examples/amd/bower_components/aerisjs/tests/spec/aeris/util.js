define([
  'sinon',
  'aeris/util'
], function(sinon, _) {
  describe('The Aeris Utility Library', function() {

    describe('expose method', function() {
      var aeris_orig = window.aeris;

      afterEach(function() {
        window.aeris = aeris_orig;
      });

      it('should expose variables under the aeris namespace', function() {
        var foo = 'bar';

        _.expose(foo, 'aeris.foo');

        expect(window.aeris.foo).toEqual(foo);
      });

      it('should return the exposed variable', function() {
        var foo = 'bar';
        expect(_.expose(foo, 'aeris.foo')).toEqual(foo);
      });

      it('should expose variables under sub-namespaces', function() {
        var foo = 'bar';

        _.expose(foo, 'aeris.someNs.foo');

        expect(window.aeris.someNs.foo).toEqual(foo);
      });

      it('should extend existing namespaces', function() {
        var foo = 'bar';

        window.aeris = {};
        window.aeris.someNs = { already: 'here' };

        _.expose(foo, 'aeris.someNs.foo');

        expect(window.aeris.someNs).toEqual({
          already: 'here',
          foo: 'bar'
        });
      });

      it('should overwrite existing objects', function() {
        var foo = 'bar';

        window.aeris.foo = 'notBar';

        _.expose(foo, 'aeris.foo');

        expect(window.aeris.foo).toEqual('bar');
      });
    });


    describe('provide method', function() {
      var aeris_orig = window.aeris;

      afterEach(function() {
        window.aeris = aeris_orig;
      });

      it('should expose an empty namespace', function() {
        var ret;

        spyOn(_, 'expose');

        _.provide('aeris.foo.bar');

        expect(_.expose).toHaveBeenCalledWith({}, 'aeris.foo.bar', false);
      });

      it('should return the value from the expose method', function() {
        var ret;
        var val = 'something';

        spyOn(_, 'expose').andReturn(val);

        expect(_.provide('aeris.foo.bar')).toEqual(val);
      });
    });

    describe('average', function() {
      var numbers;

      beforeEach(function() {
        numbers = [
          5,
          10,
          15,
          25,
          30
        ];
      });


      it('should return the average of an array of numbers', function() {
        expect(_.average(numbers)).toEqual(17);
      });

      it('should return the average of multiple number arguments', function() {
        expect(_.average.apply(_, numbers)).toEqual(17);
      });

    });


    describe('interval', function() {
      var clock, fn;

      beforeEach(function() {
        clock = sinon.useFakeTimers();
        fn = jasmine.createSpy('fn');
      });

      afterEach(function() {
        clock.restore();
      });

      it('should work like window.setInterval, but better', function() {
        var ctx = { foo: 'bar' };
        var wait = 200;

        var interval = _.interval(fn, wait, ctx, 'yo', 'hey');

        expect(fn).not.toHaveBeenCalled();

        clock.tick(200);
        expect(fn).toHaveBeenCalledInTheContextOf(ctx);
        expect(fn).toHaveBeenCalledWith('yo', 'hey');

        clock.tick(200);
        expect(fn.callCount).toEqual(2);

        window.clearInterval(interval);
        clock.tick(200);
        expect(fn.callCount).toEqual(2);
      });
    });


    describe('path', function() {

      it('should return a property of an object', function() {
        var obj = {
          foo: 'bar'
        };

        expect(_.path('foo', obj)).toEqual('bar');
      });

      it('should return a nested property of an object', function() {
        var obj = {
          foo: {
            bar: 'yo'
          }
        };

        expect(_.path('foo.bar', obj)).toEqual('yo');
      });

      it('should return a deep nested property of an object', function() {
        var obj = {
          foo: {
            bar: {
              yo: 'jo'
            }
          }
        };

        expect(_.path('foo.bar.yo', obj)).toEqual('jo');
      });

      it('should default to looking in the global scope (window)', function() {
        obj_orig = window.obj;
        window.obj = {
          foo: {
            bar: {
              yo: 'jo'
            }
          }
        };

        expect(_.path('obj.foo.bar.yo')).toEqual('jo');

        window.obj = obj_orig;
      });

      it('should return undefined if no property exists', function() {
        var obj = {
          foo: {
            bar: {
              yo: 'jo'
            }
          }
        };

        expect(_.path('yolo', obj)).toEqual(undefined);
        expect(_.path('foo.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yo.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yo.somethingelse.yolo', obj)).toEqual(undefined);
        expect(_.path('foo.bar.yo.somethingelse.andmore.yolo', obj)).toEqual(undefined);
        expect(_.path('nada.yada.tada', obj)).toEqual(undefined);
      });

      it('should return undefined for all falsey values', function() {
        var obj = {
          foo: {
            bar: {
              yo: 'jo'
            }
          }
        };

        expect(_.path('', obj)).toBeUndefined();
        expect(_.path(null, obj)).toBeUndefined();
        expect(_.path(undefined, obj)).toBeUndefined();
        expect(_.path(false, obj)).toBeUndefined();
        expect(_.path(-1, obj)).toBeUndefined();
        expect(_.path(NaN, obj)).toBeUndefined();

        expect(_.path('')).toBeUndefined();
        expect(_.path(null)).toBeUndefined();
        expect(_.path(undefined)).toBeUndefined();
        expect(_.path(false)).toBeUndefined();
        expect(_.path(-1)).toBeUndefined();
        expect(_.path(NaN)).toBeUndefined();
      });

      it('should return undefined if passed an empty string', function() {
        expect(_.path('')).toBeUndefined();
      });

    });

    describe('isNumeric', function() {

      it('should return true for numeric objects', function() {
        expect(_.isNumeric(123)).toEqual(true);
        expect(_.isNumeric('123')).toEqual(true);
      });

      it('should return false for non-numberic objects', function() {
        expect(_.isNumeric('foo')).toEqual(false);
        expect(_.isNumeric('10px')).toEqual(false);
        expect(_.isNumeric('')).toEqual(false);
        expect(_.isNumeric({ foo: 'bar' })).toEqual(false);
        expect(_.isNumeric([{name: 'FireMarkers'}])).toEqual(false);
        expect(_.isNumeric(new Date())).toEqual(false);
      });

    });

    describe('container', function() {

      it('should return true if the array contains the value', function() {
        expect(_(['a', 'b', 'c']).contains('a')).toEqual(true);
      });

      it('should return false if the array does not contain the value', function() {
        expect(_(['a', 'b', 'c']).contains('x')).toEqual(false);
      });

    });


    describe('inherits', function() {
      var Parent, Child, GrandChild;
      var parent, child, grandChild;

      beforeEach(function() {
        Parent = function() {};

        Child = function() {};
        _.inherits(Child, Parent);

        GrandChild = function() {};
        _.inherits(GrandChild, Child);

        parent = new Parent();
        child = new Child();
        grandChild = new GrandChild();
      });


      it('should save a reference to the parent class', function() {
        expect(child.__Parent).toEqual(Parent);
        expect(grandChild.__Parent).toEqual(Child);
      });


    });

  });
});
