define([
  'aeris/util',
  'testUtils',
  'wire',
  'tests/integration/spec/wire/mocks/foo',
  'wire!tests/integration/spec/wire/config/context'
], function(_, testUtil, wire, Foo, wiredContext) {
  describe('Wire API learning tests', function() {
    
    it('should wire a context using the AMD plugin', function() {
      expect(wiredContext.foo).toBeDefined();
      expect(wiredContext.foo).toBeInstanceOf(Foo);
    });
    
    it('should wire a context programatically', function() {
      wire({
        foo: {
          create: {
            module: 'tests/integration/spec/wire/mocks/foo',
            isConstructor: true
          }
        }
      }).then(function(ctx) {
          expect(ctx.foo).toBeDefined();
          expect(ctx.foo).toBeInstanceOf(Foo);
          testUtil.setFlag();
        });

      waitsFor(testUtil.checkFlag, 1000, 'wire to resolve');
    });

    it('should wire a mock module defined on the fly', function() {
      define('fooOnTheFly', function() {
        return 'bar';
      });

      wire({
        fooOnTheFly: { module: 'fooOnTheFly' }
      }).then(function(ctx) {
          expect(ctx).toBeDefined();
          expect(ctx.fooOnTheFly).toEqual('bar');

          testUtil.setFlag();
        });

      waitsFor(testUtil.checkFlag, 1000, 'wire to resolve');
    });

    it('should wire a mock factory module defined on the fly', function() {
      var FooOnTheFly = function() {
        this.bar = 'baz'
      };

      define('FooOnTheFly', function() {
        return FooOnTheFly;
      });

      wire({
        fooOnTheFly: {
          create: {
            module: 'FooOnTheFly',
            isConstructor: true
          }
        }
      }).then(function(ctx) {
          expect(ctx.fooOnTheFly).toBeDefined();
          expect(ctx.fooOnTheFly.bar).toEqual('baz');

          testUtil.setFlag();
        });

      waitsFor(testUtil.checkFlag, 1000, 'wire to resolve');
    });
    
  });
});