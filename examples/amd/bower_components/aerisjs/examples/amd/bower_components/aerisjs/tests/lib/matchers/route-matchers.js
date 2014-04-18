require([
  'jasmine',
  'underscore',
  'aeris/maps/routes/waypoint',
  'aeris/errors/invalidargumenterror'
], function(jasmine, _, Waypoint, InvalidArgumentError) {

  function isSameWaypoint(wp1, wp2) {
    var match = true;
    var compareProps = [
      'path', 'latLon', 'position', 'followDirections', 'travelMode'
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

    match = (wp1.getDistance() === wp2.getDistance()) ? match : false;

    return match;
  }

  function isSameRoute(route1, route2) {
    var waypoints1 = route1.getWaypoints();
    var waypoints2 = route2.getWaypoints();
    var match = true;

    if (waypoints1.length !== waypoints2.length) {
      match = false;
    }

    for (var i = 0; i < waypoints1.length; i++) {
      match = isSameWaypoint(waypoints1[i], waypoints2[i]) ? match : false;
    }

    return match;
  }



  beforeEach(function() {
    this.addMatchers({
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
          var msg = this.isNot ? 'Expected routes not to match' : 'Expected routes to match';
          return msg +
            '\n\n Expected route: ' + JSON.stringify(expectedRoute) +
            '\n\n Actual route: ' + JSON.stringify(actualWaypoint);
        };

        return isSameRoute(expectedRoute, this.actual);
      }
    });
  });
});
