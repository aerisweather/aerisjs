define([
  'mocks/waypoint'
], function(MockWaypoint) {
  var flag = false;

  return {

    setFlag: function() {
      flag = true;
    },

    resetFlag: function() {
      flag = false;
    },

    checkFlag: function() {
      return flag;
    },

    randomFloatBetween: function(minValue, maxValue, precision) {
      precision || (precision = 2);
      return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
    },

    getRandomLatLon: function(from, to) {
      from || (from = [39, -91]);
      to || (to = [41, -89]);

      return [
        this.randomFloatBetween(from[0], to[0]),
        this.randomFloatBetween(from[1], to[1])
      ];
    },

    getMockWaypoints: function(count) {
      var waypoints = [];

      count || (count = 3);

      // Create the first waypoint (has no path, distance)
      waypoints.push(new MockWaypoint(null, true));

      for (var i = 0; i < (count - 1); i++) {
        waypoints.push(new MockWaypoint());
      }

      return waypoints;
    }
  };
});
