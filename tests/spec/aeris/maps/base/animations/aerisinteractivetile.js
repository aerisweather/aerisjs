define([
  'aeris/util',
  'aeris/events',
  'sinon',
  'testUtils',
  'testErrors/untestedspecerror',
  'aeris/promise',
  'mocks/promise',
  'aeris/aerisapi',
  'base/animations/aerisinteractivetile',
  'base/layers/aerisinteractivetile',
  'mocks/times'
], function(_, Events, sinon, testUtils, UntestedSpecError, Promise, MockPromise, AerisAPI, TileAnimation, TileLayer) {
  var clock;
  var CannedTimes = require('mocks/times');

  var getCannedTimes = function(opt_options) {
    return new CannedTimes(opt_options);
  };

  var getTimesPromise = function(opt_options) {
    var options = _.extend({
      times: getCannedTimes(),
      resolve: true
    }, opt_options);

    return new MockPromise({
      resolve: options.resolve,
      args: [options.times]
    });
  };


  var testFactory = function(opt_options) {
    var layers = [];
    var animation;
    var animationOptions;
    var options = _.extend({
      timesCount: 100,
      baseTime: 100,
      limit: 10,
      timestep: 100,
      interval: 1,
      speed: 1
    }, opt_options);

    _.extend(options, {
      times: getCannedTimes({
        count: options.timesCount,
        baseTime: options.baseTime,
        interval: options.interval
      }),
      baseLayer: new MockTileLayer({ time: options.baseTime })
    }, opt_options);

    _.extend(options, {
      timesPromise: getTimesPromise({ times: options.times })
    }, opt_options);

    // Retain our stubbed layer 'frames'
    options.baseLayer.clone.andCallFake(function(options) {
      var layer = new MockTileLayer({ time: options.time });
      layers.push(layer);
      return layer;
    });

    AerisAPI.getTileTimes.andReturn(options.timesPromise);

    animationOptions = _.pick(options, [
      'from',
      'to',
      'limit',
      'timestep',
      'speed',
      'opacity',
      'endDelay'
    ]);
    animation = new TileAnimation(options.baseLayer, animationOptions);

    spyOn(animation, 'goToTime').andCallThrough();

    return {
      times: options.times,
      timesPromise: options.timesPromise,
      animation: animation,
      baseLayer: options.baseLayer,
      layers: _.sortBy(layers, function(lyr) { return lyr.getTimestamp(); })
    };
  };


  var MockTileLayer = function(opt_options) {
    var options = _.extend({
      time: 100,
      isLoaded: true
    }, opt_options);

    var layer = sinon.createStubInstance(TileLayer);

    Events.call(layer);
    _.extend(layer, Events.prototype);

    layer.time = new Date(options.time);

    layer.cid = _.uniqueId('testLayer_');

    spyOn(layer, 'clone').andCallFake(function(cloneOpts) {
      return new MockTileLayer({ time: cloneOpts.time });
    });

    // Make 'layer.stop' chainable
    spyOn(layer, 'stop').andReturn(layer);

    spyOn(layer, 'getTimestamp').andReturn(layer.time.getTime());

    spyOn(layer, 'isLoaded').andReturn(options.isLoaded);

    spyOn(layer, 'setOpacity');

    return layer;
  };



  beforeEach(function() {
    clock = sinon.useFakeTimers();
    clock.tick(100000000000000);
  });
  afterEach(function() {
    clock.restore();
  });




  describe('An AerisInteractiveTileAnimation', function() {

    beforeEach(function() {
      spyOn(AerisAPI, 'getTileTimes').andReturn(getTimesPromise());
    });

    describe('constructor', function() {
      it('should create layers for a limited number of tile times', function() {
        var times = getCannedTimes(20);
        var timesPromise = getTimesPromise({ times: times });
        var layer = new MockTileLayer();
        var limit = 10;

        AerisAPI.getTileTimes.andReturn(timesPromise);

        new TileAnimation(layer, { limit: limit });

        expect(layer.clone.callCount).toEqual(limit);
      });

      describe('load events', function() {
        it('should throw load and load:progress events', function() {
          var test = testFactory({
            timesCount: 10
          });
          var progressListener = jasmine.createSpy('load:progress listener');
          var loadListener = jasmine.createSpy('load listener');

          test.animation.on('load:progress', progressListener);
          test.animation.on('load', loadListener);

          // Mark all layers as not loaded
          _.each(test.layers, function(layer) {
            layer.isLoaded.andReturn(false);
          });

          // Load each layer,
          // and check that load events were triggered
          _.each(test.layers, function(layer, i) {
            var progress;

            layer.isLoaded.andReturn(true);
            layer.trigger('load');

            progress = progressListener.mostRecentCall.args[0];
            expect(progress).toBeNear(0.1 * (i + 1), 0.000001);
            expect(progressListener.callCount).toEqual(i + 1);

            if (progress < 1) {
              expect(loadListener).not.toHaveBeenCalled();
            }
          });

          expect(loadListener).toHaveBeenCalled();
        });

        it('should throw a load:times event, with an array of times', function() {
          var promise = new Promise();
          var test = testFactory({
            timesPromise: promise
          });
          var times = getCannedTimes();
          var timesListener = jasmine.createSpy('times listener');

          test.animation.on('load:times', timesListener);

          promise.resolve(times);

          expect(timesListener).toHaveBeenCalledWith(times);
        });

        it('should trigger load:progress when a layer\'s load resets', function() {
          var test = testFactory({
            timesCount: 10
          });
          var progressListener = jasmine.createSpy('progress listener');

          // Set loading to complete
          _.each(test.layers, function(layer) {
            layer.isLoaded.andReturn(true);
          });

          test.animation.on('load:progress', progressListener);

          // Reset the first layer's loading progress
          test.layers[0].isLoaded.andReturn(false);
          test.layers[0].trigger('load:reset');

          expect(progressListener.mostRecentCall.args[0]).toBeNear(0.9, 0.0000001);
        });

      });
    });

    describe('getLoadProgress', function() {
      it('should return a percentage count of loaded tiles', function() {
        var test = testFactory({
          timesCount: 10
        });

        // Mark half the layers as loaded
        _.times(5, function(i) {
          test.layers[i].isLoaded.andReturn(false);
          test.layers[i + 5].isLoaded.andReturn(true);
        });

        expect(test.animation.getLoadProgress()).toBeNear(0.5, 0.00001);

        test.layers[0].isLoaded.andReturn(true);
        expect(test.animation.getLoadProgress()).toBeNear(0.6, 0.00001);
      });
    });

    describe('goToTime', function() {
      it('should hide the current layer', function() {
        var test = testFactory();
        var firstLayer = test.layers[0];

        spyOn(firstLayer, 'hide');

        test.animation.goToTime(test.times[75]);

        expect(firstLayer.hide).toHaveBeenCalled();
      });

      it('should show a layer with the closest timestamp', function() {
        var test = testFactory({
          baseTime: 100,
          interval: 10,
          timesCount: 10,
          limit: 10
        });

        _.each(test.layers, function(layer) {
          spyOn(layer, 'show');
        });

        test.animation.goToTime(101);
        expect(test.layers[0].setOpacity).toHaveBeenCalled();

        test.animation.goToTime(147);
        expect(test.layers[5].setOpacity).toHaveBeenCalled();

        test.animation.goToTime(9999999);
        expect(test.layers[test.layers.length - 1].setOpacity).toHaveBeenCalled();
      });
    });

    describe('next', function() {

      it('should go to the next time', function() {
        var count = 5;
        var test = testFactory({
          timesCount: count,
          limit: count
        });

        _.times(count - 1, function(i) {
          test.animation.next();
          expect(test.animation.goToTime.mostRecentCall.args[0]).
            toEqual(test.times[i + 1]);
        });
      });

      it('should start over from the first time', function() {
        var count = 3;
        var test = testFactory({ timesCount: count });

        _.times(count, test.animation.next, test.animation);
        expect(test.animation.goToTime.mostRecentCall.args[0]).
          toEqual(test.times[0]);
      });
    });

    describe('getTimes', function() {

      it('should return times', function() {
        var test = testFactory({
          timesCount: 10,
          limit: 10
        });

        expect(test.animation.getTimes()).toEqual(test.times);
      });

      it('should return an empty array if no times are loaded', function() {
        var timesPromise = new Promise();
        var test = testFactory({
          limit: 10,
          timesPromise: timesPromise
        });
        var times = getCannedTimes({ count: 10 });

        expect(test.animation.getTimes()).toEqual([]);

        timesPromise.resolve(times);
        expect(test.animation.getTimes()).toEqual(times);
      });

      it('should return a safe copy of the times array', function() {
        var test = testFactory();

        var times = test.animation.getTimes();

        times.push('eat it');
        expect(test.animation.getTimes().indexOf('eat it')).toEqual(-1);
      });

    });

    describe('setOpacity', function() {

      it('should set the opacity of animated layers', function() {
        var test = testFactory({
          timesCount: 5,
          baseTime: 0,
          interval: 100,
          speed: 1
        });

        test.animation.setOpacity(0.675);
        test.animation.goToTime(100);

        expect(test.layers[1].setOpacity).toHaveBeenCalledWith(0.675);
      });

    });
  });
});
