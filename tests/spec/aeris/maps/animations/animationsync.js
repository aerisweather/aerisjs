define([
  'aeris/util',
  'sinon',
  'aeris/events',
  'aeris/maps/animations/animationsync',
  'aeris/maps/animations/animationinterface',
  'mocks/aeris/maps/layers/animationlayer',
  'mocks/aeris/maps/animations/animation',
  'mocks/times'
], function(_, sinon, Events, AnimationSync, Animation, MockAnimationLayer, BaseMockAnimation, CannedTimes) {

  var TestFactory = function(opt_options) {
    var options = _.extend({
    }, opt_options);

    this.sync = new AnimationSync([], options);
  };

  var MockAnimation = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      interval: 100,
      progress: 0.5,
      times: new CannedTimes(),
      hasMap: true
    });

    this.loadProgress_ = options.progress;

    this.times_ = options.times;

    BaseMockAnimation.call(this, null, options);

    this.hasMap.andReturn(options.hasMap);
  };
  _.inherits(MockAnimation, BaseMockAnimation);

  MockAnimation.prototype.getLoadProgress = function() {
    return this.loadProgress_;
  };

  MockAnimation.prototype.getTimes = function() {
    return this.times_;
  };


  describe('AnimationSync', function() {


    describe('constructor', function() {

      it('should add an array of animations', function() {
        var animations = [
          new MockAnimation(),
          new MockAnimation(),
          new MockAnimation()
        ];

        spyOn(AnimationSync.prototype, 'add');

        new AnimationSync(animations);

        // Check that each animation was added
        expect(AnimationSync.prototype.add).toHaveBeenCalledWith(animations);
      });

    });


    describe('add', function() {

      it('should stop the animation', function() {
        var animation = new MockAnimation();
        var test = new TestFactory();

        test.sync.add(animation);
        expect(animation.stop).toHaveBeenCalled();
      });

      describe('when adding layers', function() {

        it('should create animation objects for each added layer', function() {
          var layer_A = new MockAnimationLayer();
          var layer_B = new MockAnimationLayer();

          var MockAnimationType = jasmine.createSpy('MockAnimationType').
            andReturn(new MockAnimation());

          var animationSync = new AnimationSync(null, {
            AnimationType: MockAnimationType,
            from: new Date(5 * 1000),
            to: new Date(10 * 1000),
            limit: 5,
            timeTolerance: 1000
          });

          var animOptions = {
            from: new Date(5 * 1000),
            to: new Date(10 * 1000),
            limit: 5,
            timeTolerance: 1000
          };
          animationSync.add([layer_A, layer_B]);

          expect(MockAnimationType).toHaveBeenCalledWith(layer_A, animOptions);
          expect(MockAnimationType).toHaveBeenCalledWith(layer_B, animOptions);
          expect(MockAnimationType.callCount).toEqual(2);
        });

      });

      describe('trigger load events', function() {

        describe('single animation', function() {

          it('should trigger a \'load:complete\' event when the animation is finshed loading', function() {
            var onLoadComplete = jasmine.createSpy('onLoadComplete');
            var animation = new MockAnimation({
              progress: 1
            });
            var test = new TestFactory();

            test.sync.add(animation);
            test.sync.on('load:complete', onLoadComplete);

            animation.trigger('load:complete');

            expect(onLoadComplete).toHaveBeenCalled();
          });

          it('should trigger a \'load:progress\' event while the animations is loading', function() {
            var listener = jasmine.createSpy('load:progress handler');
            var progress = 0.75;
            var animation = new MockAnimation({
              progress: progress
            });
            var test = new TestFactory();

            test.sync.add(animation);
            test.sync.on('load:progress', listener);

            animation.trigger('load:progress', progress);
            expect(listener).toHaveBeenCalledWith(progress);
          });
        });

        describe('multiple animations', function() {
          it('should trigger load:progress events with combined progress', function() {
            var progressArr = [];
            var animations = [];
            var progListener = jasmine.createSpy('load:progress event listener');
            var completeListener = jasmine.createSpy('load event listener');
            var test = new TestFactory();

            _.times(10, function() {
              var p = Math.random();

              progressArr.push(p);
              animations.push(new MockAnimation({
                progress: p
              }));
            });

            // Add an animation that's complete
            progressArr.push(1);
            animations.push(new MockAnimation({
              progress: 1
            }));

            // Add the animations
            // and listen to sync load events
            test.sync.add(animations);
            test.sync.on('load:progress', progListener);
            test.sync.on('load:complete', completeListener);

            animations[3].trigger('load:progress', progressArr[3]);
            expect(progListener).toHaveBeenCalledWith(_.average(progressArr));
            expect(completeListener).not.toHaveBeenCalled();
          });

          it('should trigger a \'load:complete\' event when all animations are loaded', function() {
            var listener = jasmine.createSpy('sync load complete handler');
            var test = new TestFactory();
            var animations = [
              new MockAnimation({ progress: 1 }),
              new MockAnimation({ progress: 1 }),
              new MockAnimation({ progress: 1 })
            ];

            test.sync.on('load:complete', listener);
            test.sync.add(animations);

            animations[1].trigger('load:copmlete');
            expect(listener).toHaveBeenCalled();
          });

          describe('load:times event', function() {
            var STUB_TIMES;

            beforeEach(function() {
              STUB_TIMES = _.range(0, 100, 10);
              spyOn(AnimationSync.prototype, 'getTimes').andCallFake(function() {
                return _.clone(STUB_TIMES);
              });
            });


            it('should fire when all layers have loaded their time', function() {
              var onLoadTimes = jasmine.createSpy('onLoadTimes');
              var animationSync = new TestFactory().sync;
              var animations = [
                new MockAnimation(),
                new MockAnimation(),
                new MockAnimation()
              ];
              animationSync.on('load:times', onLoadTimes);
              animationSync.add(animations);

              animations[0].trigger('load:times', []);
              expect(onLoadTimes).not.toHaveBeenCalled();
              animations[1].trigger('load:times', []);
              expect(onLoadTimes).not.toHaveBeenCalled();

              // Last of the animation finishes up...
              animations[2].trigger('load:times', []);
              expect(onLoadTimes).toHaveBeenCalledWith(STUB_TIMES);
            });

            describe('when a layer is added after all the other have loaded their times', function() {

              it('should fire an additional event when the added layer is loaded', function() {
                var newAnimation;
                var onLoadTimes = jasmine.createSpy('onLoadTimes');
                var animationSync = new TestFactory().sync;
                var animations = [
                  new MockAnimation(),
                  new MockAnimation(),
                  new MockAnimation()
                ];
                animationSync.add(animations);
                animations.forEach(function(anim) {
                  anim.trigger('load:times', []);
                });

                // Add another animation,
                // and listen for another 'load:times' event.
                newAnimation = new MockAnimation();
                animationSync.add(newAnimation);
                animationSync.on('load:times', onLoadTimes);
                newAnimation.trigger('load:times', []);

                expect(onLoadTimes).toHaveBeenCalledWith(STUB_TIMES);
              });

            });


            describe('when a layer fires a \'load:times\' event a second time', function() {

              it('should trigger an additional \'load:times\' event', function() {
                var onLoadTimes = jasmine.createSpy('onLoadTimes');
                var animationSync = new TestFactory().sync;
                var animations = [
                  new MockAnimation(),
                  new MockAnimation(),
                  new MockAnimation()
                ];
                animationSync.add(animations);
                animations.forEach(function(anim) {
                  anim.trigger('load:times', []);
                });

                animationSync.on('load:times', onLoadTimes);
                animations[1].trigger('load:times', []);

                expect(onLoadTimes).toHaveBeenCalledWith(STUB_TIMES);
              });

            });

          });

          it('should fire a load:times event when all layers have loaded their ', function() {
            var times = new CannedTimes();
            var test = new TestFactory();
            var animation = new MockAnimation();
            var spy = jasmine.createSpy();

            test.sync.add(animation);

            // Stub out syc#getTimes
            spyOn(test.sync, 'getTimes').andReturn(times);

            // Listen to sync's load:times event
            test.sync.on('load:times', spy);

            animation.trigger('load:times');
            expect(spy).toHaveBeenCalledWith(times);
          });

          it('should proxy an animation\'s autoUpdate event', function() {
            var sync = new TestFactory().sync;
            var animation = new MockAnimation();
            var onAutoUpdate = jasmine.createSpy('onAutoUpdate');
            sync.add(animation);
            sync.on('autoUpdate', onAutoUpdate);

            animation.trigger('autoUpdate', animation);

            expect(onAutoUpdate).toHaveBeenCalled();
          });

          describe('when a layer changes it\'s bounds', function() {

            it('should not change it\'s from/to times', function() {
              var sync = new TestFactory().sync;
              var animation;
              sync.setFrom(123);
              sync.setTo(456);

              animation = new MockAnimation();
              animation.setFrom(200);
              animation.setTo(300);
              sync.add([animation]);

              expect(sync.getFrom().getTime()).toEqual(123);
              expect(sync.getTo().getTime()).toEqual(456);
            });

          });

        });
      });

    });


    describe('remove', function() {
      var animation, test;

      beforeEach(function() {
        animation = new MockAnimation();
        test = new TestFactory();

        test.sync.add(animation);
      });

      it('should stop the layer animation', function() {
        test.sync.remove(animation);
        expect(animation.stop).toHaveBeenCalled();
      });

      it('should stop listening to Animation events', function() {
        var listeners = {
          load: jasmine.createSpy('load listener'),
          'load:progress': jasmine.createSpy('load:progress listener'),
          'load:times': jasmine.createSpy('load:times listener')
        };

        // Listens to all events
        _.each(listeners, function(spy, topic) {
          test.sync.on(topic, spy);
        });

        test.sync.remove(animation);

        // Trigger each LayerAnimation event, and
        // check if AnimationSync listeners were called.
        _.each(listeners, function(spy, topic) {
          animation.trigger(topic);
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });


    describe('getTimes', function() {
      it('should return all of the animation times', function() {
        var test = new TestFactory();
        var anims = [];
        var times = [];

        _.times(3, function() {
          var anim = new MockAnimation();
          times.concat(anim.getTimes());
        });
        test.sync.add(anims);

        expect(_.difference(times, test.sync.getTimes())).toEqual([]);
      });
    });


    describe('goToTime', function() {
      var mockAnimation_A, mockAnimation_B;
      var TIME_STUB = 12345;


      beforeEach(function() {
        mockAnimation_A = new MockAnimation();
        mockAnimation_B = new MockAnimation();
      });


      describe('when animations are added', function() {
        var animationSync;

        beforeEach(function() {
          animationSync = new AnimationSync();
          animationSync.add([mockAnimation_A, mockAnimation_B]);
        });


        it('should call \'goToTime\' on each added animation', function() {
          animationSync.goToTime(TIME_STUB);

          expect(mockAnimation_A.goToTime).toHaveBeenCalledWith(TIME_STUB);
          expect(mockAnimation_B.goToTime).toHaveBeenCalledWith(TIME_STUB);
        });

      });

      describe('when layers are added', function() {
        var animationSync;
        var MockAnimationFactory;

        beforeEach(function() {
          var createAnimCount = 0;
          var mockAnimations = [mockAnimation_A, mockAnimation_B];

          // Factory to provide our mock animations
          MockAnimationFactory = function() {
            var anim = mockAnimations[createAnimCount];
            createAnimCount++;

            if (!anim) {
              throw new Error('More animations created than expected');
            }

            return anim;
          };

          animationSync = new AnimationSync(null, {
            AnimationType: MockAnimationFactory
          });


          animationSync.add([new MockAnimationLayer(), new MockAnimationLayer()]);
        });


        it('should call \'goToTime\' on animation object created for each layer', function() {
          animationSync.goToTime(TIME_STUB);
          expect(mockAnimation_A.goToTime).toHaveBeenCalledWith(TIME_STUB);
          expect(mockAnimation_B.goToTime).toHaveBeenCalledWith(TIME_STUB);
        });

      });

      describe('when an animation is removed', function() {
        var animationSync;

        beforeEach(function() {
          animationSync = new AnimationSync();
          animationSync.add([mockAnimation_A, mockAnimation_B]);
          animationSync.remove(mockAnimation_B);
        });


        it('should not call \'goToTime\' on the removed animation', function() {
          animationSync.goToTime(TIME_STUB);

          expect(mockAnimation_B.goToTime).not.toHaveBeenCalled();
        });

      });

    });


    describe('next', function() {
      var animationSync;
      var TIMESTEP = 50;
      var FROM = 0;
      var TO = 2000;

      beforeEach(function() {
        animationSync = new AnimationSync(null, {
          timestep: TIMESTEP,
          from: FROM,
          to: TO
        });
        spyOn(animationSync, 'goToTime').andCallThrough();

        // Start at FROM time
        animationSync.goToTime(FROM);
      });

      it('should go to (current time + timestep)', function() {
        animationSync.next();
        expect(animationSync.goToTime).toHaveBeenCalledWith(FROM + TIMESTEP);
      });

      it('should go to \'from\', if current time is \'to\'', function() {
        animationSync.goToTime(TO);
        animationSync.next();

        // Check most recent call,
        // because test bootstrap already called with FROM
        expect(animationSync.goToTime.mostRecentCall.args[0]).toEqual(FROM);
      });

      it('should go to \'to\', if (current time + timestep) would be more than to', function() {
        animationSync.goToTime(TO - TIMESTEP + 1);

        animationSync.next();

        expect(animationSync.goToTime).toHaveBeenCalledWith(TO);
      });

      describe('when called with a timestep argument', function() {

        it('should go to (current time + timestep)', function() {
          TIMESTEP += 123;    // arbitrary (different) number

          animationSync.next(TIMESTEP);
          expect(animationSync.goToTime).toHaveBeenCalledWith(FROM + TIMESTEP);
        });

      });

    });


    describe('previous', function() {
      var animationSync;
      var TIMESTEP = 50;
      var FROM = 0;
      var TO = 2000;

      beforeEach(function() {
        animationSync = new AnimationSync(null, {
          timestep: TIMESTEP,
          from: FROM,
          to: TO
        });
        spyOn(animationSync, 'goToTime').andCallThrough();

        // Start at TO time
        animationSync.goToTime(TO);
      });

      it('should go to (current time - timestep)', function() {
        animationSync.previous();
        expect(animationSync.goToTime).toHaveBeenCalledWith(TO - TIMESTEP);
      });

      it('should go to \'to\', if current time is \'from\'', function() {
        animationSync.goToTime(FROM);
        animationSync.previous();

        // Check most recent call,
        // because test bootstrap already called with TO
        expect(animationSync.goToTime.mostRecentCall.args[0]).toEqual(TO);
      });

      it('should go to \'from\', if (current time - timestep) would be less than from', function() {
        animationSync.goToTime(FROM + TIMESTEP - 1);

        animationSync.previous();

        expect(animationSync.goToTime).toHaveBeenCalledWith(FROM);
      });

      describe('when called with a timestep argument', function() {

        it('should go to (current time - timestep)', function() {
          TIMESTEP += 123;    // arbitrary (different) number

          animationSync.previous(TIMESTEP);
          expect(animationSync.goToTime).toHaveBeenCalledWith(TO - TIMESTEP);
        });

      });


    });


    describe('changeTime', function() {
      var onChangeTime;
      var animationSync;
      var TIME_STUB = 1234321;

      beforeEach(function() {
        animationSync = new AnimationSync();

        onChangeTime = jasmine.createSpy('onChangeTime');
        animationSync.on('change:time', onChangeTime);
      });


      it('should emit when goToTime is called', function() {
        animationSync.goToTime(TIME_STUB);
        expect(onChangeTime).toHaveBeenCalled();
      });

      it('should include the current animation time as a Date object', function() {
        var timeEventParam;

        animationSync.goToTime(TIME_STUB);

        timeEventParam = onChangeTime.mostRecentCall.args[0];
        expect(timeEventParam).toBeInstanceOf(Date);
        expect(timeEventParam.getTime()).toEqual(TIME_STUB);
      });

    });


    describe('getLoadProgress', function() {

      it('should return the average load progress of layers with maps which are loaded', function() {
        var animSync = new AnimationSync();
        animSync.add([
          //
          new MockAnimation({
            hasMap: true,
            progress: 0.1
          }),
          new MockAnimation({
            hasMap: true,
            isLoaded: true,
            progress: 0.2
          }),
          new MockAnimation({
            hasMap: false,
            progress: 0.8
          }),
          new MockAnimation({
            hasMap: false,
            progress: 0.9
          })
        ]);

        expect(animSync.getLoadProgress()).toEqual(_.average([0.1, 0.2]));
      });

    });


    describe('preload', function() {
      var animSync, animsWithMap, animsWithoutMap;

      beforeEach(function() {
        animSync = new AnimationSync();

        animsWithMap = _.range(0, 3).map(function() {
          return new MockAnimation({
            hasMap: true
          });
        });
        animsWithoutMap = _.range(0, 3).map(function() {
          return new MockAnimation({
            hasMap: false
          });
        });
      });

      function loadAll(animations) {
        animations.forEach(function(anim) {
          anim.promiseToPreload.resolve();
        });
      }


      it('should preload only animations which have a map', function() {
        animSync.add(animsWithMap);
        animSync.add(animsWithoutMap);

        animSync.preload();
        loadAll(animsWithMap);
        loadAll(animsWithoutMap);

        animsWithMap.forEach(function(anim) {
          expect(anim.preload).toHaveBeenCalled();
        });

        animsWithoutMap.forEach(function(anim) {
          expect(anim.preload).not.toHaveBeenCalled();
        });
      });

      it('should preload animation sequentially', function() {
        animSync.add(animsWithMap);

        animSync.preload();

        expect(animsWithMap[0].preload).toHaveBeenCalled();
        expect(animsWithMap[1].preload).not.toHaveBeenCalled();

        animsWithMap[0].promiseToPreload.resolve();
        expect(animsWithMap[1].preload).toHaveBeenCalled();
        expect(animsWithMap[2].preload).not.toHaveBeenCalled();
      });

      it('should resolve when all animations are preloaded', function() {
        var onResolve = jasmine.createSpy('onResolve');
        animSync.add(animsWithMap);

        animSync.preload().
          done(onResolve).
          fail(_.throwError);

        expect(onResolve).not.toHaveBeenCalled();

        loadAll(animsWithMap);
        expect(onResolve).toHaveBeenCalled();
      });

      it('should reject when any animation fails to preload', function() {
        var onReject = jasmine.createSpy('onReject');
        animSync.add(animsWithMap);

        animSync.preload().
          fail(onReject);

        animsWithMap[0].promiseToPreload.reject();
        expect(onReject).toHaveBeenCalled();
      });

    });

  });
});
