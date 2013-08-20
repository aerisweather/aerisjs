define([
  'testUtils',
  'testErrors/untestedspecerror',
  'aeris/promise',
  'aeris/promisequeue'
], function(testUtils, UntestedSpecError, Promise, PromiseQueue) {
  describe('A PromiseQueue', function() {

    function getPromiseFn() {
      var promise = new Promise();

      return {
        fn: function() {
          window.setTimeout(function() {
            promise.resolve();
          }, 100);

          return promise;
        },
        promise: promise
      };
    }



    describe('Add a function to a queue', function() {
      it('should queue a function which returns a promise', function() {
        var pq = new PromiseQueue();

        pq.queue(getPromiseFn().fn);
      });

      it('should reject a non-function', function() {
        var pq = new PromiseQueue();

        expect(function() {
          pq.queue(new Date());
        }).toThrowType('InvalidArgumentError');
      });

      it('should reject a function which does NOT return a promise', function() {
        var pq = new PromiseQueue();
        var afraidOfCommitment = function() {
          return 'no promises';
        };


        pq.queue(afraidOfCommitment);

        expect(function() {
          pq.dequeue();
        }).toThrowType('InvalidArgumentError');
      });

      it('should call the function in a specified context', function() {
        var pq = new PromiseQueue();
        var ctx = { specified: 'context' };
        var spy = jasmine.createSpy('context spy').andReturn(new Promise());

        pq.queue(spy, ctx);
        pq.dequeue();

        expect(spy).toHaveBeenCalledInTheContextOf(ctx);
      });

      it('should return a promise to resolve the queued function', function() {
        var pq = new PromiseQueue();
        var promiseFn = getPromiseFn();
        var queuePromise = pq.queue(promiseFn.fn);

        expect(queuePromise).toBeInstanceOf(Promise);

        queuePromise.done(function() {
          expect(promiseFn.promise.getState()).toEqual('resolved');

          testUtils.setFlag();
        });

        pq.dequeue();
        waitsFor(testUtils.checkFlag, 'queue to resolve promise', 150);
      });
    });

    describe('Dequeue', function() {

      it('should not execute a function until calling \'dequeue\'', function() {
        var pq = new PromiseQueue();
        var promiseFn = getPromiseFn();

        spyOn(promiseFn, 'fn').andCallThrough();
        pq.queue(promiseFn.fn);

        expect(promiseFn.fn).not.toHaveBeenCalled();
      });

      it('should execute the first function queued first', function() {
        var pq = new PromiseQueue();
        var promiseFn1 = getPromiseFn();
        var promiseFn2 = getPromiseFn();

        spyOn(promiseFn1, 'fn').andCallThrough();
        spyOn(promiseFn2, 'fn').andCallThrough();
        pq.queue(promiseFn1.fn);
        pq.queue(promiseFn2.fn);

        pq.dequeue();
        expect(promiseFn1.fn).toHaveBeenCalled();
        expect(promiseFn2.fn).not.toHaveBeenCalled();
      });

      it('should wait to execute a function until the previous function has resolved its promise', function() {
        var pq = new PromiseQueue();
        var promiseFn1 = getPromiseFn();
        var promiseFn2 = getPromiseFn();
        var promiseFn3 = getPromiseFn();

        spyOn(promiseFn1, 'fn').andCallFake(function() {
          expect(promiseFn2.promise.getState()).toEqual('pending');
          expect(promiseFn3.promise.getState()).toEqual('pending');

          window.setTimeout(function() {
            promiseFn1.promise.resolve();
          }, 100);

          return promiseFn1.promise;
        });
        spyOn(promiseFn2, 'fn').andCallFake(function() {
          expect(promiseFn1.promise.getState()).toEqual('resolved');
          expect(promiseFn3.promise.getState()).toEqual('pending');

          window.setTimeout(function() {
            promiseFn2.promise.resolve();
          }, 100);

          return promiseFn2.promise;
        });
        spyOn(promiseFn3, 'fn').andCallFake(function() {
          expect(promiseFn1.promise.getState()).toEqual('resolved');
          expect(promiseFn2.promise.getState()).toEqual('resolved');

          window.setTimeout(function() {
            promiseFn3.promise.resolve();
          }, 100);

          testUtils.setFlag();      // tell the test it can finish up
          return promiseFn3.promise;
        });

        pq.queue(promiseFn1.fn);
        pq.queue(promiseFn2.fn);
        pq.queue(promiseFn3.fn);
        pq.dequeue();

        waitsFor(testUtils.checkFlag, 'fn3 to be called', 250);
      });

      it('should execute functions queued after dequeueing', function() {
        var pq = new PromiseQueue();
        var promiseFn1 = getPromiseFn();
        var promiseFn2 = getPromiseFn();

        pq.queue(promiseFn1.fn);
        pq.dequeue();
        pq.queue(promiseFn2.fn);

        promiseFn2.promise.done(testUtils.setFlag);

        waitsFor(testUtils.checkFlag, 'fn2 to resolved', 250);
      });

      it('should halt a queue with \'stop\'', function() {
        var pq = new PromiseQueue();
        var promiseFn1 = getPromiseFn();
        var promiseFn2 = getPromiseFn();
        var promiseFn3 = getPromiseFn();

        spyOn(promiseFn3, 'fn').andCallThrough();

        pq.queue(promiseFn1.fn);
        pq.queue(promiseFn2.fn);
        pq.queue(promiseFn3.fn);
        pq.dequeue();

        promiseFn2.promise.done(function() {
          pq.stop();
        });

        // Give fn3 a chance to run, if it's going to
        window.setTimeout(testUtils.setFlag, 500);
        waitsFor(testUtils.checkFlag, 'a timeout delay', 515);

        runs(function() {
          expect(promiseFn3.fn).not.toHaveBeenCalled();

          // Test: queue can restart with dequeue
          pq.dequeue();
          expect(promiseFn3.fn).toHaveBeenCalled();
        });
      });

      it('should return a promise to complete the queue\'s execution', function() {
        var pq = new PromiseQueue();
        var lastPromiseFn = getPromiseFn();
        var dq;

        spyOn(lastPromiseFn, 'fn').andCallThrough();

        pq.queue(getPromiseFn().fn);
        pq.queue(getPromiseFn().fn);
        pq.queue(lastPromiseFn.fn);


        dq = pq.dequeue();
        expect(dq).toBeInstanceOf(Promise);

        dq.done(function() {
          expect(lastPromiseFn.fn).toHaveBeenCalled();
          expect(lastPromiseFn.promise.getState()).toEqual('resolved');

          testUtils.setFlag();
        }, this);

        waitsFor(testUtils.checkFlag, 'dequeue promise to resolve', 500);
      });

      it('should refresh the promise to dequeue, when starting with a new stack', function() {
        var pq = new PromiseQueue();

        pq.queue(getPromiseFn().fn);
        pq.queue(getPromiseFn().fn);
        pq.queue(getPromiseFn().fn);

        pq.dequeue().done(function() {
          var dqPromise;

          pq.queue(getPromiseFn().fn);
          pq.queue(getPromiseFn().fn);
          pq.queue(getPromiseFn().fn);

          dqPromise = pq.dequeue();
          expect(dqPromise.getState()).toEqual('pending');

          dqPromise.done(testUtils.setFlag);
        }, this);

        waitsFor(testUtils.checkFlag, 'second round of dequeueing to complete', 700);
      });

    });


    describe('Timeout', function() {
      //... should throw a timeout if a promise does not resolve
      // but how to test....?
    });

  });
});
