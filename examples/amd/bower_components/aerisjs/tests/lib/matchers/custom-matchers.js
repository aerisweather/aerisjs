require([
  'underscore',
  'jasmine'
], function(_, jasmine) {



  function isWithin(a, b, within) {
    within = within || 1;
    return (a >= (b - within)) && (a <= (b + within));
  }

  function latLngToArray(latLng) {
    if (latLng.lat && latLng.lng) {
      return [latLng.lat(), latLng.lng()];
    }

    return latLng;
  }

  function isNearLatLng(expected, actual, within) {
    actual = latLngToArray(actual);
    expected = latLngToArray(expected);

    within || (within = 0.001);

    return isWithin(actual[0], expected[0], within) &&
            isWithin(actual[1], expected[1], within);
  }

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
        var wrongTypeMsg;


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

          wrongTypeMsg = this.isNot ?
            'Expected not to throw error type \'' + errorName + '\'' :
            'Expected to throw error type "' + errorName + '",' +
              'but instead threw error type "' + e.name + '",' +
              ' with message: "' + e.message + '"';


          this.message = function() {
            return wrongTypeMsg;
          };

          if (isObject) {
            return e instanceof err;
          }
          else {
            return e.name === errorName;
          }
        }

        this.message = function() {
          return 'Expected to throw error type \'' + errorName + '\',' +
            'but no error was thrown';
        };

        return false;
      },

      toBeInstanceOf: function(SomeClass) {
        return this.actual instanceof SomeClass;
      },

      // Thanks to: https://gist.github.com/joecorcoran/3818133
      // for not making me think.
      toBeNear: function(expected, within) {
        return isWithin(this.actual, expected, within);
      },


      toBeNearLatLng: function(expected, within) {
        return isNearLatLng(expected, this.actual, within);
      },

      toBeNearPath: function(expectedPath, within) {
        var actualPath = this.actual;
        var match = true;


        // Compare paths' latLngs
        // Leveraging existing toBeNearLatLng custom matcher
        _.each(actualPath, function(actualLatLon, i) {
          var expectedLatLon = expectedPath[i];

          // Compare latLngs
          if (!isNearLatLng(expectedLatLon, actualLatLon, within)) {
            match = false;
          }
        }, this);


        // Make sure the paths are the same length
        if (actualPath.length !== expectedPath.length) {
          match = false;
        }

        return match;
      },


      /**
       * Checks that the spy was called with
       * at least the arguments called.
       *
       * eg.
       *  spy('foo', 'bar');
       *  expect(spy).toHaveBeenCalledWithSomeOf('foo'); // passes
       *  expect(spy).toHaveBeenCalledWithSomeOf('bar'); // passes
       *  expect(spy).toHaveBeenCalledWithSomeOf('foo', 'bar'); // passes
       *  expect(spy).toHaveBeenCalledWithSomeOf('foo', 'bar', 'baz'); // fails
       *  expect(spy).toHaveBeenCalledWithSomeOf('baz'); // fails
       *
       * @param {*} var_args
       * @return {Boolean}
       */
      toHaveBeenCalledWithSomeOf: function(var_args) {
        var spy = this.actual;
        var expectedArgs = _.argsToArray(arguments);
        var isPassing = true;

        _.each(spy.argsForCall, function(callArgs) {
          if (_.difference(expectedArgs, callArgs).length !== 0) {
            isPassing = false;
          }
        });

        this.message = _.bind(function() {
          var notWord = this.isNot ? 'not' : '';
          return 'Expected spy \'' + spy.identity + '\' ' + notWord +
            ' to have been called with ' + jasmine.pp(expectedArgs) + '. ' +
            'Actual calls were ' + jasmine.pp(spy.argsForCall);
        }, this);

        return isPassing;
      }
    });
  });
});
