define([
  'aeris/util',
  'aeris/maps/animations/tileanimation',
  'aeris/model',
  'aeris/promise',
  'aeris/events',
  'mocks/aeris/maps/layers/aeristile',
  'mocks/aeris/maps/animations/helpers/times',
  'mocks/aeris/maps/animations/helpers/animationlayerloader',
  'mocks/mockfactory',
  'tests/lib/clock'
], function(_, TileAnimation, Model, Promise, Events, MockLayer, MockTimes, MockLayerLoader, MockFactory, clock) {

  var MockOrderedTimes = function(opt_count, opt_min, opt_max) {
    var times = MockTimes.call(null, opt_count, opt_min, opt_max);

    return _.sortBy(times, _.identity);
  };

  var MockMap = MockFactory({
    name: 'MockMap'
  });


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


  describe('TileAnimation', function() {
    var animation, layerLoader, masterLayer;
    var times, timeLayers;
    var TIMES_COUNT = 10, CURRENT_TIME = 10e7;
    var map;


    beforeEach(function() {
      clock.useFakeTimers(CURRENT_TIME);
    });
    afterEach(function() {
      clock.restore();
    });


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

    function resolveLayerLoader(times_or_timeLayers) {
      var times, timeLayers;

      // Arg is times
      if (_.isArray(times_or_timeLayers)) {
        times = times_or_timeLayers;
        timeLayers = createTimeLayersFromTimes(times);
      }
      // Arg is timeLayers
      else {
        timeLayers = times_or_timeLayers;
        times = _.keys(timeLayers);
      }

      layerLoader.trigger('load:times', times, timeLayers);
      layerLoader.load.andResolveWith(timeLayers);
    }

    function createTimeLayersFromTimes(times) {
      return times.reduce(function(timeLayers, time) {
        timeLayers[time] = new MockLayer({
          time: new Date(time)
        });
        return timeLayers;
      }, {});
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

    it('should bind it\'s from/to times to the animationLayerLoader\'s from/to times', function() {
      _.times(5, function(i) {
        var FROM = 1e3 * (i + 1);
        var TO = 2e3 * (i + 1);

        animation.setFrom(FROM);
        expect(layerLoader.setFrom).toHaveBeenCalledWith(FROM);

        animation.setTo(TO);
        expect(layerLoader.setTo).toHaveBeenCalledWith(TO);
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

        beforeEach(function() {
          animation.loadAnimationLayers();
        });


        it('should set the current animation time to the actual current time', function() {
          var times = _.range(Date.now() - 10, Date.now() + 10);
          var latestTime = Math.max.apply(null, times);
          resolveLayerLoader(times);

          expect(animation.getCurrentTime().getTime()).toEqual(CURRENT_TIME);
        });

        it('should sync the most current layer to the master layer', function() {
          var timeLayers = createTimeLayersFromTimes([10, 20, 30]);
          spyOn(timeLayers[30], 'bindAttributesTo');
          resolveLayerLoader(timeLayers);

          expect(timeLayers[30].bindAttributesTo).toHaveBeenCalledWithSomeOf(masterLayer);
        });

        it('should not change the animation from/to times', function() {
          animation.setFrom(0);
          animation.setTo(100);

          resolveLayerLoader([10, 20, 30, 40, 50]);

          expect(animation.getFrom().getTime()).toEqual(0);
          expect(animation.getTo().getTime()).toEqual(100);
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
          resolveLayerLoader(times);
          animation.goToTime(times[0]);

          animation.next();
          expect(animation.getCurrentTime().getTime()).toEqual(times[1]);

          animation.next();
          expect(animation.getCurrentTime().getTime()).toEqual(times[2]);
        });

        it('should go to the next closest time', function() {
          resolveLayerLoader([10, 20, 30]);
          animation.goToTime(22);

          animation.next();
          expect(animation.getCurrentTime().getTime()).toEqual(30);

        });

        it('should go to the first time, if the last time is current', function() {
          resolveLayerLoader(times);

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
          resolveLayerLoader(times);
          animation.goToTime(times[2]);

          animation.previous();
          expect(animation.getCurrentTime().getTime()).toEqual(times[1]);

          animation.previous();
          expect(animation.getCurrentTime().getTime()).toEqual(times[0]);
        });

        it('should go to the previous closest time', function() {
          resolveLayerLoader([10, 20, 30]);
          animation.goToTime(22);

          animation.previous();
          expect(animation.getCurrentTime().getTime()).toEqual(10);
        });

        it('should go to the last time, if the first time is current', function() {
          resolveLayerLoader(times);
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
             *  eg:
             *    expect(timeLayers).toBeShowingLayerForTime(time);
             *
             * @param {number} time Timestamp.
             * @return {Boolean}
             */
            toBeShowingLayerForTime: function(time) {
              var timeLayers = this.actual;
              var times = _.keys(timeLayers);

              var shownTimes = times.filter(function(time) {
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
          var timeLayers = createTimeLayersFromTimes([10, 20, 30]);
          resolveLayerLoader(timeLayers);

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
        });

        describe('when choosing a closest available time', function() {

          it('should choose a past time on goToTime(PAST_TIME), even if a future time is closer', function() {
            var times = [
              CURRENT_TIME - 100,
              CURRENT_TIME + 10
            ];
            var timeLayers = createTimeLayersFromTimes(times);
            resolveLayerLoader(timeLayers);

            animation.goToTime(CURRENT_TIME - 1);
            expect(timeLayers).toBeShowingLayerForTime(CURRENT_TIME - 100);
          });

          it('should choose a past time on goToTime(CURRENT_TIME), even if a future time is closer', function() {
            var times = [
              CURRENT_TIME - 100,
              CURRENT_TIME + 10
            ];
            var timeLayers = createTimeLayersFromTimes(times);
            resolveLayerLoader(timeLayers);

            animation.goToTime(CURRENT_TIME);
            expect(timeLayers).toBeShowingLayerForTime(CURRENT_TIME - 100);
          });

          it('should choose a future time on goToTime(FUTURE_TIME), even if a past future time is closer', function() {
            var times = [
              CURRENT_TIME - 10,
              CURRENT_TIME + 100
            ];
            var timeLayers = createTimeLayersFromTimes(times);
            resolveLayerLoader(timeLayers);

            animation.goToTime(CURRENT_TIME + 1);
            expect(timeLayers).toBeShowingLayerForTime(CURRENT_TIME + 100);
          });

          describe('when the animation has no future times', function() {

            it('should show no time, if the provided time is in the future', function() {
              var pastTimes = _.range(Date.now(), Date.now() - 1000, -10);
              var timeLayers = createTimeLayersFromTimes(pastTimes);
              resolveLayerLoader(timeLayers);

              animation.goToTime(Date.now() + 1e3);

              pastTimes.forEach(function(time) {
                expect(timeLayers).not.toBeShowingLayerForTime(time);
              });
            });

          });

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

        describe('when the layer is not loaded', function() {
          var times, timeLayers, NOW;

          beforeEach(function() {
            NOW = Date.now();

            times = _.range(NOW - 10, NOW + 10, 1);
            timeLayers = createTimeLayersFromTimes(times);

            // mark all layers as not loaded, to start
            times.forEach(function(t) {
              setIsTimeLoaded(t, false);
            });

            resolveLayerLoader(timeLayers);
          });

          function setIsTimeLoaded(time, isLoaded) {
            timeLayers[time].isLoaded.andReturn(isLoaded);

            if (isLoaded) {
              timeLayers[time].trigger('load');
            }
          }


          it('should not show the layer', function() {
            setIsTimeLoaded(NOW - 1, false);
            setIsTimeLoaded(NOW - 2, true);

            // go to not-loaded time
            animation.goToTime(Date.now() - 1);

            expect(timeLayers).not.toBeShowingLayerForTime(Date.now() - 1);
          });

          it('should show the closest loaded layer, in the same tense (past)', function() {
            setIsTimeLoaded(NOW - 1, false);
            setIsTimeLoaded(NOW - 7, true);
            setIsTimeLoaded(NOW - 8, true);

            // A closer time is available in future
            setIsTimeLoaded(NOW + 1, true);

            // go to not-loaded time (past)
            animation.goToTime(NOW - 1);
            // --> should show loaded time
            expect(timeLayers).toBeShowingLayerForTime(NOW - 7);
            expect(timeLayers).not.toBeShowingLayerForTime(NOW - 1);
          });

          it('should show the closest loaded layer, in the same tense (future)', function() {
            setIsTimeLoaded(NOW + 1, false);
            setIsTimeLoaded(NOW + 7, true);
            setIsTimeLoaded(NOW + 8, true);

            // A closer time is available in past
            setIsTimeLoaded(NOW - 1, true);

            // go to not+loaded time (past)
            animation.goToTime(NOW + 1);
            // ++> should show loaded time
            expect(timeLayers).toBeShowingLayerForTime(Date.now() + 7);
            expect(timeLayers).not.toBeShowingLayerForTime(Date.now() + 1);
          });

          describe('when the layer loads', function() {

            it('should switch to showing the loaded layer', function() {
              setIsTimeLoaded(NOW - 1, false);
              setIsTimeLoaded(NOW - 2, true);
              animation.goToTime(NOW - 1);

              setIsTimeLoaded(NOW - 1, true);
              expect(timeLayers).toBeShowingLayerForTime(NOW - 1);
              expect(timeLayers).not.toBeShowingLayerForTime(NOW - 2);
            });

            it('should not show the layer, if it\'s no longer the current layer', function() {
              setIsTimeLoaded(NOW - 1, false);
              animation.goToTime(NOW - 1);

              setIsTimeLoaded(NOW - 5, true);
              animation.goToTime(NOW - 5);

              setIsTimeLoaded(NOW - 1, true);
              expect(timeLayers).not.toBeShowingLayerForTime(NOW - 1);
              expect(timeLayers).toBeShowingLayerForTime(NOW - 5);
            });

          });

          describe('when there are no layers loaded in the same tense', function() {

            it('should show no layers', function() {
              setIsTimeLoaded(NOW + 1);

              animation.goToTime(NOW - 1);

              times.forEach(function(time) {
                expect(timeLayers).not.toBeShowingLayerForTime(time);
              });
            });
          });

        });

        it('should not show the layer, if the layer is not loaded', function() {
          var timeLayers = createTimeLayersFromTimes([10, 20, 30]);
          timeLayers[20].isLoaded.andReturn(false);
          resolveLayerLoader(timeLayers);

          animation.goToTime(20);
          expect(timeLayers[20].isShown()).toEqual(false);
        });

        it('should trigger a \'change:time\' event, with a Date object', function() {
          var onChangeTime = jasmine.createSpy('onChangeTime');
          resolveLayerLoader([5, 7, 10, 15]);
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
            var timeLayers = createTimeLayersFromTimes([10]);
            shownLayer = timeLayers[10];
            spyOn(shownLayer, 'bindAttributesTo');

            resolveLayerLoader(timeLayers);

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


    describe('preload', function() {
      var timeLayers;

      beforeEach(function() {
        timeLayers = new MockTimeLayers([0, 1, 2]);
      });

      function loadAll(timeLayers) {
        _.each(timeLayers, loadLayer);
      }

      function loadLayer(layer) {
        layer.promiseToPreload.resolve();
      }


      it('should wait for times to load, before trying to preload layers', function() {
        animation.preload();

        _.each(timeLayers, function(layer) {
          expect(layer.preload).not.toHaveBeenCalled();
        });
      });

      describe('after times are loaded', function() {

        beforeEach(function() {
          resolveLayerLoader(timeLayers);
        });


        it('should preload each timeLayer, using the master layer\'s map', function() {
          animation.preload();

          loadAll(timeLayers);

          _.each(timeLayers, function(lyr) {
            expect(lyr.preload).toHaveBeenCalled();
          });
        });

        it('should wait to load a layer until the previous layer is loaded', function() {
          animation.preload();

          expect(timeLayers[0].preload).toHaveBeenCalled();
          expect(timeLayers[1].preload).not.toHaveBeenCalled();

          timeLayers[0].promiseToPreload.resolve();
          expect(timeLayers[1].preload).toHaveBeenCalled();
          expect(timeLayers[2].preload).not.toHaveBeenCalled();
        });

        it('should resolve once all the layers are preloaded', function() {
          var onResolve = jasmine.createSpy('onResolve');

          animation.preload().
            done(onResolve).
            fail(_.throwError);

          expect(onResolve).not.toHaveBeenCalled();

          loadAll(timeLayers);

          expect(onResolve).toHaveBeenCalled();
        });

        it('should reject if any layer fails to preload', function() {
          var onReject = jasmine.createSpy('onReject');

          animation.preload().
            fail(onReject);

          timeLayers[0].promiseToPreload.resolve();
          timeLayers[1].promiseToPreload.reject();

          expect(onReject).toHaveBeenCalled();
        });

        describe('if the masterLayer\'s map is unset during preloading', function() {

          it('should continue to use the original map object for preloading', function() {
            masterLayer.setMap(map);
            animation.preload();

            masterLayer.setMap(null);
            loadLayer(timeLayers[0]);

            expect(timeLayers[1].preload).toHaveBeenCalledWith(map);
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
        var timeLayers = createTimeLayersFromTimes([10, 20, 30]);
        resolveLayerLoader(timeLayers);

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

    });


  });

});
