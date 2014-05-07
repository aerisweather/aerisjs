define([
  'aeris/util',
  'sinon',
  'aeris/events',
  'aeris/maps/animations/animationsync',
  'aeris/maps/animations/animationinterface',
  'mocks/aeris/maps/layers/animationlayer',
  'mocks/times'
], function(_, sinon, Events, AnimationSync, Animation, MockAnimationLayer) {
  var CannedTimes = require('mocks/times');

  var TestFactory = function(opt_options) {
    var options = _.extend({
    }, opt_options);

    this.sync = new AnimationSync([], options);
  };

  var MockAnimation = function(opt_options) {
    var options = _.extend({
      interval: 100,
      progress: 0.5,
      times: new CannedTimes()
    }, opt_options);

    var anim = sinon.createStubInstance(Animation);

    _.extend(anim, Events.prototype);

    _.extend(anim, jasmine.createSpyObj('mock animation', [
      'start',
      'stop',
      'pause',
      'next',
      'previous',
      'goToTime',
      'getAnimationInterval',
      'getLoadProgress',
      'remove',
      'getTimes'
    ]));

    anim.getAnimationInterval.andReturn(options.interval);

    anim.getLoadProgress.andReturn(options.progress);

    anim.getTimes.andReturn(options.times);

    Events.call(anim);

    return anim;
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
        var MockAnimationType;
        var animationSync;
        var layer_A, layer_B;
        var FROM_STUB = 'FROM_STUB', TO_STUB = 'TO_STUB', LIMIT_STUB = 'LIMIT_STUB';

        beforeEach(function() {
          layer_A = new MockAnimationLayer();
          layer_B = new MockAnimationLayer();

          MockAnimationType = jasmine.createSpy('MockAnimationType').
            andReturn(new MockAnimation());

          animationSync = new AnimationSync(null, {
            AnimationType: MockAnimationType,
            from: FROM_STUB,
            to: TO_STUB,
            limit: LIMIT_STUB
          });
        });


        it('should create animation objects for each added layer', function() {
          var animOptions = {
            from: FROM_STUB,
            to: TO_STUB,
            limit: LIMIT_STUB
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
            var listener = jasmine.createSpy('load handler');
            var animation = new MockAnimation({
              progress: 1
            });
            var test = new TestFactory();

            test.sync.add(animation);
            test.sync.on('load:complete', listener);

            animation.trigger('load:complete');
            expect(listener).toHaveBeenCalled();
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

          it('should proxy layers\' load:times events', function() {
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

  });
});
