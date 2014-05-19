define([
  'aeris/util',
  'aeris/maps/animations/abstractanimation',
  'sinon'
], function(_, Animation) {
  var sinon = require('sinon');

  function TestFactory(opt_options) {
    var options = _.extend({
      to: new Date(99999999999)
    }, opt_options);
    var animationOptions = _.pick(options, [
      'timestep',
      'from',
      'to',
      'speed',
      'opacity',
      'endDelay'
    ]);

    this.animation = new Animation(animationOptions);

    spyOn(this.animation, 'goToTime').andCallThrough();
  }

  describe('AbstractAnimation', function() {
    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });


    beforeEach(function() {
      spyOn(Animation.prototype, 'pause').andCallThrough();
      spyOn(Animation.prototype, 'start').andCallThrough();

      this.addMatchers({
        toHaveBeenRestarted: function() {
          var animation = this.actual;
          var wasPaused = !!animation.pause.callCount;
          var wasStarted = !!animation.start.callCount;
          var isAnimating = animation.isAnimating();

          return wasPaused && wasStarted && isAnimating;
        }
      });
    });


    describe('start', function() {

      it('should animate at a specified speed (simple)', function() {
        var options = {
          from: new Date(0),
          timestep: 1000 * 60,      // one minute
          speed: 5                  // animates 5 timesteps per second
        };
        var test = new TestFactory(options);


        test.animation.start();

        _.times(25, function(i) {
          var seconds = i + 1;
          clock.tick(1000);
          // After each second, should animate up by 5 minutes
          // Because our timer interval might not be divisible
          // by 1000, we may be off by a timestep.
          expect(test.animation.goToTime.mostRecentCall.args[0]).
            toBeNear(options.timestep * options.speed * seconds, options.timestep);
        });
      });

      it('should animate at a specified speed (arbitrary)', function() {
        var options = {
          from: new Date(0),
          timestep: 37,
          speed: 57.6
        };
        var test = new TestFactory(options);

        test.animation.start();

        _.times(25, function(i) {
          var seconds = i + 1;
          clock.tick(1000);
          // After each second, should animate up by timestep * speed
          expect(test.animation.goToTime.mostRecentCall.args[0]).
            toBeNear(options.timestep * options.speed * seconds, options.timestep);
        });
      });

      it('should loop, after a delay', function() {
        var options = {
          from: new Date(0),
          to: new Date(100),
          endDelay: 1000,
          timestep: 10,
          speed: 1
        };
        var test = new TestFactory(options);
        var lastCallCount;
        test.animation.start();

        clock.tick(1000 * 10); // 10 seconds

        // Shouldn't do anything during endDelay
        lastCallCount = test.animation.goToTime.callCount;
        clock.tick(1000);
        expect(test.animation.goToTime.callCount).toEqual(lastCallCount);

        // After endDelay, should go back to the start
        clock.tick(1000);
        expect(test.animation.goToTime).toHaveBeenCalledWith(options.from.getTime());

        // Should continue animating
        clock.tick(1000);
        expect(test.animation.goToTime.callCount).toBeGreaterThan(5);
      });

      it('should not create duplicate animations', function() {
        var options = {
          from: new Date(0),
          to: new Date(5000),
          endDelay: 100,
          timestep: 1000,
          speed: 1
        };
        var test = new TestFactory(options);
        var callsPerSecond;
        var seconds = 0;

        function checkCallCount() {
          expect(test.animation.goToTime.callCount).toBeNear(callsPerSecond * seconds, 1);
        }

        function tickSeconds(s) {
          clock.tick(1000 * s);
          seconds += s;
        }

        test.animation.start();


        // Get a baseline expectation for number of calls per second.
        tickSeconds(1);
        callsPerSecond = test.animation.goToTime.callCount;

        test.animation.start();

        tickSeconds(1);
        checkCallCount();
      });

    });


    describe('pause', function() {

      it('should stop animating', function() {
        var test = new TestFactory();
        var lastCallCount;

        test.animation.start();

        clock.tick(500);
        expect(test.animation.goToTime).toHaveBeenCalled();
        lastCallCount = test.animation.goToTime.callCount;


        test.animation.pause();
        clock.tick(500);
        expect(test.animation.goToTime.callCount).toEqual(lastCallCount);
      });

    });


    describe('stop', function() {

      it('should call pause', function() {
        var test = new TestFactory();
        test.animation.start();

        test.animation.stop();
        expect(test.animation.pause).toHaveBeenCalled();
      });

      it('should go to the most recent time', function() {
        var options = {
          to: new Date(500)
        };
        var test = new TestFactory(options);

        test.animation.start();

        test.animation.stop();
        expect(test.animation.goToTime).toHaveBeenCalledWith(options.to.getTime());
      });

    });


    describe('setSpeed', function() {
      var SPEED_ORIG = 1;
      var animation;

      beforeEach(function() {
        animation = new TestFactory({
          timestep: 100,
          speed: SPEED_ORIG,
          to: new Date(9999999999999999),
          from: new Date(0)
        }).animation;
      });


      it('should change the animation speed', function() {
        function getLastTime() {
          return animation.goToTime.mostRecentCall.args[0];
        }

        animation.start();

        clock.tick(1000);
        expect(getLastTime()).toEqual(100);

        animation.setSpeed(2);
        clock.tick(1000);
        expect(getLastTime()).toEqual(300);

        animation.setSpeed(0.5);
        clock.tick(1000);
        expect(getLastTime()).toEqual(350);

        animation.setSpeed(-1);
        clock.tick(1000);
        expect(getLastTime()).toEqual(250);
      });


      describe('if the speed has changed', function() {

        describe('if the animating is currently playing', function() {

          beforeEach(function() {
            animation.start();
          });

          it('should restart the animation', function() {
            animation.setSpeed(SPEED_ORIG + 100);

            expect(animation).toHaveBeenRestarted();
          });

        });

        describe('if the animation is not currently playing', function() {

          it('should not restart the animation', function() {
            animation.setSpeed(SPEED_ORIG + 100);

            expect(animation).not.toHaveBeenRestarted();
          });

        });

      });

      describe('if the speed has not changed', function() {

        describe('if the animation is playing', function() {

          it('should not restart the animation', function() {
            animation.start();
            animation.setSpeed(SPEED_ORIG);

            expect(animation).not.toHaveBeenRestarted();
          });

        });

        describe('if the animation is not playing', function() {

          it('should not restart the animation', function() {
            expect(animation).not.toHaveBeenRestarted();
          });

        });

      });

    });


    describe('setTimestep', function() {
      var SPEED_ORIG = 1, TIMESTEP_ORIG = 100;
      var animation;

      beforeEach(function() {
        animation = new TestFactory({
          timestep: TIMESTEP_ORIG,
          speed: SPEED_ORIG,
          to: new Date(9999999999999999),
          from: new Date(0)
        }).animation;
      });


      it('should change the animation timestep', function() {
        function getLastTime() {
          return animation.goToTime.mostRecentCall.args[0];
        }

        animation.start();

        clock.tick(1000);
        expect(getLastTime()).toEqual(100);

        animation.setTimestep(200);
        clock.tick(1000);
        expect(getLastTime()).toEqual(300);

        animation.setTimestep(50);
        clock.tick(1000);
        expect(getLastTime()).toEqual(350);

        animation.setTimestep(-100);
        clock.tick(1000);
        expect(getLastTime()).toEqual(250);
      });

      describe('when the animation is playing', function() {

        beforeEach(function() {
          animation.start();
        });


        describe('if a different timestep is set', function() {

          it('should restart the animation', function() {
            animation.setTimestep(TIMESTEP_ORIG + 100);

            expect(animation).toHaveBeenRestarted();
          });

        });

        describe('if the same timestep is set', function() {

          it('should not restart the animation', function() {
            animation.setTimestep(TIMESTEP_ORIG);

            expect(animation).not.toHaveBeenRestarted();
          });

        });

      });

      describe('when the animation is not playing', function() {

        describe('if a different timestep is set', function() {

          it('should not restart the animation', function() {
            animation.setTimestep(TIMESTEP_ORIG + 100);

            expect(animation).not.toHaveBeenRestarted();
          });

        });

        describe('if the same timestep is set', function() {

          it('should not restart the animation', function() {
            animation.setTimestep(TIMESTEP_ORIG);

            expect(animation).not.toHaveBeenRestarted();
          });

        });

      });

    });


    describe('isAnimating', function() {

      beforeEach(function() {
        this.addMatchers({
          toBeAnimating: function() {
            return this.actual.isAnimating();
          }
        });
      });

      it('should tell us when it\'s animating', function() {
        var test = new TestFactory();

        expect(test.animation).not.toBeAnimating();

        test.animation.start();
        expect(test.animation).toBeAnimating();

        test.animation.pause();
        expect(test.animation).not.toBeAnimating();
      });

    });


    describe('setFrom', function() {
      var timestamp, animation;

      beforeEach(function() {
        animation = new Animation();
        timestamp = Math.round(Math.random() * 100);
      });


      it('should accept a timestamp', function() {
        animation.setFrom(timestamp);

        expect(animation.getFrom().getTime()).toEqual(timestamp);
      });

      it('should accept a date', function() {
        animation.setFrom(new Date(timestamp));

        expect(animation.getFrom().getTime()).toEqual(timestamp);
      });

      it('should trigger a \'change:from\' event', function() {
        var onChangeFrom = jasmine.createSpy('onChangeFrom');
        animation.on('change:from', onChangeFrom);

        animation.setFrom(timestamp);

        expect(onChangeFrom).toHaveBeenCalled();
        expect(onChangeFrom.mostRecentCall.args[0].getTime()).toEqual(timestamp);
      });

      it('should not trigger a \'change:from\' event when setting the same time', function() {
        var onChangeFrom = jasmine.createSpy('onChangeFrom');
        animation.on('change:from', onChangeFrom);

        animation.setFrom(timestamp);
        animation.setFrom(timestamp);

        expect(onChangeFrom.callCount).toEqual(1);
      });

      describe('if new `from` time is later than current time', function() {

        it('should go to the new `from` time', function() {
          animation.goToTime(100);
          spyOn(animation, 'goToTime').andCallThrough();

          animation.setFrom(200);

          expect(animation.goToTime).toHaveBeenCalledWith(new Date(200));
          expect(animation.getCurrentTime().getTime()).toEqual(200);
        });

      });

    });


    describe('setTo', function() {
      var timestamp, animation;

      beforeEach(function() {
        animation = new Animation();
        timestamp = Math.round(Math.random() * 100);
      });


      it('should accept a timestamp', function() {
        animation.setTo(timestamp);

        expect(animation.getTo().getTime()).toEqual(timestamp);
      });

      it('should accept a date', function() {
        animation.setTo(new Date(timestamp));

        expect(animation.getTo().getTime()).toEqual(timestamp);
      });

      it('should trigger a \'change:to\' event', function() {
        var onChangeTo = jasmine.createSpy('onChangeTo');
        animation.on('change:to', onChangeTo);

        animation.setTo(timestamp);

        expect(onChangeTo).toHaveBeenCalled();
        expect(onChangeTo.mostRecentCall.args[0].getTime()).toEqual(timestamp);
      });

      it('should not trigger a \'change:to\' event when setting the same time', function() {
        var onChangeTo = jasmine.createSpy('onChangeTo');
        animation.on('change:to', onChangeTo);

        animation.setTo(timestamp);
        animation.setTo(timestamp);

        expect(onChangeTo.callCount).toEqual(1);
      });

      describe('if new `to` time is earlier than current time', function() {

        it('should go to the new `to` time', function() {
          animation.goToTime(200);
          spyOn(animation, 'goToTime').andCallThrough();

          animation.setTo(100);

          expect(animation.goToTime).toHaveBeenCalledWith(new Date(100));
          expect(animation.getCurrentTime().getTime()).toEqual(100);
        });

      });

    });

  });
});
