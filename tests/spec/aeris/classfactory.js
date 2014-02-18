define([
  'aeris/util',
  'aeris/classfactory'
], function(_, ClassFactory) {

  var Type = jasmine.createSpy('Type ctor').andCallFake(
    function() {

    }
  );

  describe('A ClassFactory', function() {

    it('should return a class constructor', function() {
      expect(_.isFunction(new ClassFactory())).toEqual(true);
    });

    it('should return a constructor using the \'new\' keyword', function() {
      expect(_.isFunction(new ClassFactory())).toEqual(true);
    });

    describe('The created class', function() {

      it('should be an instance of the parent class', function() {
        var Klass = new ClassFactory(Type);
        expect(new Klass()).toBeInstanceOf(Type);
      });

      describe('constructor', function() {

        it('should call the parent class\'s constructor', function() {
          var Klass = new ClassFactory(Type);
          new Klass();

          expect(Type).toHaveBeenCalled();
        });

        it('should call the parent class\'s constructor with bound arguments', function() {
          var args = ['a', 'b', { c: 'c' }];
          var Klass = new ClassFactory(Type, args);

          new Klass();

          expect(Type).toHaveBeenCalledWith('a', 'b', { c: 'c' });
        });

        it('should use instance arguments, overriding bound arguments', function() {
          var args = ['a', 'b', { c: 'c' }];
          var Klass = new ClassFactory(Type, args);

          new Klass('x');
          expect(Type.mostRecentCall.args).toEqual(['x', 'b', { c: 'c' }]);

          new Klass('x', 'y');
          expect(Type.mostRecentCall.args).toEqual(['x', 'y', { c: 'c' }]);

          new Klass('x', 'y', 'z');
          expect(Type.mostRecentCall.args).toEqual(['x', 'y', 'z']);
        });

        it('should use falsy instance arguments, overriding bound arguments', function() {
          var args = ['a', 'b', { c: 'c' }];
          var Klass = new ClassFactory(Type, args);

          new Klass(null);
          expect(Type.mostRecentCall.args).toEqual([null, 'b', { c: 'c' }]);

          new Klass('x', false);
          expect(Type.mostRecentCall.args).toEqual(['x', false, { c: 'c' }]);

          new Klass('x', 'y', -1);
          expect(Type.mostRecentCall.args).toEqual(['x', 'y', -1]);

          new Klass(null, 'y', -1);
          expect(Type.mostRecentCall.args).toEqual([null, 'y', -1]);
        });

        it('should prefer bound argument over undefined instance argument', function() {
          var args = ['a', 'b', { c: 'c' }];
          var Klass = new ClassFactory(Type, args);

          new Klass(undefined, undefined, undefined);
          expect(Type.mostRecentCall.args).toEqual(['a', 'b', { c: 'c' }]);

          new Klass('x', undefined, 'z');
          expect(Type.mostRecentCall.args).toEqual(['x', 'b', 'z']);
        });

        it('should optionally extend instance arguments from bound arguments', function() {
          var args = [{
            foo: 'bar',
            hello: 'world'
          }, 'a', 'b', 'c'];
          var Klass = new ClassFactory(Type, args, { extendArgObjects: true });

          new Klass({ hello: 'universe' });
          expect(Type.mostRecentCall.args).toEqual([{ foo: 'bar', hello: 'universe' }, 'a', 'b', 'c']);

          new Klass('x');
          expect(Type.mostRecentCall.args).toEqual(['x', 'a', 'b', 'c']);

          new Klass({ hello: undefined });
          expect(Type.mostRecentCall.args).toEqual([{ foo: 'bar', hello: 'world' }, 'a', 'b', 'c']);

          new Klass({ hello: null });
          expect(Type.mostRecentCall.args).toEqual([{ foo: 'bar', hello: null }, 'a', 'b', 'c']);

          new Klass('x', { waz: 'faz' });
          expect(Type.mostRecentCall.args).toEqual(['x', { waz: 'faz' }, 'b', 'c']);
        });

      });

    });

  });

});
