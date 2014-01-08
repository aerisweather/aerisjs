define([
  'aeris/util',
  'mapbuilder/loader',
  'aeris/config',
  'aeris/promise',
  'mocks/require'
], function(_, MapAppLoader, aerisConfig, Promise, MockRequire) {
  var builderInstance = null;

  var MockBuilder = function() {
    this.build = jasmine.createSpy('build').andCallFake(this.build);

    this.buildPromise_ = new Promise();

    this.exposeInstance_();
  }

  MockBuilder.prototype.exposeInstance_ = function() {
    builderInstance = this;
  };


  MockBuilder.prototype.build = function() {
    return this.buildPromise_;
  };


  MockBuilder.prototype.resolve = function() {
    this.buildPromise_.resolve.apply(this.buildPromise_, arguments);
  };

  MockBuilder.prototype.reject = function() {
    this.buildPromise_.reject.apply(this.buildPromise_, arguments);
  }


  describe('A MapAppLoader', function() {
    var loader;
    var mockRequire, clock;
    var STUB_API_ID = 'STUB_API_KEY', STUB_API_SECRET = 'STUB_API_SECRET';


    beforeEach(function() {
      MockBuilderCtor = jasmine.createSpy('MockBuilder').andCallFake(function() {
        return new MockBuilder();
      });
      loader = new MapAppLoader({
        Builder: MockBuilderCtor
      });

      mockRequire = new MockRequire();
      mockRequire.useMockRequire();
      mockRequire.useMockDefine();

      aerisConfig.set({
        apiId: STUB_API_ID,
        apiSecret: STUB_API_SECRET
      });

      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      mockRequire.restore();
      clock.restore();
      builderInstance = null;
    });


    describe('load', function() {

      beforeEach(function() {
        mockRequire.define('packages/maps', function() {
          return 'PACKAGE_MAPS';
        });
        mockRequire.define('packages/gmaps', function() {
          return 'PACKAGE_GMAPS';
        });
      });

      
      describe('should require apiKeys are set, either by...', function() {

        beforeEach(function() {
          aerisConfig.unset('apiId');
          aerisConfig.unset('apiSecret');
        });

        
        it('existing aerisConfig attrs', function() {
          expect(function() {
            loader.load()
          }).toThrowType('LoaderConfigError');

          aerisConfig.set({
            apiId: STUB_API_ID,
            apiSecret: STUB_API_SECRET
          });
          loader.load();
        });
        
        it('load config', function() {
          expect(function() {
            loader.load();
          }).toThrowType('LoaderConfigError');

          loader.load({
            apiId: STUB_API_ID,
            apiSecret: STUB_API_SECRET
          })
        });
        
      });

      it('should set the apiKey and apiSecret on aeris/config', function() {
        loader.load({
          apiId: STUB_API_ID,
          apiSecret: STUB_API_SECRET
        });

        expect(aerisConfig.get('apiId')).toEqual(STUB_API_ID);
        expect(aerisConfig.get('apiSecret')).toEqual(STUB_API_SECRET);
      });

      it('should require the map strategy package', function() {
        mockRequire.define('packages/openlayers', function() { return 'OPENLAYERS'; });

        loader.load({
          mapType: 'openlayers'
        });

        mockRequire.shouldHaveRequired('packages/openlayers');
      });

      it('should require the gmaps package by default', function() {
        loader.load();

        mockRequire.shouldHaveRequired('packages/gmaps');
      });

      it('should require the generic maps package', function() {
        loader.load();

        mockRequire.shouldHaveRequired('packages/maps');
      });

      it('should build the app with the load config, excluding apiKeys', function() {
        var BUILD_CONFIG = {
          foo: 'bar',
          faz: 'baz'
        };
        loader.load(_.extend({
          apiId: STUB_API_ID,
          apiSecret: STUB_API_SECRET
        }, BUILD_CONFIG));

        expect(MockBuilderCtor).toHaveBeenCalledWith(BUILD_CONFIG);
        expect(builderInstance.build).toHaveBeenCalled();
      });

      it('should wait to build the app util packages are required', function() {
        var REQUIRE_DELAY = 100;
        mockRequire.setRequireDelay(REQUIRE_DELAY);

        loader.load();

        expect(builderInstance).toBeNull();

        clock.tick(100);
        expect(builderInstance.build).toHaveBeenCalled();
      });

      describe('load event callbacks', function() {
        var onload, onerror;

        beforeEach(function() {
          onload = jasmine.createSpy('onload');
          onerror = jasmine.createSpy('onerror');
        });


        it('should call onload after the the Builder has resolved', function() {
          loader.load({
            onload: onload
          });

          builderInstance.resolve();

          expect(onload).toHaveBeenCalled();
        });

        it('should call onload with resolved argument from the Builder', function() {
          loader.load({
            onload: onload
          });
          builderInstance.resolve('foo', 'bar');

          expect(onload).toHaveBeenCalledWith('foo', 'bar');
        });

        it('should call onerror if app packages fail to be required', function() {
          mockRequire.unssetModule('packages/maps');
          loader.load({
            onerror: onerror
          });

          expect(onerror).toHaveBeenCalled();
        });

        it('should call onerror if the Builder is rejected', function() {
          loader.load({
            onerror: onerror
          });
          builderInstance.reject('foo', 'bar');

          expect(onerror).toHaveBeenCalledWith('foo', 'bar');
        });

      });
    });
    
  });

});
