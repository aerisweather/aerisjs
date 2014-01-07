define([
  'aeris/util',
  'loader/promise/promisetorequire',
  'loader/errors/amdloaderror'
], function(_, PromiseToRequire, AmdLoadError) {

  describe('A PromiseToRequire', function() {
    var promise;
    var doneSpy, failSpy;

    beforeEach(function() {
      promise = new PromiseToRequire;
      doneSpy = jasmine.createSpy('doneSpy');
      failSpy = jasmine.createSpy('failSpy');

      promise.done(doneSpy);
      promise.fail(failSpy);


      failSpy.getRejectionArg = function() {
        return this.mostRecentCall.args[0];
      }
    });


    describe('resolve', function() {

      it('should resolve the promise', function() {
        promise.resolve('foo', 'bar');

        expect(doneSpy).toHaveBeenCalled();
        expect(failSpy).not.toHaveBeenCalled();
      });

      it('should resolve with multiple module arguments', function() {
        var modules = [
          { foo: 'bar' },
          { faz: 'baz' },
          { funky: 'monkey' }
        ];

        promise.resolve(modules[0], modules[1], modules[2]);

        expect(doneSpy).toHaveBeenCalledWith(modules[0], modules[1], modules[2]);
      });
    });


    describe('reject', function() {

      it('should reject the promise with a AmdLoadError', function() {
        var requireJsError = {
          requireType: 'STUB_REQUIRE_TYPE',
          requireModules: ['STUB', 'MODULES']
        };

        promise.reject(requireJsError);

        expect(failSpy.getRejectionArg()).toBeInstanceOf(AmdLoadError);
        expect(failSpy.getRejectionArg().code).toEqual('STUB_REQUIRE_TYPE');
        expect(failSpy.getRejectionArg().modules).toEqual(['STUB', 'MODULES']);
      });

    });

  });

});
