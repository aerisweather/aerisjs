define([
  'aeris/util',
  'aeris/promise',
  'aeris/builder/maps/loader',
  'mocks/require',
  'sinon'
], function(_, Promise, Loader, MockRequire, sinon) {
  var clock;
  var require_orig = window.require;

  function TestFactory(opt_options) {
    var options = _.extend({
      builder: new MockBuilderFactory(opt_options)
    }, opt_options);

    this.loader = new Loader({
      builder: options.builder
    });

    this.Builder = options.builder;
  }


  function MockBuilder(opt_options) {
    var promise = new Promise();
    var options = _.extend({
      resolve: true,
      delay: 100,
      args: []
    }, opt_options);

    // Return the promise
    this.build.andReturn(promise);

    // Resolve promise;
    _.delay(function() {
      var method = options.resolve ? 'resolve' : 'reject';
      promise[method].apply(promise, options.args);
    });
  }
  MockBuilder.prototype.build = jasmine.createSpy('build');

  /**
   * Creates a mock builder class,
   * bound to the specified options.
   * Yaaaaaay.... closure!
   *
   * @param {Object=} opt_options MockBuilder options.
   * @return {Function} Mock builder constructor.
   * @constructor
   */
  function MockBuilderFactory(opt_options) {
    var BuilderClass = jasmine.createSpy('MockBuilder')
      .andCallFake(function() {
        MockBuilder.call(this, opt_options);
      });
    _.inherits(BuilderClass, MockBuilder);

    return BuilderClass;
  }

  describe('A MapAppLoader', function() {

    beforeEach(function() {
      clock = sinon.useFakeTimers();
      window.require = new MockRequire();
    });
    afterEach(function() {
      clock.restore();
      window.require = require_orig;
    });


    describe('load', function() {

      it('should load the mapType package', function() {
        var loader = new TestFactory().loader;

        _.each(['gmaps', 'openlayers'], function(mapType) {
          loader.load({
            mapType: mapType
          });

          expect(require).toHaveBeenCalledWithReqs(['packages/' + mapType]);
        });

      });

      it('should build the app', function() {
        var test = new TestFactory();
        var options = {
          mapType: 'gmaps',
          foo: 'bar'
        };

        test.loader.load(options);

        clock.tick(200);

        expect(test.Builder.prototype.build).toHaveBeenCalled();
      });

      it('should build the app using configuration options', function() {
        var test = new TestFactory();
        var options = {
          mapType: 'gmaps',
          foo: 'bar'
        };

        // Spy on Builder constructor
        // And check that it was called with config
        // options
        test.Builder.andCallFake(function(builderOptions) {
          expect(builderOptions.foo).toEqual('bar');
        });

        test.loader.load(options);

        clock.tick(200);

        expect(test.Builder).toHaveBeenCalled();
      });


      it('should call onload with exposed builder objects', function() {
        var test = new TestFactory({
          builder: new MockBuilderFactory({
            args: ['a map', 'some layer', 'some controller']
          })
        });
        var options = {
          mapType: 'gmaps',
          onload: jasmine.createSpy('onload')
        };

        test.loader.load(options);

        clock.tick(200);

        expect(options.onload).toHaveBeenCalledWith('a map', 'some layer', 'some controller');
      });

      it('should call onerror with builder error arguments', function() {
        var test = new TestFactory({
          builder: new MockBuilderFactory({
            resolve: false,
            args: ['fail', 'fml']
          })
        });
        var options = {
          mapType: 'gmaps',
          onerror: jasmine.createSpy('onerror')
        };

        test.loader.load(options);

        clock.tick(200);

        expect(options.onerror).toHaveBeenCalledWith('fail', 'fml');
      });

    });

  });
});
