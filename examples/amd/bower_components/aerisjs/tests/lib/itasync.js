define(['jasmine'], function() {
  /**
   * Example:
   *
   * itAsync('should be true after 2 seconds', function(done) {
   *    setTimeout(function() {
   *      expect(something()).toBe(true);
   *      done();
   *    }, 3000);
   * });
   *
   * @param {string} specDescr
   * @param {function(Function)} specCallback
   * @param {number=} opt_timeout
   */
  return function itAsync(specDescr, specCallback, opt_timeout) {
    var timeout = opt_timeout || 3000;

    it(specDescr, function() {
      var isDone;
      var resolve = function(arg) {
        if (arg instanceof Error) {
          throw arg;
        }

        isDone = true;
      };

      specCallback(resolve);

      waitsFor(function() {
        return isDone;
      }, 'Async spec timeout', timeout);
    });
  };
});
