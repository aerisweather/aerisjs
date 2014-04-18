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

  describe('An AbstractAnimation', function() {
    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
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

        spyOn(test.animation, 'pause');

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

      it('should change the animation speed', function() {
        var test = new TestFactory({
          timestep: 100,
          speed: 1,
          to: new Date(9999999999999999),
          from: new Date(0)
        });

        function getLastTime() {
          return test.animation.goToTime.mostRecentCall.args[0];
        }

        test.animation.start();

        clock.tick(1000);
        expect(getLastTime()).toEqual(100);

        test.animation.setSpeed(2);
        clock.tick(1000);
        expect(getLastTime()).toEqual(300);

        test.animation.setSpeed(0.5);
        clock.tick(1000);
        expect(getLastTime()).toEqual(350);

        test.animation.setSpeed(-1);
        clock.tick(1000);
        expect(getLastTime()).toEqual(250);
      });

    });

    describe('setTimestep', function() {

      it('should change the animation timestep', function() {
        var test = new TestFactory({
          timestep: 100,
          speed: 1,
          to: new Date(9999999999999999),
          from: new Date(0)
        });

        function getLastTime() {
          return test.animation.goToTime.mostRecentCall.args[0];
        }

        test.animation.start();

        clock.tick(1000);
        expect(getLastTime()).toEqual(100);

        test.animation.setTimestep(200);
        clock.tick(1000);
        expect(getLastTime()).toEqual(300);

        test.animation.setTimestep(50);
        clock.tick(1000);
        expect(getLastTime()).toEqual(350);

        test.animation.setTimestep(-100);
        clock.tick(1000);
        expect(getLastTime()).toEqual(250);
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

  });
});
