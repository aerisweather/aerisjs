define([
  'ai/util',
  'sinon',
  'ai/promise',
  'ai/maps/layers/aerisinteractivetile',
  'ai/maps/abstractstrategy',
  'ai/config',
  'mocks/aeris/jsonp',
  'ai/errors/timeouterror'
], function(_, sinon, Promise, AerisInteractiveTile, Strategy, aerisConfig, MockJSONP, TimeoutError) {


  function TestFactory(opt_options) {
    var options = _.extend({
      strategy: getStubbedStrategy(),
      tileType: 'someTileType',
      name: 'some tile name',
      autoUpdateInterval: 100
    }, opt_options);

    var attrs = _.defaults(_.pick(options,
      'tileType',
      'autoUpdateInterval',
      'autoUpdate',
      'name'
    ), {
      tileType: 'STUB_TILE_TYPE'
    });

    this.strategy = options.strategy;
    this.tile = new AerisInteractiveTile(attrs, { strategy: this.strategy });
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


  describe('An AerisInteractiveTile', function() {

    describe('constructor', function() {

      it('should require a tileType', function() {
        expect(function() {
          new TestFactory({
            tileType: null
          });
        }).toThrowType('ValidationError');
      });

    });

    describe('getUrl', function() {

      describe('should require aeris keys from...', function() {
        var aerisKeys_orig = aerisConfig.pick('apiId', 'apiSecret');
        var API_ID_STUB = 'API_ID_STUB';
        var API_SECRET_STUB = 'API_SECRET_STUB';
        var tile;

        beforeEach(function() {
          aerisConfig.set({
            apiId: null,
            apiSecret: null
          });

          tile = new AerisInteractiveTile({
            tileType: 'STUB_TILE_TYPE',
            name: 'STUB_NAME'
          });
        });

        afterEach(function() {
          aerisConfig.set(aerisKeys_orig);
        });



        it('aeris config', function() {
          expect(function() {
            tile.getUrl();
          }).toThrowType('MissingApiKeyError');

          aerisConfig.set({
            apiId: API_ID_STUB,
            apiSecret: API_SECRET_STUB
          });
          tile.getUrl();
        });

        it('model attributes', function() {
          expect(function() {
            tile.getUrl();
          }).toThrowType('MissingApiKeyError');

          tile.set({
            apiId: API_ID_STUB,
            apiSecret: API_SECRET_STUB
          });
          tile.getUrl();
        });

      });

    });

    describe('autoUpdate', function() {
      var clock;

      beforeEach(function() {
        clock = sinon.useFakeTimers();

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

    });


    describe('loadTileTimes', function() {
      var tile, jsonp, clock;
      var API_ID_STUB = 'API_ID_STUB', API_SECRET_STUB = 'API_SECRET_STUB';
      var TILE_TYPE_STUB = 'TILE_TYPE_STUB';
      var STUB_TIMES = [1000, 2000, 3000, 4000, 5000];

      var MockTimesResponse = function(times) {
        return {
          files: _.map(times, this.timeToResponseObject_, this)
        }
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
        // Stub out validation
        spyOn(AerisInteractiveTile.prototype, 'isValid');

        jsonp = new MockJSONP();
        tile = new AerisInteractiveTile({
          apiId: API_ID_STUB,
          apiSecret: API_SECRET_STUB,
          tileType: TILE_TYPE_STUB
        }, {
          jsonp: jsonp
        });

        clock = sinon.useFakeTimers();
      });

      afterEach(function() {
        clock.restore();
      });



      it('should return a promise', function() {
        expect(tile.loadTileTimes()).toBeInstanceOf(Promise);
      });

      it('should request json data from the aeris tiles API', function() {
        tile.loadTileTimes();

        expect(jsonp.getRequestedUrl()).toEqual(
          'http://tile.aerisapi.com/' +
          API_ID_STUB + '_' + API_SECRET_STUB + '/' +
          TILE_TYPE_STUB + '.jsonp'
        );
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
