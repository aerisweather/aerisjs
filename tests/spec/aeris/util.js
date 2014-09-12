var underscore_orig = window._ || (window._ = { STUB: 'UNDERSCORE_ORIG' });
define([
  'sinon',
  'aeris/util',
  'underscore',
  'tests/lib/clock'
], function(sinon, _, underscore, clock) {
  describe('util', function() {

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


    describe('eachAtInterval', function() {

      beforeEach(function() {
        clock.useFakeTimers(0);
      });
      afterEach(function() {
        clock.restore();
      });


      it('should invoke the callback with each object, waiting INTERVAL between each call', function() {
        var objects = ['A', 'B', 'C'];
        var cb = jasmine.createSpy('cb');
        var INTERVAL = 100;

        _.eachAtInterval(objects, cb, INTERVAL);

        // Only called with 'A'
        expect(cb).toHaveBeenCalledWith('A');
        expect(cb.callCount).toEqual(1);

        clock.tick(INTERVAL);
        // Called with 'A' and 'B'
        expect(cb).toHaveBeenCalledWith('B');
        expect(cb.callCount).toEqual(2);

        clock.tick(INTERVAL);
        // Called with 'A', 'B', and 'C'
        expect(cb).toHaveBeenCalledWith('C');
        expect(cb.callCount).toEqual(3);
      });

      it('should not invoke the callback more times than there are objects', function() {
        var objects = ['A', 'B', 'C'];
        var cb = jasmine.createSpy('cb');
        var INTERVAL = 100;

        _.eachAtInterval(objects, cb, INTERVAL);

        clock.tick(INTERVAL * 10);
        expect(cb.callCount).toEqual(3);
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
        expect(_.isNumeric([
          {name: 'FireMarkers'}
        ])).toEqual(false);
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
        Parent = function() {
        };

        Child = function() {
        };
        _.inherits(Child, Parent);

        GrandChild = function() {
        };
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


    describe('template', function() {

      it('should work with {var} syntax', function() {
        var str = _.template('foo {what}', { what: 'bar' });
        expect(str).toEqual('foo bar');
      });

      it('should not effect underscore.template', function() {
        _.template('foo {what}', { what: 'bar' });

        expect(underscore.template('<%=foo%>', {
          foo: 'bar'
        })).toEqual('bar');
      });

    });


    describe('bindAllMethods', function() {
      var ctx, fooSpy, barSpy, shazaamSpy;

      beforeEach(function() {
        ctx = { STUB: 'CONTEXT' };

        fooSpy = jasmine.createSpy('foo');
        barSpy = jasmine.createSpy('bar');
        shazaamSpy = jasmine.createSpy('shazaam');
      });

      it('should bind all methods in the object to the specified context', function() {
        var myBar;
        var obj = {
          foo: fooSpy,
          bar: barSpy,
          shazaam: shazaamSpy
        };

        _.bindAllMethods(obj, ctx);

        // Call in scope of object
        obj.foo();
        expect(fooSpy).toHaveBeenCalledInTheContextOf(ctx);

        // Call without scope
        myBar = obj.bar;
        myBar();
        expect(barSpy).toHaveBeenCalledInTheContextOf(ctx);

        // Call in scope of a different object
        ({
          myShazaam: obj.shazaam
        }).myShazaam();
        expect(shazaamSpy).toHaveBeenCalledInTheContextOf(ctx);
      });

      it('should accept objects which contain values which are not functions', function() {
        var obj = {
          foo: fooSpy,
          bar: barSpy,
          someNumber: 32,
          someString: 'a string',
          someObj: { some: 'obj' }
        };

        expect(function() {
          _.bindAllMethods(obj, ctx);
        }).not.toThrow();
      });

      it('should use the object as the default context', function() {
        var obj = {
          foo: fooSpy
        };

        _.bindAllMethods(obj);

        ({
          myFoo: obj.foo
        }).myFoo();
        expect(fooSpy).toHaveBeenCalledInTheContextOf(obj);
      });

    });


    describe('tryCatch', function() {
      var tryFn, catchFn;

      beforeEach(function() {
        tryFn = jasmine.createSpy('tryFn');
        catchFn = jasmine.createSpy('catchFn');
      });


      it('should call the `try` function', function() {
        _.tryCatch(tryFn, catchFn);

        expect(tryFn).toHaveBeenCalled();
      });

      it('should call the `catch` function with errors thrown in try', function() {
        var error = new Error('ERROR_THROWN_IN_TRY_FN');
        tryFn.andCallFake(function() {
          throw error;
        });

        _.tryCatch(tryFn, catchFn);

        expect(catchFn).toHaveBeenCalledWith(error);
      });

      it('should not call the `catch` function if now errors are thrown in try', function() {
        _.tryCatch(tryFn, catchFn);

        expect(catchFn).not.toHaveBeenCalled();
      });

    });


    describe('extending underscore', function() {

      it('should not effect the underscore AMD module', function() {
        // Check that our custom function is not in the underscore AMD module
        expect(underscore.argsToArray).not.toBeDefined();
      });

      it('should not effect the global underscore object', function() {
        _.aeris_foo = 'aeris_bar';
        expect(window._.aeris_foo).not.toBeDefined();
        expect(window._).toEqual(underscore_orig);

        expect(window._.argsToArray).not.toBeDefined();
      });

      it('should include underscore methods', function() {
        // Just a partial test, to check that we're extending underscore
        expect(_.last(['a', 'b', 'c'])).toEqual('c');
      });

      it('should act as a wrapping function', function() {
        // with a underscore method
        expect(_(['a', 'b', 'c']).last()).toEqual('c');

        // with a custom Aeris.js method
        expect(_(['a', 'b', 'c']).argsToArray()).toEqual(['a', 'b', 'c']);
      });

    });

  });
});
