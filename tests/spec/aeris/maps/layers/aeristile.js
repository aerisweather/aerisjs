define([
  'aeris/util',
  'sinon',
  'aeris/promise',
  'aeris/maps/layers/aeristile',
  'aeris/maps/abstractstrategy',
  'mocks/aeris/jsonp',
  'mocks/aeris/config',
  'aeris/errors/timeouterror',
  'tests/lib/clock'
], function(_, sinon, Promise, AerisTile, Strategy, MockJSONP, MockConfig, TimeoutError, clock) {


  function TestFactory(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      tileType: 'STUB_TILE_TYPE',
      name: 'STUB_TILE_NAME',
      autoUpdateInterval: 999999
    });
    var options = _.defaults(opt_options || {}, {
      strategy: getStubbedStrategy(),
      jsonp: new MockJSONP
    });

    this.jsonp = options.jsonp;
    this.strategy = options.strategy;
    this.tile = new AerisTile(attrs, options);
  }

  function getStubbedStrategy() {
    var ns = {
      strategy: Strategy
    };
    var stub = sinon.createStubInstance(Strategy);

    // Stub the Strategy constructor to
    // return a stubbed instance.
    spyOn(ns, 'strategy').andReturn(stub);

    return ns.strategy;
  }


  describe('AerisTile', function() {

    afterEach(function() {
      MockConfig.restore();
    });


    describe('constructor', function() {

      it('should require a tileType', function() {
        expect(function() {
          new TestFactory({
            tileType: null
          });
        }).toThrowType('ValidationError');
      });

      it('should throw an error if the time is in the future, and autoUpdate is on', function() {
        var NOW = 1000;
        clock.useFakeTimers(NOW);

        expect(function() {
          new TestFactory({
            time: NOW + 100,
            autoUpdate: true
          });
        }).toThrowType('UnsupportedFeatureError');

        // Should not throw errors
        new TestFactory({
          time: NOW + 100,
          autoUpdate: false
        });
        new TestFactory({
          time: NOW,
          autoUpdate: true
        });

        clock.restore();
      });

    });


    describe('validation', function() {

      it('should throw an error if the time is in the future, and autoUpdate is on', function() {
        var NOW = 1000;
        var tile = new TestFactory().tile;
        clock.useFakeTimers(NOW);

        expect(function() {
          tile.set({
            time: NOW + 100,
            autoUpdate: true
          }, { validate: true });
        }).toThrowType('UnsupportedFeatureError');

        // Should not throw errors
        tile.set({
          time: NOW + 100,
          autoUpdate: false
        }, { validate: true });
        tile.set({
          time: NOW,
          autoUpdate: true
        }, { validate: true });

        clock.restore();
      });

    });


    describe('data binding', function() {


      it('should bind to aeris/config api keys', function() {
        var tile = new TestFactory().tile;
        MockConfig.stubApiKeys();

        expect(tile.get('apiId')).toEqual(MockConfig.API_ID_STUB);
        expect(tile.get('apiSecret')).toEqual(MockConfig.API_SECRET_STUB);
      });

      it('should prefer set api key attributes', function() {
        var tile = new TestFactory().tile;
        var apiIdAttr = _.uniqueId('API_ID_ATTR');
        var apiSecretAttr = _.uniqueId('API_SECRET_ATTR');

        tile.set({
          apiSecret: apiSecretAttr,
          apiId: apiIdAttr
        });
        MockConfig.stubApiKeys();

        expect(tile.get('apiId')).toEqual(apiIdAttr);
        expect(tile.get('apiSecret')).toEqual(apiSecretAttr);
      });

    });


    describe('getUrl', function() {

      describe('should require aeris keys from...', function() {
        var tile;

        beforeEach(function() {
          MockConfig.stubApiKeys({
            apiId: null,
            apiSecret: null
          });

          tile = new TestFactory({
            tileType: 'STUB_TILE_TYPE',
            name: 'STUB_NAME'
          }).tile;
        });


        it('aeris config', function() {
          expect(function() {
            tile.getUrl();
          }).toThrowType('MissingApiKeyError');

          MockConfig.stubApiKeys();
          tile.getUrl();
        });

        it('model attributes', function() {
          expect(function() {
            tile.getUrl();
          }).toThrowType('MissingApiKeyError');

          tile.set({
            apiId: _.uniqueId('API_ID_ATTR_'),
            apiSecret: _.uniqueId('API_ID_ATTR_')
          });
          tile.getUrl();
        });

      });

      it('should return [SERVER]/[API_ID]_[API_SECRET]/[TILE_TYPE]/{z}/{x}/{y}/{t}.png', function() {
        var tile = new TestFactory().tile;
        var stubAttrs = {
          server: 'SERVER_STUB',
          apiId: 'API_ID_STUB',
          apiSecret: 'API_SECRET_STUB',
          tileType: 'TILE_TYPE_STUB'
        };
        tile.set(stubAttrs);

        expect(tile.getUrl()).toEqual(
          '[SERVER]/[API_ID]_[API_SECRET]/[TILE_TYPE]/{z}/{x}/{y}/{t}.png'.
            replace('[SERVER]', stubAttrs.server).
            replace('[API_ID]', stubAttrs.apiId).
            replace('[API_SECRET]', stubAttrs.apiSecret).
            replace('[TILE_TYPE]', stubAttrs.tileType)
        );
      });

      describe('when the tile time is in the future', function() {
        var NOW;

        beforeEach(function() {
          NOW = 12345;
          clock.useFakeTimers(NOW);
        });

        afterEach(function() {
          clock.restore();
        });

        it('should return [SERVER]/[API_ID]_[API_SECRET]/[FUTURE_TILE_TYPE]/{z}/{x}/{y}/{t}.png', function() {
          var tile = new TestFactory().tile;
          var stubAttrs = {
            server: 'SERVER_STUB',
            apiId: 'API_ID_STUB',
            apiSecret: 'API_SECRET_STUB',
            tileType: 'TILE_TYPE_STUB',
            futureTileType: 'FUTURE_TILE_TYPE',
            time: new Date(NOW + 100)
          };
          tile.set(stubAttrs);

          expect(tile.getUrl()).toEqual(
            '[SERVER]/[API_ID]_[API_SECRET]/[TILE_TYPE]/{z}/{x}/{y}/{t}.png'.
              replace('[SERVER]', stubAttrs.server).
              replace('[API_ID]', stubAttrs.apiId).
              replace('[API_SECRET]', stubAttrs.apiSecret).
              replace('[TILE_TYPE]', stubAttrs.futureTileType)
          );
        });

      });

    });


    describe('autoUpdate', function() {

      beforeEach(function() {
        clock.useFakeTimers();

        this.addMatchers({
          toBeAutoUpdating: function() {
            var tile = this.actual;
            var interval = tile.get('autoUpdateInterval');
            var isPassing = true;

            // Set tile time to something other than 0
            // so we can check that it changed
            tile.set('time', new Date(12345), { trigger: false });

            _.times(3, function() {
              clock.tick(interval);

              // Note:
              //  we set the time to 0
              //  in order to hit Aeris 'latest' endpoint
              if (tile.get('time').getTime() !== 0) {
                isPassing = false;
              }
            }, this);

            this.message = (function() {
              var verb = this.isNot ? 'not to be' : 'to be';
              return 'Expected tile \'' + tile.get('name') + '\' ' + verb + ' auto-updating';
            }).bind(this);

            return isPassing;
          }
        });
      });

      afterEach(function() {
        clock.restore();
      });


      it('should start autoupdate by default', function() {
        var test = new TestFactory({
          autoUpdateInterval: 100
        });

        expect(test.tile).toBeAutoUpdating();
      });

      it('should not start autoupdate by default if attr is false', function() {
        var test = new TestFactory({
          autoUpdate: false
        });

        expect(test.tile).not.toBeAutoUpdating();
      });

      it('should start autoupdate when attr is set to true', function() {
        var test = new TestFactory({
          autoUpdate: null
        });

        test.tile.set('autoUpdate', true);

        expect(test.tile).toBeAutoUpdating();
      });


      it('should stop autoupdate when attr is set to false', function() {
        var test = new TestFactory({
          autoUpdate: false
        });

        test.tile.set('autoUpdate', false);

        expect(test.tile).not.toBeAutoUpdating();
      });

      it('should trigger an \'autoUpdate\' event every \'autoUpdateInterval\' ms', function() {
        var tile = new TestFactory({ autoUpdate: true }).tile;
        var interval = tile.get('autoUpdateInterval');
        var onAutoUpdate = jasmine.createSpy('onAutoUpdate');
        tile.on('autoUpdate', onAutoUpdate);

        clock.tick(interval);
        expect(onAutoUpdate).toHaveBeenCalled();

        clock.tick(interval);
        expect(onAutoUpdate.callCount).toEqual(2);
      });

    });


    describe('loadTileTimes', function() {
      var tile, jsonp;
      var API_ID_STUB = 'API_ID_STUB', API_SECRET_STUB = 'API_SECRET_STUB';
      var TILE_TYPE_STUB = 'TILE_TYPE_STUB';
      var STUB_TIMES = [1000, 2000, 3000, 4000, 5000];

      var MockTimesResponse = function(times) {
        return {
          files: _.map(times, this.timeToResponseObject_, this)
        };
      };

      MockTimesResponse.prototype.timeToResponseObject_ = function(time, i) {
        var unixTimestamp = time / 1000;
        return {
          number: i,
          timestamp: unixTimestamp,
          time: 'TIMESTRING_STUB'
        };
      };

      beforeEach(function() {
        var test;

        // Stub out validation
        spyOn(AerisTile.prototype, 'isValid');

        test = new TestFactory({
          apiId: API_ID_STUB,
          apiSecret: API_SECRET_STUB,
          tileType: TILE_TYPE_STUB
        });
        tile = test.tile;
        jsonp = test.jsonp;

        clock.useFakeTimers();
      });

      afterEach(function() {
        clock.restore();
      });


      it('should return a promise', function() {
        expect(tile.loadTileTimes()).toBeInstanceOf(Promise);
      });

      it('should request times data from the aeris tiles API', function() {
        tile.loadTileTimes();

        expect(jsonp.getRequestedUrl()).toEqual(
          '//tile.aerisapi.com/' +
            API_ID_STUB + '_' + API_SECRET_STUB + '/' +
            TILE_TYPE_STUB + '.jsonp'
        );
      });

      describe('when the futureTileType attribute is set', function() {
        var NOW = 12345;
        var FUTURE_TILE_TYPE_STUB = 'FUTURE_TILE_TYPE_STUB', TILE_TYPE_STUB = 'TILE_TYPE_STUB';

        beforeEach(function() {
          tile.set({
            tileType: TILE_TYPE_STUB,
            futureTileType: FUTURE_TILE_TYPE_STUB
          });
          clock.useFakeTimers(NOW);
        });
        afterEach(function() {
          clock.restore();
        });


        it('should request times data from the standard and future tiles api', function() {
          var requestedUrls;
          tile.loadTileTimes();

          requestedUrls = jsonp.get.calls.map(function(call) {
            return call.args[0];
          });

          expect(requestedUrls).toContain(
            '//tile.aerisapi.com/' +
              API_ID_STUB + '_' + API_SECRET_STUB + '/' +
              FUTURE_TILE_TYPE_STUB + '.jsonp'
          );

          expect(requestedUrls).toContain(
            '//tile.aerisapi.com/' +
              API_ID_STUB + '_' + API_SECRET_STUB + '/' +
              TILE_TYPE_STUB + '.jsonp'
          );

          expect(jsonp.get.callCount).toEqual(2);
        });


        it('should resolve with combined times from the standard and future tile apis', function() {
          var PAST_TIMES_STUB = _.range(0, 5);
          var FUTURE_TIMES_STUB = _.range(6, 10);
          var onTimesLoaded = jasmine.createSpy('onTimesLoaded');

          // Mock jsonp to respond with either past of future times,
          // based on the url endpoint.
          jsonp.get.andCallFake(function(url, data, onLoad, callbackName) {
            var isFutureRequest = new RegExp(FUTURE_TILE_TYPE_STUB).test(url);
            var times = isFutureRequest ? FUTURE_TIMES_STUB : PAST_TIMES_STUB;

            onLoad(new MockTimesResponse(times));
          });

          tile.loadTileTimes().
            done(onTimesLoaded);

          expect(onTimesLoaded).toHaveBeenCalledWith(PAST_TIMES_STUB.concat(FUTURE_TIMES_STUB));
        });

        it('should use the correct jsonp callback names', function() {
          jsonp.get.andCallFake(function(url, data, onLoad, callbackName) {
            var isFutureRequest = new RegExp(FUTURE_TILE_TYPE_STUB).test(url);

            if (isFutureRequest) {
              expect(callbackName).toEqual(FUTURE_TILE_TYPE_STUB + 'Times');
            }
            else {
              expect(callbackName).toEqual(TILE_TYPE_STUB + 'Times');
            }

            onLoad(new MockTimesResponse());
          });

          tile.loadTileTimes();

          expect(jsonp.get).toHaveBeenCalled();
        });

      });

      it('should resolve with an array of timestamps', function() {
        var promiseToLoadTimes = tile.loadTileTimes();
        var onDone = jasmine.createSpy('onDone');
        promiseToLoadTimes.done(onDone);

        jsonp.resolveWith(new MockTimesResponse(STUB_TIMES));

        expect(onDone).toHaveBeenCalledWith(STUB_TIMES);
      });

      it('should reject after a timeout of 5 seconds', function() {
        var TIMEOUT = 5000;
        var promiseToLoadTimes = tile.loadTileTimes();
        var onFail = jasmine.createSpy('onFail');
        promiseToLoadTimes.fail(onFail);

        clock.tick(TIMEOUT);

        expect(onFail).toHaveBeenCalled();
        expect(onFail.mostRecentCall.args[0]).toBeInstanceOf(TimeoutError);
      });

    });

  });
});
