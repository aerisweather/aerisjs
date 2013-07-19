/**
 * @fileoverview Define custom jasmine matchers.
 */
require([
  'jasmine',
  'underscore',
  'gmaps/route/waypoint',
  'aeris/errors/invalidargumenterror'
], function(jasmine, _, Waypoint, InvalidArgumentError) {
  function isSameWaypoint(wp1, wp2) {
    var match = true;

    if (!(wp1 instanceof Waypoint) || !(wp2 instanceof Waypoint)) {
      throw new InvalidArgumentError('Unable to compare waypoints: invalid waypoint.');
    }

    for (var prop in wp1) {
      if (wp1.hasOwnProperty(prop) && prop !== 'cid') {
        // Property is a waypoint (eg. `previous`)
        if (wp1[prop] instanceof Waypoint) {
          match = isSameWaypoint(wp1[prop], wp2[prop]) ? match : false;
        }
        else {
          match = _.isEqual(wp1[prop], wp2[prop]) ? match : false;
        }
      }
    }

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
      },

      toMatchWaypoint: function(expectedWaypoint) {
        this.message = 'Expected waypoints to match, but they did not.' +
          'Expected waypoint: ' + JSON.stringify(expectedWaypoint) +
          'Actual waypoint: ' + JSON.stringify(this.actual);

        return isSameWaypoint(expectedWaypoint, this.actual);
      },

      toMatchRoute: function(expectedRoute) {
        this.message = 'Expected routes to match, but they did not.' +
          'Expected route: ' + JSON.stringify(expectedRoute) +
          'Actual route: ' + JSON.stringify(this.actual);

        return isSameRoute(expectedRoute, this.actual);
      },

      // Thanks to: https://gist.github.com/joecorcoran/3818133
      // for not making me think.
      toBeNear: function(expected, within) {
        within = within || 1;
        return (this.actual >= (expected - within)) && (this.actual <= (expected + within));
      }
    });
  });
});
