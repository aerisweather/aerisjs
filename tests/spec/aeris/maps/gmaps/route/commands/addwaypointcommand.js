define([
  'aeris',
  'aeris/promise',
  'mocks/waypoint',
  'gmaps/route/route',
  'gmaps/route/commands/addwaypointcommand',
  'mocks/directionsresults'
], function(aeris, Promise, Mockwaypoint, Route, AddWaypointCommand, MockDirectionsResult) {
  describe('An AddWaypointCommand', function() {
    var directionsResult;

    beforeEach(function() {
      directionsResult = new MockDirectionsResult();
      spyOn(google.maps.DirectionsService.prototype, 'route').andCallFake(function(request, callback) {
        callback(directionsResult, google.maps.DirectionsStatus.OK);
      });
    });


    it('adds a waypoint to a route', function() {
      var route = new Route();
      var waypoint = new Mockwaypoint();
      var command;

      spyOn(route, 'add');

      command = new AddWaypointCommand(route, waypoint);
      command.execute();

      expect(route.add).toHaveBeenCalledWith(waypoint);
    });

    it('should return a promise', function() {
      var command = new AddWaypointCommand(new Route(), new Mockwaypoint());
      expect(command.execute()).toBeInstanceOf(Promise);
    });

    it('should resolve its promise after fetching API data', function() {
      var command = new AddWaypointCommand(new Route(), new Mockwaypoint());
      var flag = false;

      // Service is mocked to immediately call callback
      command.execute().done(function() {
        flag = true;
      });
      expect(flag).toEqual(true);
    });
  });
});
