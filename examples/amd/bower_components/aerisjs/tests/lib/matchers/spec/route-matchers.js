require([
  'jasmine',
  'aeris/util',
  'aeris/maps/routes/waypoint',
  'mocks/waypoint',
  'aeris/maps/routes/route',
  'matchers/route-matchers'
], function(jasmine, _, Waypoint, MockWaypoint, Route) {
  describe('Jasmine Route Matchers', function() {


    describe('toMatchWaypoint', function() {
      it('should pass with and equivalent waypoint', function() {
        var wp1 = new MockWaypoint();
        var wp2 = _.extend(wp1, {
          cid: 'something else'
        });
        expect(wp2).toMatchWaypoint(wp1);
      });

      it('should fail with different waypoints', function() {
        expect(new MockWaypoint()).not.toMatchWaypoint(new MockWaypoint());
      });
    });

    describe('toMatchRoute', function() {
      it('should pass with an equivalent route', function() {
        var route1 = new Route();
        var route2 = new Route();
        var waypoints1 = [
          new MockWaypoint(),
          new MockWaypoint(),
          new MockWaypoint()
        ];
        var waypoints2 = [];

        _.each(waypoints1, function(wp1, i) {
          var wp2 = new MockWaypoint(_.extend(wp1), {
            cid: 'anotherCid_' + i
          });

          route1.add(wp1);
          route2.add(wp2);
        });

        expect(route1).toMatchRoute(route2);
      });

      it('should fail with different routes', function() {
        var route1 = new Route();
        var route2 = new Route();

        for (var i = 0; i < 3; i++) {
          route1.add(new MockWaypoint());
          route2.add(new MockWaypoint());
        }

        expect(route1).not.toMatchRoute(route2);
      });
    });
  });
});
