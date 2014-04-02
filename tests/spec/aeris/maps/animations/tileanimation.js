define([
  'aeris/util',
  'aeris/maps/animations/tileanimation',
  'aeris/model',
  'aeris/promise',
  'aeris/events',
  'mocks/aeris/maps/animations/helpers/times'
], function(_, AerisTileAnimation, Model, Promise, Events, MockTimes) {

  var MockOrderedTimes = function() {
    var times = MockTimes.apply(null, arguments);

    return _.sortBy(times, _.identity);
  };

  var MockMap = function() {};


  var MockLayer = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      opacity: 1
    });

    Model.call(this, attrs, opt_options);
  };
  _.inherits(MockLayer, Model);

  MockLayer.prototype.setMap = function(map) {
    this.set('map', map);
  };

  MockLayer.prototype.getMap = function() {
    return this.get('map');
  };

  MockLayer.prototype.isLoaded = function() {
    return true;
  };

  MockLayer.prototype.setOpacity = function(opacity) {
    this.set('opacity', opacity);
  };

  MockLayer.prototype.getOpacity = function() {
    return this.get('opacity');
  };

  MockLayer.prototype.stop = function() {
    return this;
  };

  MockLayer.prototype.show = function() {
    this.setOpacity(1);
  };

  MockLayer.prototype.hide = function() {
    this.setOpacity(0);
  };


  var MockTimeLayers = function(opt_times) {
    var times = opt_times || new MockOrderedTimes();
    var timeLayers = {};

    _.each(times, function(time) {
      timeLayers[time] = new MockLayer({
        time: new Date(time)
      });
    });

    return timeLayers;
  };


  var MockLayerLoader = function() {
    this.createPromiseSpy_('load');
    Events.call(this);
  };
  _.extend(MockLayerLoader.prototype, Events.prototype);

  MockLayerLoader.prototype.load = function() {
    return new Promise();
  };

  MockLayerLoader.prototype.createPromiseSpy_ = function(methodName) {
    var methodNotCalledError = new Error('Unable to resolve mock promise method: ' +
      methodName + ' method was never called');
    var throwMethodNotCalledError = function() {
      throw methodNotCalledError;
    };

    // Stub the spy,
    // and provide test methods for resolving the returned promise;
    var methodSpy = spyOn(this, methodName).andCallFake(function() {
      var promise = new Promise();

      methodSpy.andResolveWith = function(var_args) {
        promise.resolve.apply(promise, arguments);
      };
      methodSpy.andRejectWith = function(var_args) {
        promise.reject.apply(promise, arguments);
      };

      return promise;
    });

    methodSpy.andResolveWith = throwMethodNotCalledError;
    methodSpy.andRejectWith = throwMethodNotCalledError;

    return methodSpy;
  };

  MockLayerLoader.prototype.getLoadProgress = function() {
    return 0.12345;
  };





  describe('An AerisTile Animation', function() {
    var animation, layerLoader, baseLayer;
    var times, timeLayers;
    var TIMES_COUNT = 10;

    beforeEach(function() {
      baseLayer = new MockLayer();
      layerLoader = new MockLayerLoader();
      animation = new AerisTileAnimation(baseLayer, {
        animationLayerLoader: layerLoader
      });


      times = new MockOrderedTimes(TIMES_COUNT);
      timeLayers = new MockTimeLayers(times);
    });

    function resolveLayerLoader(opt_times, opt_timeLayers) {
      layerLoader.trigger('load:times', opt_times || times, opt_timeLayers || timeLayers);
      layerLoader.load.andResolveWith(opt_timeLayers || timeLayers);
    }



    describe('loadAnimationLayers', function() {

      it('should load layers using the AnimationLayerLoader', function() {
        animation.loadAnimationLayers();

        expect(layerLoader.load).toHaveBeenCalled();
      });

      it('should proxy load events from the AnimationLayerLoader', function() {
        function shouldProxyLoaderEvent(event) {
          var listener = jasmine.createSpy(event + '_listener');
          animation.on(event, listener);

          layerLoader.trigger(event, times, timeLayers);
          expect(listener).toHaveBeenCalledWith(times, timeLayers);
        }

        animation.loadAnimationLayers();

        _.each([
          'load:times',
          'load:progress',
          'load:complete',
          'load:error',
          'load:reset'
        ], shouldProxyLoaderEvent);
      });

      it('should turn of autoUpdating on the base layer', function() {
        baseLayer.set('autoUpdate', true);

        animation.loadAnimationLayers();

        expect(baseLayer.get('autoUpdate')).toEqual(false);
      });


      describe('when layers times are loaded', function() {
        var timeLayers, times;

        beforeEach(function() {
          times = new MockOrderedTimes();
          timeLayers = new MockTimeLayers(times);
          animation.loadAnimationLayers();
        });


        it('should set the current time to the latest time', function() {
          var latestTime = Math.max.apply(null, times);
          resolveLayerLoader();

          expect(animation.getCurrentTime()).toEqual(latestTime);
        });

        it('should hide all layers except for the latest', function() {
          var timeLayers = {
            10: new MockLayer({ opacity: 1}),
            20: new MockLayer({ opacity: 1}),
            30: new MockLayer({ opacity: 1})
          };
          resolveLayerLoader([10, 20, 30], timeLayers);

          expect(timeLayers[10].getOpacity()).toEqual(0);
          expect(timeLayers[20].getOpacity()).toEqual(0);
          expect(timeLayers[30].getOpacity()).toBeGreaterThan(0);
        });

      });

    });


    describe('Animation step methods', function() {

      beforeEach(function() {
        animation.loadAnimationLayers();

        spyOn(animation, 'goToTime').andCallThrough();
      });


      describe('next', function() {

        it('should go to the next time', function() {
          resolveLayerLoader();
          animation.goToTime(times[0]);

          animation.next();
          expect(animation.getCurrentTime()).toEqual(times[1]);

          animation.next();
          expect(animation.getCurrentTime()).toEqual(times[2]);
        });

        it('should go to the next closest time', function() {
          var times = [10, 20, 30];
          var timeLayers = new MockTimeLayers(times);
          resolveLayerLoader(times, timeLayers);
          animation.goToTime(22);

          animation.next();
          expect(animation.getCurrentTime()).toEqual(30);

        });

        it('should go to the first time, if the last time is current', function() {
          resolveLayerLoader();

          animation.goToTime(_.last(times));

          animation.next();
          expect(animation.getCurrentTime()).toEqual(times[0]);
        });

        it('should do nothing if no times are loaded', function() {
          // Should not throw an error
          animation.next();
          animation.next();
        });

      });


      describe('previous', function() {

        it('should go to the previous time', function() {
          resolveLayerLoader();
          animation.goToTime(times[2]);

          animation.previous();
          expect(animation.getCurrentTime()).toEqual(times[1]);

          animation.previous();
          expect(animation.getCurrentTime()).toEqual(times[0]);
        });

        it('should go to the previous closest time', function() {
          var times = [10, 20, 30];
          var timeLayers = new MockTimeLayers(times);
          resolveLayerLoader(times, timeLayers);
          animation.goToTime(22);

          animation.previous();
          expect(animation.getCurrentTime()).toEqual(10);
        });

        it('should go to the last time, if the first time is current', function() {
          resolveLayerLoader();
          animation.goToTime(times[0]);

          animation.previous();
          expect(animation.getCurrentTime()).toEqual(_.last(times));
        });

        it('should do nothing if no times are loaded', function() {
          // Should not throw error
          animation.previous();
          animation.previous();
        });

      });


      describe('goToTime', function() {

        beforeEach(function() {
          animation.loadAnimationLayers();

          this.addMatchers({
            toBeShowingLayerForTime: function(time) {
              var timeLayers = this.actual;

              var shownTimes = _.filter(_.keys(timeLayers), function(time) {
                var layer = timeLayers[time];
                return layer.getOpacity() > 0;
              });
              // Convert to numbers
              shownTimes = _.map(shownTimes, function(time) {
                return parseInt(time);
              });

              this.message = _.bind(function() {
                var message = 'Expected only layer with time ' + time + ' to be shown, ';

                if (shownTimes.length) {
                  message += 'but layers were shown for times ' + shownTimes.join(', ') + '.';
                }
                else {
                  message += 'but no layers were shown';
                }

                return message;
              }, this);

              return _.isEqual(shownTimes, [time]);
            }
          });
        });


        it('should show only the layer for the closest available time', function() {
          var timeLayers = {
            10: new MockLayer(),
            20: new MockLayer(),
            30: new MockLayer()
          };
          resolveLayerLoader([10, 20, 30], timeLayers);

          animation.goToTime(0);
          expect(timeLayers).toBeShowingLayerForTime(10);

          animation.goToTime(2);
          expect(timeLayers).toBeShowingLayerForTime(10);

          animation.goToTime(10);
          expect(timeLayers).toBeShowingLayerForTime(10);

          animation.goToTime(14);
          expect(timeLayers).toBeShowingLayerForTime(10);

          animation.goToTime(16);
          expect(timeLayers).toBeShowingLayerForTime(20);

          animation.goToTime(24);
          expect(timeLayers).toBeShowingLayerForTime(20);

          animation.goToTime(9999);
          expect(timeLayers).toBeShowingLayerForTime(30);
        });

        it('should set the current time to the specified time', function() {
          animation.goToTime(0);
          expect(animation.getCurrentTime()).toEqual(0);

          animation.goToTime(2);
          expect(animation.getCurrentTime()).toEqual(2);

          animation.goToTime(10);
          expect(animation.getCurrentTime()).toEqual(10);

          animation.goToTime(14);
          expect(animation.getCurrentTime()).toEqual(14);

          animation.goToTime(16);
          expect(animation.getCurrentTime()).toEqual(16);

          animation.goToTime(24);
          expect(animation.getCurrentTime()).toEqual(24);

          animation.goToTime(9999);
          expect(animation.getCurrentTime()).toEqual(9999);
        });

        it('should not show the layer, if the layer is not loaded', function() {
          var layer = new MockLayer({
            opacity: 0
          });
          var timeLayers = {
            10: layer
          };
          spyOn(layer, 'isLoaded').andReturn(false);
          resolveLayerLoader([10], timeLayers);

          animation.goToTime(10);
          expect(layer.getOpacity()).toEqual(0);
        });

        it('should trigger a \'change:time\' event, with a Date object', function() {
          var onChangeTime = jasmine.createSpy('onChangeTime');
          animation.on('change:time', onChangeTime);

          animation.goToTime(10);

          expect(onChangeTime).toHaveBeenCalledWith(new Date(10));
        });

        it('should reject invalid times', function() {
          expect(function() {
            animation.goToTime('today');
          }).toThrowType('InvalidArgumentError');

          animation.goToTime(12345);
          animation.goToTime(new Date(12345));
        });

      });


    });


    describe('getLoadProgress', function() {

      it('should return the load progress, using the AnimationLayerLoader', function() {
        var LOAD_PROGRESS_STUB = 0.12345;
        spyOn(layerLoader, 'getLoadProgress').andReturn(LOAD_PROGRESS_STUB);

        expect(animation.getLoadProgress()).toEqual(LOAD_PROGRESS_STUB);
      });

    });


    describe('remove', function() {

      it('should stop the animation', function() {
        spyOn(animation, 'stop');

        animation.remove();

        expect(animation.stop).toHaveBeenCalled();
      });

      it('should hide all layers', function() {
        resolveLayerLoader();
        animation.goToTime(0);

        animation.remove();

        _.each(timeLayers, function(layer) {
          expect(layer.get('opacity')).toEqual(0);
        });
      });

      it('should not destroy the animation (animation can be re-started)', function() {
        var timeLayers = {
          10: new MockLayer(),
          20: new MockLayer(),
          30: new MockLayer()
        };
        resolveLayerLoader([10, 20, 30], timeLayers);

        animation.remove();
        animation.goToTime(20);

        expect(timeLayers[20].getOpacity()).toBeGreaterThan(0);
      });

    });


    describe('setOpacity', function() {
      var OPACITY_STUB = 0.1234321;

      beforeEach(function() {
        animation.loadAnimationLayers();
      });


      it('should set the opacity of the current layer', function() {
        resolveLayerLoader();

        animation.setOpacity(OPACITY_STUB);

        expect(animation.getCurrentLayer().getOpacity()).toEqual(OPACITY_STUB);
      });

      it('should not set the opacity of non-current layers', function() {
        var timeLayers = {
          10: new MockLayer(),
          20: new MockLayer(),
          30: new MockLayer()
        };
        resolveLayerLoader([10, 20, 30], timeLayers);
        animation.goToTime(20);

        animation.setOpacity(OPACITY_STUB);

        expect(timeLayers[10].getOpacity()).toEqual(0);
        expect(timeLayers[30].getOpacity()).toEqual(0);

      });

      it('should not throw a fit if no times are loaded', function() {
        animation.setOpacity(OPACITY_STUB);
      });

      it('should use the opacity on the next layer rendered with goToTime', function() {
        var timeLayers = {
          10: new MockLayer(),
          20: new MockLayer(),
          30: new MockLayer()
        };
        resolveLayerLoader([10, 20, 30], timeLayers);
        animation.goToTime(20);

        animation.setOpacity(OPACITY_STUB);
        animation.goToTime(30);

        expect(timeLayers[10].getOpacity()).toEqual(0);
        expect(timeLayers[20].getOpacity()).toEqual(0);
        expect(timeLayers[30].getOpacity()).toEqual(OPACITY_STUB);
      });

    });


    describe('getTimes', function() {

      beforeEach(function() {
        animation.loadAnimationLayers();
      });


      it('should return a safe copy of the loaded times', function() {
        var times;
        var timeLayers = {
          10: new MockLayer(),
          20: new MockLayer(),
          30: new MockLayer()
        };
        resolveLayerLoader([10, 20, 30], timeLayers);

        times = animation.getTimes();

        expect(times).toEqual([10, 20, 30]);

        // Should be safe copy
        times.splice(0);
        expect(animation.getTimes()).toEqual([10, 20, 30]);
      });

      it('should return an empty array if no times are loaded', function() {
        expect(animation.getTimes()).toEqual([]);
      });

    });


    describe('getCurrentTime', function() {

      it('should return the current time', function() {
        var CURRENT_TIME = 1234;
        animation.goToTime(1234);

        expect(animation.getCurrentTime()).toEqual(1234);
      });

      it('should return null, if no time are loaded, and goToTime hasn\'t been called', function() {
        expect(animation.getCurrentTime()).toEqual(null);
      });

    });


  });

});
