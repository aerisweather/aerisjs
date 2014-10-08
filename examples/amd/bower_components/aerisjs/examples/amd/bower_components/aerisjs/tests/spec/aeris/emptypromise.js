define(['aeris/emptypromise'], function(EmptyPromise) {
  describe('An EmptyPromise', function() {
    it('should already be resolved', function() {
      var promise = new EmptyPromise();
      expect(promise.getState()).toEqual('resolved');
    });

    it('should already be rejected', function() {
      var promise = new EmptyPromise(false);
      expect(promise.getState()).toEqual('rejected');
    });

    it('should resolve with arguments', function() {
      var promise = new EmptyPromise(true, 'foo', 'bar');

      promise.done(function() {
        expect(arguments).toEqual(['foo', 'bar']);
      });
    });

    it('should reject with arguments', function() {
      var promise = new EmptyPromise(false, 'foo', 'bar');

      promise.fail(function() {
        expect(arguments).toEqual(['foo', 'bar']);
      });
    });
  });
});

