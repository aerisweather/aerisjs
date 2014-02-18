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
    
    it('but doesn\'t play well with using wire programatically', function() {
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

      waitsFor(function() {
        return !testUtil.checkFlag();
      }, 300, 'wire not to resolve');
    });
    
  });
});