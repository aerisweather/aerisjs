define([
  'aeris/util',
  'aeris/maps/animations/tileanimation',
  'aeris/model',
  'aeris/promise',
  'aeris/events',
  'mocks/aeris/maps/animations/helpers/times',
  'mocks/mockfactory'
], function(_, TileAnimation, Model, Promise, Events, MockTimes, MockFactory) {

  var MockOrderedTimes = function() {
    var times = MockTimes.apply(null, arguments);

    return _.sortBy(times, _.identity);
  };

  var MockMap = MockFactory({
    name: 'MockMap'
  });

  var MockLayer = MockFactory({
    getSetters: [
      'map',
      'opacity',
      'zIndex'
    ],
    methods: [
      'stop',
      'isLoaded',
      'show',
      'hide',
      'removeStrategy',
      'resetStrategy'
    ],
    inherits: Model,
    name: 'MockLayer',
    constructor: function() {
      this.set('opacity', 1, { silent: true });

      if (!this.getMap()) {
        this.setMap(null, { silent: true });
      }
    }
  });

  MockLayer.prototype.isLoaded = function() {
    return true;
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

  MockLayer.prototype.isShown = function() {
    var isSetToMap = !_.isNull(this.getMap());
    var isVisible = this.getOpacity() > 0;
    return isSetToMap && isVisible;
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


  describe('TileAnimation', function() {
    var animation, layerLoader, masterLayer;
    var times, timeLayers;
    var TIMES_COUNT = 10;
    var map;

    beforeEach(function() {
      map = new MockMap();
      masterLayer = new MockLayer({ map: map });
      layerLoader = new MockLayerLoader();
      animation = new TileAnimation(masterLayer, {
        AnimationLayerLoader: _.constant(layerLoader)
      });


      times = new MockOrderedTimes(TIMES_COUNT);
      timeLayers = new MockTimeLayers(times);
    });

    function resolveLayerLoader(opt_times, opt_timeLayers) {
      layerLoader.trigger('load:times', opt_times || times, opt_timeLayers || timeLayers);
      layerLoader.load.andResolveWith(opt_timeLayers || timeLayers);
    }


    describe('constructor', function() {

      it('should call loadAnimationLayers', function() {
        var animation;

        spyOn(TileAnimation.prototype, 'loadAnimationLayers');

        animation = new TileAnimation(masterLayer, {
          AnimationLayerLoader: _.constant(layerLoader)
        });

        expect(TileAnimation.prototype.loadAnimationLayers).toHaveBeenCalledInTheContextOf(animation);
      });

      it('should disable the master layer strategy', function() {
        var masterLayer = new MockLayer();
        new TileAnimation(masterLayer, {
          AnimationLayerLoader: _.constant(layerLoader)
        });

        expect(masterLayer.removeStrategy).toHaveBeenCalled();
      });

      it('should not change the master layer\'s map attribute', function() {
        var mockMap = new MockMap();
        var masterLayer = new MockLayer({
          map: mockMap
        });
        new TileAnimation(masterLayer, {
          AnimationLayerLoader: _.constant(layerLoader)
        });

        expect(masterLayer.getMap()).toEqual(mockMap);
      });

    });


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

          expect(animation.getCurrentTime().getTime()).toEqual(latestTime);
        });

        it('should sync the most current layer to the master layer', function() {
          var timeLayers = {
            10: new MockLayer(),
            20: new MockLayer(),
            30: new MockLayer()
          };
          spyOn(timeLayers[30], 'bindAttributesTo');
          resolveLayerLoader([10, 20, 30], timeLayers);

          expect(timeLayers[30].bindAttributesTo).toHaveBeenCalledWithSomeOf(masterLayer);
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
          expect(animation.getCurrentTime().getTime()).toEqual(times[1]);

          animation.next();
          expect(animation.getCurrentTime().getTime()).toEqual(times[2]);
        });

        it('should go to the next closest time', function() {
          var times = [10, 20, 30];
          var timeLayers = new MockTimeLayers(times);
          resolveLayerLoader(times, timeLayers);
          animation.goToTime(22);

          animation.next();
          expect(animation.getCurrentTime().getTime()).toEqual(30);

        });

        it('should go to the first time, if the last time is current', function() {
          resolveLayerLoader();

          animation.goToTime(_.last(times));

          animation.next();
          expect(animation.getCurrentTime().getTime()).toEqual(times[0]);
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
          expect(animation.getCurrentTime().getTime()).toEqual(times[1]);

          animation.previous();
          expect(animation.getCurrentTime().getTime()).toEqual(times[0]);
        });

        it('should go to the previous closest time', function() {
          var times = [10, 20, 30];
          var timeLayers = new MockTimeLayers(times);
          resolveLayerLoader(times, timeLayers);
          animation.goToTime(22);

          animation.previous();
          expect(animation.getCurrentTime().getTime()).toEqual(10);
        });

        it('should go to the last time, if the first time is current', function() {
          resolveLayerLoader();
          animation.goToTime(times[0]);

          animation.previous();
          expect(animation.getCurrentTime().getTime()).toEqual(_.last(times));
        });

        it('should do nothing if no times are loaded', function() {
          // Should not throw error
          animation.previous();
          animation.previous();
        });

      });


      describe('goToTime', function() {
        var map;

        beforeEach(function() {
          animation.loadAnimationLayers();


          this.addMatchers({
            /**
             * Checks that only the layer for the given time
             * is set to a map.
             *
             * @param {number} time Timestamp.
             * @return {Boolean}
             */
            toBeShowingLayerForTime: function(time) {
              var timeLayers = this.actual;
              var times = _.keys(timeLayers);

              var shownTimes = _.filter(times, function(time) {
                var layer = timeLayers[time];
                return layer.isShown();
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
          expect(animation.getCurrentTime().getTime()).toEqual(0);

          animation.goToTime(2);
          expect(animation.getCurrentTime().getTime()).toEqual(2);

          animation.goToTime(10);
          expect(animation.getCurrentTime().getTime()).toEqual(10);

          animation.goToTime(14);
          expect(animation.getCurrentTime().getTime()).toEqual(14);

          animation.goToTime(16);
          expect(animation.getCurrentTime().getTime()).toEqual(16);

          animation.goToTime(24);
          expect(animation.getCurrentTime().getTime()).toEqual(24);

          animation.goToTime(9999);
          expect(animation.getCurrentTime().getTime()).toEqual(9999);
        });

        it('should not show the layer, if the layer is not loaded', function() {
          var timeLayers = {
            10: new MockLayer(),
            20: new MockLayer(),
            30: new MockLayer()
          };
          timeLayers[20].isLoaded.andReturn(false);
          resolveLayerLoader([10, 20, 30], timeLayers);

          animation.goToTime(20);
          expect(timeLayers[20].isShown()).toEqual(false);
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


        describe('the shown layer', function() {
          var shownLayer;
          var ZINDEX_STUB = 'ZINDEX_STUB';
          var OPACITY_STUB = 'OPACITY_STUB';
          var map;

          beforeEach(function() {
            var timeLayers;

            shownLayer = new MockLayer();
            spyOn(shownLayer, 'bindAttributesTo');
            timeLayers = {
              10: shownLayer
            };
            resolveLayerLoader([10], timeLayers);

            map = new MockMap();

            masterLayer.set({
              map: map,
              zIndex: ZINDEX_STUB,
              opacity: OPACITY_STUB
            });

            animation.goToTime(10);
          });


          it('should be bound to the master layer\'s opacity, zIndex, and map attributes', function() {
            var boundObj, boundAttrs;

            expect(shownLayer.bindAttributesTo).toHaveBeenCalled();

            boundObj = shownLayer.bindAttributesTo.mostRecentCall.args[0];
            boundAttrs = shownLayer.bindAttributesTo.mostRecentCall.args[1];

            expect(boundObj).toEqual(masterLayer);
            expect(_.contains(boundAttrs, 'map')).toEqual(true);
            expect(_.contains(boundAttrs, 'opacity')).toEqual(true);
            expect(_.contains(boundAttrs, 'zIndex')).toEqual(true);
          });


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


    describe('destroy', function() {

      it('should clear all event listeners', function() {
        spyOn(animation, 'stopListening');

        animation.destroy();

        expect(animation.stopListening).toHaveBeenCalled();
      });

      it('should re-enable the master layer strategy', function() {
        animation.destroy();

        expect(masterLayer.resetStrategy).toHaveBeenCalled();
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

        expect(animation.getCurrentTime().getTime()).toEqual(1234);
      });

      it('should return null, if no time are loaded, and goToTime hasn\'t been called', function() {
        expect(animation.getCurrentTime()).toEqual(null);
      });

    });


  });

});
