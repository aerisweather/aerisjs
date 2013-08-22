define([
  'aeris/util',
  'testUtils',
  'testErrors/untestedspecerror',
  'aeris/promise',
  'mocks/promise',
  'aeris/promisequeue'
], function(_, testUtils, UntestedSpecError, Promise, MockPromise, PromiseQueue) {
  describe('A PromiseQueue', function() {

    function getPromiseFn(opt_options, spyName) {
      var options = _.extend({
        resolve: true,
        delay: 100
      }, opt_options);
      var promise = new MockPromise(options);

      return {
        fn: jasmine.createSpy(spyName).andReturn(promise),
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

      it('should resolve or reject queue promises', function() {
        var pq = new PromiseQueue();
        var pFnResolve = getPromiseFn({ resolve: true, delay: false });
        var pFnReject = getPromiseFn({ resolve: false, delay: false });

        var qPromiseResolve = pq.queue(pFnResolve.fn);
        var qPromiseReject = pq.queue(pFnReject.fn);

        spyOn(qPromiseResolve, 'resolve');
        spyOn(qPromiseReject, 'reject');

        pq.dequeue();

        expect(qPromiseResolve.resolve).toHaveBeenCalled();
        expect(qPromiseReject.reject).toHaveBeenCalled();
      });
    });

    describe('Dequeue', function() {

      it('should not execute a function until calling \'dequeue\'', function() {
        var pq = new PromiseQueue();
        var promiseFn = getPromiseFn();

        pq.queue(promiseFn.fn);

        expect(promiseFn.fn).not.toHaveBeenCalled();
      });

      it('should execute the first function queued first', function() {
        var pq = new PromiseQueue();
        var promiseFn1 = getPromiseFn();
        var promiseFn2 = getPromiseFn();

        pq.queue(promiseFn1.fn);
        pq.queue(promiseFn2.fn);

        pq.dequeue();
        expect(promiseFn1.fn).toHaveBeenCalled();
        expect(promiseFn2.fn).not.toHaveBeenCalled();

        pq.stop();
      });


      it('should execute fn with in the correct order', function() {
        var pq = new PromiseQueue();
        var pFn1 = getPromiseFn({ delay: 500 }, 'pFn1');
        var pFn2 = getPromiseFn({ delay: 300 }, 'pFn2');
        var pFn3 = getPromiseFn({ delay: 100 }, 'pFn3');

        pq.queue(pFn1.fn);
        pq.queue(pFn2.fn);
        pq.queue(pFn3.fn);
        pq.dequeue();

        // First method has been called
        expect(pFn1.fn).toHaveBeenCalled();

        // Wait util pFnSlow is complete...
        window.setTimeout(testUtils.setFlag, 515);
        waitsFor(testUtils.checkFlag, 'timeout', 525);
        runs(function() {
          testUtils.resetFlag();

          // Next pFn should have been called,
          // But not yet the one after that
          expect(pFn2.fn).toHaveBeenCalled();
          expect(pFn3.fn).not.toHaveBeenCalled();

          pq.stop();
        });
      });

      it('should wait to execute a function until the previous function has resolved its promise', function() {
        var pq = new PromiseQueue();
        var promiseFn1 = getPromiseFn();
        var promiseFn2 = getPromiseFn();
        var promiseFn3 = getPromiseFn();

        promiseFn1.fn.andCallFake(function() {
          expect(promiseFn2.promise.getState()).toEqual('pending');
          expect(promiseFn3.promise.getState()).toEqual('pending');

          window.setTimeout(function() {
            promiseFn1.promise.resolve();
          }, 100);

          return promiseFn1.promise;
        });
        promiseFn2.fn.andCallFake(function() {
          expect(promiseFn1.promise.getState()).toEqual('resolved');
          expect(promiseFn3.promise.getState()).toEqual('pending');

          window.setTimeout(function() {
            promiseFn2.promise.resolve();
          }, 100);

          return promiseFn2.promise;
        });
        promiseFn3.fn.andCallFake(function() {
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

      it('should continue to execute the queue after a rejected promise', function() {
        var pq = new PromiseQueue();
        var pFn1 = getPromiseFn({ resolve: false }, 'pFn1');
        var pFn2 = getPromiseFn(null, 'pFn2');

        pq.queue(pFn1.fn);
        pq.queue(pFn2.fn);
        pq.dequeue();

        window.setTimeout(testUtils.setFlag, 500);
        waitsFor(testUtils.checkFlag, 550, 'pFn2 to resolve');
        runs(function() {
          expect(pFn1.fn).toHaveBeenCalled();
          expect(pFn2.fn).toHaveBeenCalled();
        });
      });

      it('should break execution after a rejected promise, using break option', function() {
        var pq = new PromiseQueue();
        var pFn1 = getPromiseFn({ resolve: false }, 'pFn1');
        var pFn2 = getPromiseFn(null, 'pFn2');

        pq.queue(pFn1.fn);
        pq.queue(pFn2.fn);
        pq.dequeue({ break: true });

        window.setTimeout(testUtils.setFlag, 500);
        waitsFor(testUtils.checkFlag, 550, 'pFn2 to resolve');
        runs(function() {
          expect(pFn1.fn).toHaveBeenCalled();
          expect(pFn2.fn).not.toHaveBeenCalled();
        });
      });

      it('should halt a queue with \'stop\'', function() {
        var pq = new PromiseQueue();
        var promiseFn1 = getPromiseFn();
        var promiseFn2 = getPromiseFn();
        var promiseFn3 = getPromiseFn();

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


    it('should integrate', function() {
      var times = 10, callCount = 0;
      var pq = new PromiseQueue();
      var prev;

      _.times(times, function(i) {
        var timeout = Math.ceil(100 + Math.random() * 50);
        var delay = Math.ceil(100 + Math.random() * 50);
        var promiseFn = getPromiseFn({ delay: delay }, 'pfn_' + i);

        // Queue the fn after a random timeout
        window.setTimeout(function() {
          // Save a reference to the last promiseFn
          if (prev) {
            promiseFn.prev = prev;
          }
          prev = promiseFn;

          pq.queue(promiseFn.fn);

          if (!pq.isRunning()) {
            pq.dequeue();
          }
        }, timeout);


        // Spy on the called function
        promiseFn.fn.andCallFake(function() {
          if (promiseFn.prev) {
            expect(promiseFn.prev.fn).toHaveBeenCalled();
          }
          callCount++;
          return promiseFn.promise;
        });
      });

      waitsFor(function() {
        return callCount === times;
      }, 10000, 'all promiseFns to have been called');
    });

  });
});
