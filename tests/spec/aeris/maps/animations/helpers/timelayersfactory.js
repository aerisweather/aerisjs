define([
  'aeris/util',
  'aeris/maps/animations/helpers/timelayersfactory',
  'aeris/model',
  'mocks/aeris/maps/animations/helpers/times',
  'mocks/mockfactory',
  'tests/lib/clock'
], function(_, TimeLayersFactory, Model, MockTimes, MockFactory, clock) {

  var MockLayer = MockFactory({
    getSetters: [
      'map'
    ],
    methods: [
      'clone',
      'destroy'
    ],
    inherits: Model
  });

  MockLayer.prototype.clone = function(opt_attrs, opt_options) {
    var attrs = _.extend({}, this.attributes, opt_attrs);
    var options = _.extend({}, this.options_, opt_options);

    return new MockLayer(attrs, options);
  };

  function sortChronologically(times) {
    return _.sortBy(times, function(time) {
      return time;
    });
  }

  function normalizeTimes(times) {
    return times.map(function(t) {
      return parseFloat(t);
    });
  }

  function getTimesFromLayers(layers) {
    return normalizeTimes(Object.keys(layers));
  }


  function getRandomTimes(count) {
    var times = [];

    _.times(count, function() {
      var randomTime = Math.round(Math.random() * 1000);
      times.push(parseInt(randomTime));
    });

    return times;
  }


  describe('TimeLayersFactory', function() {
    var baseLayer;

    beforeEach(function() {
      baseLayer = new MockLayer();

      this.addMatchers({
        toBeTimes: function(timesB) {
          var timesA = this.actual;
          var prepareTimes = _.compose(sortChronologically, normalizeTimes);

          return _.isEqual(prepareTimes(timesA), prepareTimes(timesB));
        }
      });
    });


    describe('setTimes', function() {

      it('should destroy created layers for times which are not set', function() {
        var times = [10, 20, 30, 40];
        var timeLayersFactory = new TimeLayersFactory(new MockLayer(), times);
        var timeLayers = timeLayersFactory.createTimeLayers();

        var layerToRemove = timeLayers[10];
        timeLayersFactory.setTimes([20, 30, 40]);

        expect(layerToRemove.destroy).toHaveBeenCalled();

        timeLayers = timeLayersFactory.createTimeLayers();
        expect(timeLayers[10]).not.toBeDefined();
      });


    });


    describe('removeTime', function() {

    });


    describe('createTimeLayers', function() {
      var TIMES_COUNT = 10;
      var times, factory, layers;

      beforeEach(function() {
        times = new MockTimes(TIMES_COUNT);
        factory = new TimeLayersFactory(baseLayer, times, {
          limit: TIMES_COUNT
        });
      });


      xit('speed test', function() {
        var factory, average;

        var LAYER_COUNT = 1000;
        var durations = [];

        if (!performance || !performance.now) {
          console.warn('Unable to run TimeLayersFactory performance test: performance.now() unavailable.');
        }

        // Restore clone spy, to prevent spy behavior from slowing us down
        baseLayer.clone = MockLayer.prototype.clone;

        _.times(5, function() {
          var p0, p1;
          var times = new MockTimes(LAYER_COUNT);
          p0 = performance.now();
          factory = new TimeLayersFactory(baseLayer, times);
          factory.createTimeLayers();
          p1 = performance.now();

          durations.push(p1 - p0);
        });

        average = durations.reduce(function(sum, val) {
          return sum + val;
        }, 0) / durations.length;

        console.log('\nPerformance test: \n' +
          'Cloned ' + LAYER_COUNT + ' tile layers in ' + average.toFixed(2) + 'ms.\n');
      });


      it('should return a hash of the original times and layers', function() {
        layers = factory.createTimeLayers();

        expect(_.isPlainObject(layers)).toEqual(true);
        expect(_.keys(layers).length).toEqual(TIMES_COUNT);
        expect(_.keys(layers)).toBeTimes(times);

        _.each(layers, function(layer) {
          expect(layer).toBeInstanceOf(MockLayer);
        });
      });


      it('should create layers with their \'time\' attributes set their key, as a Date object', function() {
        layers = factory.createTimeLayers();

        _.each(layers, function(lyr, time) {
          expect(lyr.get('time')).toBeInstanceOf(Date);
          expect(lyr.get('time').getTime()).toEqual(parseFloat(time));
        });
      });


      it('should create layers which have no map set', function() {
        layers = factory.createTimeLayers();

        _.each(layers, function(lyr, time) {
          expect(lyr.getMap()).toEqual(null);
        });
      });

      it('should create layers with autoupdate turned off', function() {
        layers = factory.createTimeLayers();

        _.each(layers, function(lyr, time) {
          expect(lyr.has('autoUpdate')).toEqual(true);
          expect(lyr.get('autoUpdate')).toEqual(false);
        });
      });


      it('should create layers by cloning the base layer', function() {
        var CLONE_STUB = new MockLayer();
        baseLayer.clone.andReturn(CLONE_STUB);

        layers = factory.createTimeLayers();

        _.each(layers, function(lyr) {
          expect(lyr).toEqual(CLONE_STUB);
        });
      });

      it('should not create unused layer objects', function() {
        layers = factory.createTimeLayers();
        expect(baseLayer.clone.callCount).toEqual(TIMES_COUNT);
      });

      describe('time bounds options', function() {

        beforeEach(function() {
          times = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        });


        it('should exclude times before the \'from\' option', function() {
          var factory = new TimeLayersFactory(baseLayer, times, {
            limit: 10,
            from: 3
          });
          var layers = factory.createTimeLayers();
          var createdTimes = _.keys(layers);

          expect(createdTimes).toBeTimes([3, 4, 5, 6, 7, 8, 9, 10]);
        });

        it('should exclude times after the \'to\' option', function() {
          var factory = new TimeLayersFactory(baseLayer, times, {
            limit: 10,
            to: 7
          });
          var layers = factory.createTimeLayers();
          var createdTimes = _.keys(layers);

          expect(createdTimes).toBeTimes([1, 2, 3, 4, 5, 6, 7]);
        });

        it('should not exclude times if no \'from\' or \'to\' options are set', function() {
          var factory = new TimeLayersFactory(baseLayer, times, {
            limit: 10,
            from: 3,
            to: 7
          });
          var layers = factory.createTimeLayers();
          var createdTimes = _.keys(layers);

          expect(createdTimes).toBeTimes([3, 4, 5, 6, 7]);
        });

      });


      it('should thin times to maintain a limit', function() {
        // Try a few different version of this
        [
          { count: 10, limit: 5},
          { count: 100, limit: 10 },
          { count: 11, limit: 10 },
          { count: 8, limit: 7 },
          { count: 22, limit: 7 },
          { count: 137, limit: 7 }
        ].forEach(function(config) {
            var times = new MockTimes(config.count);
            var factory = new TimeLayersFactory(baseLayer, times, {
              limit: config.limit
            });
            var layers = factory.createTimeLayers();
            var createdTimes = getTimesFromLayers(layers);

            expect(createdTimes.length).toEqual(config.limit);

            // Should maintain first and last time
            expect(_.contains(createdTimes, times[0])).toEqual(true);
            expect(_.contains(createdTimes, _.last(times))).toEqual(true);
          });
      });

      it('should thin times to maintain the limit (random times)', function() {
        var TEST_ITERATIONS = 1;
        var TIMES_COUNT = 100;
        var LIMIT = 17;

        _.times(TEST_ITERATIONS, function(i) {
          var times = getRandomTimes(TIMES_COUNT);
          var factory = new TimeLayersFactory(baseLayer, times, {
            limit: LIMIT
          });
          var layers = factory.createTimeLayers();
          var createdTimes = getTimesFromLayers(layers);

          expect(createdTimes.length).toEqual(LIMIT);
        });
      });

      it('should thin time to maintain limit (another example)', function() {
        var times = [0, 10, 20, 30, 40, 50, 60, 70, 100, 200];
        var factory = new TimeLayersFactory(baseLayer, times, {
          limit: 5
        });
        var layers = factory.createTimeLayers();
        var createdTimes = getTimesFromLayers(layers);

        expect(createdTimes.length).toEqual(5);
      });

      it('should thin time to maintain limit (yet another example)', function() {
        var times = _.range(0, 100, 10).concat(_.range(200, 1000, 100));
        var factory = new TimeLayersFactory(baseLayer, times, {
          limit: 5
        });
        var layers = factory.createTimeLayers();
        var createdTimes = getTimesFromLayers(layers);

        expect(createdTimes.length).toEqual(5);
      });

      it('should keep times evenly spread out, while keeping the first, last, and most current', function() {
        [
          {
            times: [10, 110, 120, 130, 140, 150, 160, 1100, 1200, 1300],
            limit: 5,
            expected: [10, 110, 160, 1100, 1300],
            currentTime: 301
          },
          {
            times: [0, 10, 20, 30, 40, 50, 60, 100, 101, 200, 300],
            limit: 7,
            expected: [0, 20, 40, 60, 101, 200, 300],
            currentTime: 105
          },
          {
            times: [0, 10, 20, 30, 40, 50, 60, 100, 200, 300, 301],
            limit: 5,
            expected: [0, 60, 200, 300, 301],
            currentTime: 300
          },
          {
            times: [0, 2, 4, 6, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
            limit: 9,
            currentTime: 110,
            expected: [0, 32, 64, 128, 256, 512, 1024, 2048, 4096]
          }
        ].forEach(function(test) {
            var factory, createdTimes;
            clock.useFakeTimers(test.currentTime);

            factory = new TimeLayersFactory(baseLayer, test.times, {
              limit: test.limit
            });
            createdTimes = getTimesFromLayers(factory.createTimeLayers());

            expect(createdTimes).toEqual(test.expected);

            clock.restore();
          });
      });


      it('should not limit times by chopping of ends', function() {
        var layers;
        var TIMES_COUNT = 100;
        var LIMIT = 60;
        var CUT_COUNT = TIMES_COUNT - LIMIT;

        var createdTimes;
        var times = new MockTimes(TIMES_COUNT, 1, 100);

        // Simulate "chopped" times
        var choppedFrontTimes = times.slice(0, LIMIT);
        var choppedBackTimes = times.slice(LIMIT * -1);

        // Verifying test logic
        expect(choppedFrontTimes.length).toEqual(LIMIT);
        expect(choppedBackTimes.length).toEqual(LIMIT);
        expect(choppedFrontTimes).toBeTimes(new MockTimes(LIMIT, CUT_COUNT + 1, 100));
        expect(choppedBackTimes).toBeTimes(new MockTimes(LIMIT, 1, LIMIT));

        factory = new TimeLayersFactory(baseLayer, times, {
          limit: LIMIT
        });
        layers = factory.createTimeLayers();
        createdTimes = _.keys(layers);

        // Because non-chopping logic uses a randomizing algorithm,
        // this could potential happen randomly.
        // However, the chances of this happening are
        // 1 x 10^80, with a CUT_COUNT of 40
        expect(createdTimes).not.toBeTimes(choppedFrontTimes);
        expect(createdTimes).not.toBeTimes(choppedBackTimes);
      });

      it('should not remove the earliest, latest, or most current time', function() {

        var factory, createdTimes;
        var times = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000];
        clock.useFakeTimers(501);

        factory = new TimeLayersFactory(baseLayer, times, {
          limit: 3
        });
        createdTimes = getTimesFromLayers(factory.createTimeLayers());

        expect(createdTimes).toEqual([100, 500, 4000]);

        clock.restore();
      });

      describe('if the limit is less than three', function() {

      });


      it('should not limit times if their are fewer times than the limit', function() {
        var TIMES_COUNT = 10;
        var LIMIT = TIMES_COUNT + 3;
        var times = new MockTimes(TIMES_COUNT);
        var factory = new TimeLayersFactory(baseLayer, times, {
          limit: LIMIT
        });
        var layers = factory.createTimeLayers();

        expect(_.keys(layers).length).toEqual(TIMES_COUNT);
      });


      it('should not effect the original times values or order', function() {
        var TIMES_COUNT = 100;
        var LIMIT = TIMES_COUNT - 10;
        var times = _.shuffle(new MockTimes(TIMES_COUNT));
        var times_orig = _.clone(times);

        var factory = new TimeLayersFactory(baseLayer, times, {
          limit: LIMIT
        });
        factory.createTimeLayers();

        expect(times).toEqual(times_orig);
      });
    });


    describe('getOrderedTimes', function() {

      it('should return times in chronological order', function() {
        var times = [3, 2, 4, 1];
        var factory = new TimeLayersFactory(new MockLayer(), times);

        expect(factory.getOrderedTimes()).toEqual([1, 2, 3, 4]);
      });

      it('should not modify the returned times afterwards', function() {
        var times = [3, 2, 4, 1];
        var factory = new TimeLayersFactory(new MockLayer(), times, { limit: 2 });

        var orderedTimes = factory.getOrderedTimes();
        var orderedTimes_orig = _.clone(orderedTimes);

        factory.createTimeLayers();

        expect(orderedTimes).toEqual(orderedTimes_orig);
      });

    });

  });

});
