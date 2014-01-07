define([
  'aeris/util',
  'loader/libraryloader',
  'mocks/require',
  'aeris/promise',
  'sinon',
  'flag'
], function(_, LibraryLoader, MockRequire, Promise, sinon, flag) {

  function throwError(err) {
    throw (err instanceof Error) ? err : JSON.stringify(err, null, 2);
  }

  var MockLoaderModule = function(libraryId) {
    var mockLoader = new MockLoader();
    var MockLoaderConstructor = function() {
      return mockLoader;
    }

    define(libraryId + '/loader', function() {
      return MockLoaderConstructor;
    });

    return mockLoader;
  };

  /** @implements aeris.loader.LoaderInterface */
  var MockLoader = function() {
    this.promiseToLoad_ = new Promise();

    spyOn(this, 'load').andCallThrough();
  };

  MockLoader.prototype.load = function() {
    return this.promiseToLoad_;
  };

  MockLoader.prototype.resolve = function() {
    this.promiseToLoad_.resolve.apply(this.promiseToLoad_, arguments);
  };

  MockLoader.prototype.reject = function() {
    this.promiseToLoad_.reject.apply(this.promiseToLoad_, arguments);
  };

  MockLoader.prototype.getPromiseToLoad = function() {
    return this.promiseToLoad_;
  };


  describe('A LibraryLoader', function() {
    var libLoader;
    var mockRequire;
    var clock;

    beforeEach(function() {
      libLoader = new LibraryLoader();

      mockRequire = new MockRequire();
      mockRequire.useMockRequire();
      mockRequire.useMockDefine();

      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      mockRequire.restore();

      clock.restore();
    });


    describe('load', function() {
      var fooLibrary, barLibrary;
      var FOO_CONFIG, BAR_CONFIG, loadConfig;
      var onload, onerror;

      beforeEach(function() {
        fooLibrary = new MockLoaderModule('FooLibrary');
        barLibrary = new MockLoaderModule('BarLibrary');

        onload = jasmine.createSpy('onload');
        onerror = jasmine.createSpy('onerror');

        FOO_CONFIG = { foo: 'FOO'};
        BAR_CONFIG = { bar: 'BAR'};
        loadConfig = {
          FooLibrary: FOO_CONFIG,
          BarLibrary: BAR_CONFIG,
          onload: onload,
          onerror: onerror
        };
      });

      function markChildLoadersAsResolved() {
        fooLibrary.resolve();
        barLibrary.resolve();
      }


      it('should load Loaders for each configured library', function() {
        libLoader.load(loadConfig).
          done(function() {
            expect(fooLibrary.load).toHaveBeenCalledWith(FOO_CONFIG);
            expect(barLibrary.load).toHaveBeenCalledWith(BAR_CONFIG);
          }).
          done(flag.set).
          fail(throwError);

        markChildLoadersAsResolved();

        flag.waitUntilSet(500, 'load to resolve');
      });

      it('should call onload when all libraries are loaded', function() {
        libLoader.load(loadConfig).
          done(function() {
            expect(onload).toHaveBeenCalled();
          }).
          done(flag.set).
          fail(throwError);

        markChildLoadersAsResolved();

        flag.waitUntilSet(500, 'load to resolve');
      });

      it('should not call onload before all libraries are AMD-loaded ', function() {
        var REQUIRE_DELAY = 100;
        mockRequire.setRequireDelay(REQUIRE_DELAY);

        libLoader.load(loadConfig).
          fail(throwError);

        markChildLoadersAsResolved();

        expect(onload).not.toHaveBeenCalled();

        clock.tick(REQUIRE_DELAY);
        expect(onload).toHaveBeenCalled();
      });

      it('should not call onload before all libraries have resolved', function() {
        libLoader.load(loadConfig).
          fail(throwError);

        expect(onload).not.toHaveBeenCalled();

        markChildLoadersAsResolved();

        expect(onload).toHaveBeenCalled();
      });

      it('should call onerror with an Error if a Loader is not defined for a library', function() {
        libLoader.load({
          FooLibrary: FOO_CONFIG,
          UndefinedLibrary: {},
          onerror: onerror
        });

        markChildLoadersAsResolved();

        expect(onerror).toHaveBeenCalled();
        expect(onerror.mostRecentCall.args[0]).toBeInstanceOf(Error);
      });

      it('should call onerror with an Error if a child Loader fails while loading', function() {
        var FOO_LIBRARY_LOAD_ERROR = new Error('FOO_LIBRARY_LOAD_ERROR');

        libLoader.load(loadConfig);

        fooLibrary.reject(FOO_LIBRARY_LOAD_ERROR);

        expect(onerror).toHaveBeenCalled();
        expect(onerror.mostRecentCall.args[0]).toEqual(FOO_LIBRARY_LOAD_ERROR)
      });

    });


  });

});
