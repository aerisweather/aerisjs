require(['jasmine'], function(jasmine) {



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
            'Expected to throw error type \'' + errorName + '\',' +
              'but instead threw error type \'' + e.name + '\'';


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
        var actual = latLngToArray(this.actual);
        expected = latLngToArray(expected);

        within || (within = 0.001);

        return isWithin(actual[0], expected[0], within) && isWithin(actual[1], expected[1], within);
      }
    });
  });
});
