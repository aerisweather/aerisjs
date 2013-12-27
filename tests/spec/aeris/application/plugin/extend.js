define([
  'aeris/util',
  'testUtils',
  'wire'
], function(_, testUtil, wire) {
  var plugins = [{
    module: 'application/plugin/extend',
    trace: true
  }];

  function handleWireError(err) {
    _.defer(function() {
      throw err;
    });
  }

  describe('The WireJS Extend Plugin', function() {
    var modId;

    beforeEach(function() {
      // Prevent asynchronous misfires
      // on similarly names AMD modules
      // from different specs.
      modId = _.uniqueId('SpecMod_');
    });


    it('should combine specs in multiple modules (simple)', function() {
      define(modId + 'specA', {
        foo: 'bar',
        faz: 'baz'
      });
      define(modId + 'specB', {
        hello: 'world'
      });

      wire({
        combined: {
          extend: [
            modId + 'specA',
            modId + 'specB'
          ]
        },
        $plugins: plugins
      }).then(function(ctx) {
          expect(ctx.combined.foo).toEqual('bar');
          expect(ctx.combined.faz).toEqual('baz');
          expect(ctx.combined.hello).toEqual('world');

          testUtil.setFlag();
        }, handleWireError).otherwise(handleWireError);

      waitsFor(testUtil.checkFlag, 1000, 'wire to resolve');
    });

    it('should combine specs in multiple modules (factories)', function() {
      var Foo = function() {};
      var Bar = function() {};

      define(modId + 'Foo', function() {
        return Foo;
      });
      define(modId + 'Bar', function() {
        return Bar;
      });

      define(modId + 'fooSpec', {
        foo: {
          create: {
            module: modId + 'Foo',
            isConstructor: true
          }
        }
      });
      define(modId + 'barSpec', {
        bar: {
          create: {
            module: modId + 'Bar',
            isConstructor:true
          }
        }
      });

      wire({
        combined: {
          extend: [
            modId + 'fooSpec',
            modId + 'barSpec'
          ]
        },
        $plugins: plugins
      }).then(function(ctx) {
          expect(ctx.combined.foo).toBeDefined();
          expect(ctx.combined.bar).toBeDefined();
          expect(ctx.combined.foo).toBeInstanceOf(Foo);
          expect(ctx.combined.bar).toBeInstanceOf(Bar);

          testUtil.setFlag();
        });

      waitsFor(testUtil.checkFlag, 1000, 'wire to resolve');
    });

    it('should override specs successively', function() {
      define(modId + 'specA', {
        foo: 'bar',
        hello: 'world',
        shazaam: 'wazoom'
      });
      define(modId + 'specB', {
        foo: 'baz',
        hello: 'universe'
      });
      define(modId + 'specC', {
        hello: 'everybody'
      });

      wire({
        combined: {
          extend: [
            modId + 'specA',
            modId + 'specB',
            modId + 'specC'
          ]
        },
        $plugins: plugins
      }).then(function(ctx) {
          expect(ctx.combined.hello).toEqual('everybody');
          expect(ctx.combined.foo).toEqual('baz');
          expect(ctx.combined.shazaam).toEqual('wazoom');

          testUtil.setFlag();
        });

      waitsFor(testUtil.checkFlag, 1000, 'wire to resolve');
    });

  });
});