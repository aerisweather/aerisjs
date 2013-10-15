define([
  'aeris/util',
  'aeris/loader/loader',
  'aeris/promise',
  'mocks/require',
  'sinon'
], function(_, Loader, Promise, BaseMockRequire, sinon) {
  var clock;


  function TestFactory(opt_options) {
    this.loader = new Loader();

    this.mapLoader = mockLoaderFactory();
    this.apiLoader = mockLoaderFactory();

    window.require = new MockRequire(_.extend({
      objects: [this.mapLoader.ctor, this.apiLoader.ctor]
    }, opt_options));

    this.config = getCannedConfig();
  }

  /**
   * @extends aeris.mocks.MockRequire
   */
  function MockRequire(opt_options) {
    var options = _.extend({
      // Return loader objects
      objects: [mockLoaderFactory().ctor, mockLoaderFactory().ctor]
    }, opt_options);
    return BaseMockRequire.call(this, options);
  }
  _.inherits(MockRequire, BaseMockRequire);


  function MockLoader() {
    this.loadPromise = this.loadPromise || new Promise();

    _.extend(this, jasmine.createSpyObj('mock loader', [
      'load'
    ]));

    this.load.andReturn(this.loadPromise);
  }

  /**
   * Creates a MockLoader class,
   * and provides the constructor
   * and the promise to load.
   *
   * @return {Object} obj
   *                  obj.ctor
   *                  obj.loadPromise.
   */
  function mockLoaderFactory() {
    var loadPromise = new Promise();
    var loadSpy = jasmine.createSpy('load');

    var MockLoaderClass = function() {
      this.loadPromise = loadPromise;
      this.load = loadSpy.andReturn(loadPromise);
    };

    return {
      ctor: MockLoaderClass,
      loadPromise: loadPromise,
      loadSpy: loadSpy
    };
  }

  function getCannedConfig(opt_config) {
    return _.extend({
      maps: {
        foo: 'bar'
      },
      api: {
        waamo: 'fazaam'
      }
    }, opt_config);
  }


  describe('An Aeris Library Loader', function() {

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    describe('load', function() {

      it('should load library modules', function() {
        var loader = new Loader();
        var config = getCannedConfig();

        window.require = new MockRequire();

        loader.load(config);

        expect(require).toHaveBeenCalledWithReqs([
          'aeris/maps/loader',
          'aeris/api/loader'
        ]);
      });

      it('should run load method on library loaders', function() {
        var test = new TestFactory();

        test.loader.load(test.config);

        clock.tick(210);

        expect(test.mapLoader.loadSpy).toHaveBeenCalledWith(test.config.maps);
        expect(test.apiLoader.loadSpy).toHaveBeenCalledWith(test.config.api);
      });

      it('should resolve when all library loaders have resolved', function() {
        var test = new TestFactory();
        var onload = jasmine.createSpy('onload');
        test.loader.load(test.config).done(onload);

        clock.tick(210);

        expect(onload).not.toHaveBeenCalled();

        // Try resolving one lib loader
        test.mapLoader.loadPromise.resolve();
        expect(onload).not.toHaveBeenCalled();

        // Resovle all lib loaderes
        test.apiLoader.loadPromise.resolve();
        expect(onload).toHaveBeenCalled();
      });

    });

  });

});
