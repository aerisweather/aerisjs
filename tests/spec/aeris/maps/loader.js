define([
  'aeris/util',
  'aeris/maps/loader',
  'mocks/require',
  'sinon'
], function(_, Loader, MockRequire, sinon) {
  describe('An Aeris Maps Loader', function() {
    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();

      this.addMatchers({
        toFailWithCode: function(code) {
          var failListener = jasmine.createSpy('fail listener');
          var loadPromise = this.actual;
          loadPromise.fail(failListener);

          this.message = _.bind(function() {
            var not = this.isNot ? 'not' : '';
            return 'Expected load promise ' + not + ' to fail with code' +
              code + '. Actual code is was ' + code;
          }, this);

          return failListener.mostRecentCall.args[0].code === code;
        }
      });
    });

    afterEach(function() {
      clock.restore();
    });

    describe('load', function() {

      it('should require a mapType', function() {
        var loader = new Loader();
        var listeners = jasmine.createSpyObj('listeners', ['done', 'fail']);

        window.require = new MockRequire();

        expect(loader.load()).toFailWithCode('InvalidConfigError');

        // Wrong map type
        expect(
          loader.load({
            mapType: 'NoNameMaps'
          })
        ).toFailWithCode('InvalidConfigError');

        // Correct types (should not throw error)
        _.each(['gmaps', 'openlayers'], function(map) {
          loader.load({
            mapType: map
          });
        });
      });

      it('should map the requirejs \'strategy\' path to the map type', function() {
        window.require = new MockRequire();

        new Loader().load({
          mapType: 'openlayers'
        });

        expect(require.config).toHaveBeenCalledWith({
          map: {
            '*': {
              'strategy': 'aeris/maps/openlayers'
            }
          }
        });
      });

      it('should load packages', function() {
        var loader = new Loader();

        window.require = new MockRequire({ delay: 100 });

        loader.load({
          mapType: 'gmaps',
          packages: ['maps', 'layers']
        });

        clock.tick(100);
        expect(require).toHaveBeenCalledWithReqs(['packages/maps', 'packages/layers']);
      });

      it('should load modules', function() {
        var loader = new Loader();
        window.require = new MockRequire({ delay: 100 });

        loader.load({
          mapType: 'gmaps',
          layers: ['aerisradar', 'aerissatellite'],
          markercollections: ['earthquakemarkercollection', 'firemarkercollection']
        });

        clock.tick(100);

        expect(require).toHaveBeenCalledWithReqs([
          'base/layers/aerisradar', 'base/layers/aerissatellite',
          'base/markercollections/earthquakemarkercollection', 'base/markercollections/firemarkercollection'
        ]);
      });

      it('should act the same if called multiple times', function() {
        var loader = new Loader();
        var baseCallCount;
        window.require = new MockRequire({ delay: 100 });

        loader.load({
          mapType: 'gmaps',
          layers: ['aerisradar', 'aerissatellite'],
          markercollections: ['earthquakemarkercollection', 'firemarkercollection']
        });

        baseCallCount = require.callCount;

        loader.load({
          mapType: 'gmaps',
          layers: ['aerisradar', 'aerissatellite'],
          markercollections: ['earthquakemarkercollection', 'firemarkercollection']
        });

        // If you load the same stuff a second time,
        // The loader should run require the same number of times
        expect(require.callCount).toEqual(baseCallCount * 2);

        // The loader should load the same stuff
        expect(require).toHaveBeenCalledWithReqs(
          require.argsForCall[0][0], { mostRecent: true }
        );
      });

      it('should ignore casing', function() {
        var loader = new Loader();
        window.require = new MockRequire({ delay: 100 });

        loader.load({
          mapType: 'gmaps',
          mapType: 'gmaps',
          layers: ['AerisRadar', 'AerisSatellite'],
          markercollections: ['EarthquakeMarkerCollection', 'FireMarkerCollection'],
          packages: ['Layers', 'Maps']
        });

        clock.tick(100);

        expect(require).toHaveBeenCalledWithReqs([
          'base/layers/aerisradar', 'base/layers/aerissatellite',
          'base/markercollections/earthquakemarkercollection', 'base/markercollections/firemarkercollection',
          'packages/layers', 'packages/maps'
        ]);
      });

      it('should call onload option if load succeeds', function() {
        var loader = new Loader();
        var onload = jasmine.createSpy('onload');
        var onerror = jasmine.createSpy('onerror');
        var objects = [{ foo: 'bar' }, { faz: 'baz' }];
        window.require = new MockRequire({
          delay: 100,
          success: true,
          objects: objects
        });

        loader.load({
          mapType: 'gmaps',
          onload: onload,
          onerror: onerror
        });

        clock.tick(100);

        expect(onload).toHaveBeenCalledWith({ foo: 'bar' }, { faz: 'baz' });
        expect(onerror).not.toHaveBeenCalled();
      });

      it('should call onerror option if load fails', function() {
        var onerror = jasmine.createSpy('onerror');
        var errorObj = {
          requireType: 'timeout',
          requireModules: ['modA', 'modB']
        };
        var loadPromise;

        window.require = new MockRequire({
          delay: 100,
          success: false,
          error: errorObj
        });

        loadPromise = new Loader().load({
          mapType: 'gmaps',
          onload: onload,
          onerror: onerror
        });

        clock.tick(100);

        expect(loadPromise).toFailWithCode(errorObj.requireType);
      });

    });

  });
});
