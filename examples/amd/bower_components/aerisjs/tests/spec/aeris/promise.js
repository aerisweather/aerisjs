define(['aeris/promise'], function(Promise) {
  describe('A Promise', function() {
    var promise;
    var flag;

    var setFlag = function() {
      flag = true;
    };

    var resetFlag = function() {
      flag = false;
    };

    beforeEach(function() {
      promise = new Promise();
      flag = false;
    });

    afterEach(function() {
      promise = null;
      flag = false;
    });

    it('should trigger a callback when it\'s resolved', function() {
      promise.done(setFlag);

      promise.resolve();

      expect(flag).toBe(true);
    });

    it('should trigger a callback with a specified context', function() {
      var ctx = { foo: 'bar' };

      promise.done(function() {
        expect(this).toEqual(ctx);
        setFlag();
      }, ctx);

      promise.resolve();

      expect(flag).toEqual(true);
    });

    it('should trigger a callback if it\'s already resolved', function() {
      promise.resolve();

      promise.done(setFlag);

      expect(flag).toBe(true);
    });

    it('should trigger a callback when it fails', function() {
      promise.fail(setFlag);

      promise.reject();

      expect(flag).toBe(true);
    });

    it('should trigger a callback if it already failed', function() {
      promise.reject();

      promise.fail(setFlag);

      expect(flag).toBe(true);
    });

    it('should trigger a callback if it resolves or fails', function() {
      var p1 = new Promise(), p2 = new Promise();
      p1.always(setFlag);
      p1.resolve();
      expect(flag).toBe(true);

      resetFlag();

      p2.always(setFlag);
      p2.reject();
      expect(flag).toBe(true);
    });

    it('should trigger a callback if it has already resolved or failed', function() {
      var p1 = new Promise(), p2 = new Promise();
      p1.resolve();
      p1.always(setFlag);
      expect(flag).toBe(true);

      resetFlag();

      p2.reject();
      p2.always(setFlag);
      expect(flag).toBe(true);
    });

    it('should not trigger the wrong callbacks', function() {
      var p1 = new Promise(), p2 = new Promise();
      p1.done(setFlag);
      p1.reject();
      expect(flag).toBe(false);

      resetFlag();

      p2.fail(setFlag);
      p2.resolve();
      expect(flag).toBe(false);
    });

    it('should trigger multiple callbacks', function() {
      var count = 0;
      var upCount = function() {
        count++;
      };
      promise.done(upCount);
      promise.done(upCount);
      promise.done(upCount);
      promise.resolve();
      expect(count).toBe(3);
      count = 0;

      promise = new Promise();
      promise.fail(upCount);
      promise.fail(upCount);
      promise.fail(upCount);
      promise.reject();
      expect(count).toBe(3);
      count = 0;

      promise = new Promise();
      promise.always(upCount);
      promise.always(upCount);
      promise.always(upCount);
      promise.resolve();
      expect(count).toBe(3);
    });

    it('should pass data to callbacks', function() {
      var data = { foo: 'bar' };

      promise.done(function(data1, data2) {
        if (data1.foo === 'bar' && data2 === 'more data') {
          setFlag();
        }
      });

      promise.resolve(data, 'more data');
      expect(flag).toBe(true);
    });

    it('should cleanup callbacks when it\'s done with them', function() {
      promise.done(setFlag);
      promise.resolve();

      resetFlag();
      promise.resolve();              // Shouldn't call this again, because promise has already been resolved
      expect(flag).toBe(false);
    });

    it('should call callbacks in the correct order', function() {
      var calledFirst = false, calledSecond = false;
      promise.done(function() {
        calledFirst = true;
        expect(calledSecond).toEqual(false);
      });
      promise.done(function() {
        calledSecond = true;
      });
    });


    describe('done', function() {

      it('should throw an error if no callback is provided', function() {
        expect(function() {
          promise.done();
        }).toThrowType('InvalidArgumentError');
      });

    });


    describe('fail', function() {

      it('should throw an error if no callback is provided', function() {
        expect(function() {
          promise.fail();
        }).toThrowType('InvalidArgumentError');
      });

    });


    describe('always', function() {

      it('should throw an error if no callback is provided', function() {
        expect(function() {
          promise.always();
        }).toThrowType('InvalidArgumentError');
      });

    });


    describe('when', function() {
      var p1, p2, p3;

      beforeEach(function() {
        p1 = new Promise();
        p2 = new Promise();
        p3 = new Promise();
      });

      afterEach(function() {
        p1 = null;
        p2 = null;
        p3 = null;
      });

      it('should reject non-promises', function() {
        expect(function() {
          Promise.when('foo');
        }).toThrowType('InvalidArgumentError');

        expect(function() {
          Promise.when([
            new Promise(),
            'foo',
            new Date()
          ]);
        }).toThrowType('InvalidArgumentError');
      });

      it('should trigger callback when all promises are resolved', function() {
        Promise.when(p1, p2, p3).done(setFlag);
        expect(flag).toBe(false);

        p1.resolve();
        expect(flag).toBe(false);
        p2.resolve();
        expect(flag).toBe(false);
        p3.resolve();
        expect(flag).toBe(true);
      });

      it('should fail if any child promises fail', function() {
        Promise.when(p1, p2, p3).fail(setFlag);
        p1.resolve();
        p2.resolve();
        p3.reject();

        expect(flag).toBe(true);
      });

      it('should fail as soon as any child promise fails', function() {
        Promise.when(p1, p2, p3).fail(setFlag);
        p1.reject();
        expect(flag).toBe(true);
      });

      it('should complete when all resolve', function() {
        Promise.when(p1, p2, p3).always(setFlag);
        p1.resolve();
        expect(flag).toBe(false);
        p2.resolve();
        expect(flag).toBe(false);
        p3.resolve();
        expect(flag).toBe(true);
      });

      it('should complete if any fail', function() {
        Promise.when(p1, p2, p3).always(setFlag);
        p1.reject();
        expect(flag).toBe(true);
      });

      it('should pass responses for each promise resolved as arguments', function() {
        Promise.when(p1, p2, p3).always(function(a, b, c) {
          if (
            a[0] === 'p1-a' && a[1] === 'p1-b' &&
            b[0] === 'p2' &&
            c[0].p1[0] === 'a' && c[0].p1[1] === 'b'
          ) {
            setFlag();
          }
        });

        p1.resolve('p1-a', 'p1-b');
        p2.resolve('p2');
        p3.resolve({ p1: ['a', 'b'] });
        expect(flag).toBe(true);
      });

      it('should pass a response from the failed argument', function() {
        Promise.when(p1, p2, p3).always(function(response) {
          if (response === 'second') {
            setFlag();
          }
        });

        p1.resolve('first');
        p2.reject('second');
        expect(flag).toBe(true);
      });
    });
  });


});
