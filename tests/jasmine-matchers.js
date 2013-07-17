/**
 * @fileoverview Define custom jasmine matchers.
 */
require(['jasmine'], function() {
  beforeEach(function() {
    this.addMatchers({
      /**
       * Passes if the provided method throws an error
       * which is an instance of `err`, or has a `name`
       * property of `err'.
       *
       * @param {Error|string} err Error constructor, or error name.
       * @return {boolean}
       */
      toThrowType: function(err) {
        var errorName;
        var isObject = err === Object(err);

        if (isObject) {
          var tmpError = new err();
          errorName = tmpError.name;
        }
        else {
          errorName = err;
        }

        try {
          this.actual();
        } catch (e) {
          this.message = 'Expected to throw error type \'' + errorName + '\',' +
            'but instead threw error type \'' + e.name + '\'';

          if (isObject) {
            return e instanceof err;
          }
          else {
            return e.name === errorName;
          }
        }

        this.message = 'Expected to throw error type \'' + errorName + '\',' +
          'but no error was thrown';
        return false;
      }
    });
  });
});