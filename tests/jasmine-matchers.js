/**
 * @fileoverview Define custom jasmine matchers.
 */
require([
  'jasmine',
  'vendor/underscore',
  'gmaps/route/waypoint',
  'aeris/errors/invalidargumenterror'
], function(jasmine, _, Waypoint, InvalidArgumentError) {
  function isSameWaypoint(wp1, wp2) {
    var match = true;
    var compareProps = [
      'path', 'originalLatLon', 'geocodedLatLon', 'followPaths', 'travelMode',
      'previous'
    ];

    if (!(wp1 instanceof Waypoint) || !(wp2 instanceof Waypoint)) {
      throw new InvalidArgumentError('Unable to compare waypoints: invalid waypoint.');
    }

    _.each(compareProps, function(prop) {
      if (wp1[prop] instanceof Waypoint) {
        match = isSameWaypoint(wp1[prop], wp2[prop]) ? match : false;
      }
      else {
        match = _.isEqual(wp1[prop], wp2[prop]) ? match : false;
      }
    });

    match = wp1.getDistance() === wp2.getDistance() ? match : false;

    return match;
  }

  function isSameRoute(route1, route2) {
    var waypoints1 = route1.getWaypoints();
    var waypoints2 = route2.getWaypoints();
    var match = true;

    expect(waypoints1.length).toEqual(waypoints2.length);

    for (var i = 0; i < waypoints1.length; i++) {
      match = isSameWaypoint(waypoints1[i], waypoints2[i]) ? match : false;
    }

    return match;
  }


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

      toMatchWaypoint: function(expectedWaypoint) {
        var actualWaypoint = this.actual;

        this.message = function() {
          return 'Expected waypoints to match, but they did not.' +
            'Expected waypoint: ' + JSON.stringify(expectedWaypoint) +
            'Actual waypoint: ' + JSON.stringify(actualWaypoint);
        };

        return isSameWaypoint(expectedWaypoint, this.actual);
      },

      toMatchRoute: function(expectedRoute) {
        var actualWaypoint = this.actual;

        this.message = function() {
          return 'Expected routes to match, but they did not.' +
            'Expected route: ' + JSON.stringify(expectedRoute) +
            'Actual route: ' + JSON.stringify(actualWaypoint);
        };

        return isSameRoute(expectedRoute, this.actual);
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
