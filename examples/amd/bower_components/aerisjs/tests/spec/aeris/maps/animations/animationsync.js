define([
  'aeris/util',
  'sinon',
  'aeris/events',
  'aeris/maps/animations/animationsync',
  'aeris/maps/animations/animationinterface',
  'mocks/times'
], function(_, sinon, Events, AnimationSync, Animation) {
  var CannedTimes = require('mocks/times');

  var TestFactory = function(opt_options) {
    var options = _.extend({
    }, opt_options);

    this.sync = new AnimationSync();
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


  describe('An AnimationSync', function() {

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

      it('should remove the animation', function() {
        test.sync.remove(animation);
        expect(animation.remove).toHaveBeenCalled();
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
  });
});
