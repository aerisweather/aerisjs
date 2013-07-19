define([
  'aeris',
  'mocks/waypoint',
  'gmaps/route/route',
  'gmaps/route/commands/addwaypointcommand'
], function(aeris, Mockwaypoint, Route, AddWaypointCommand) {
  describe('An AddWaypointCommand', function() {
    it('adds a waypoint to a route', function() {
      var route = new Route();
      var waypoint = new Mockwaypoint();
      var command;

      spyOn(route, 'add');

      command = new AddWaypointCommand(route, waypoint);
      command.execute();

      expect(route.add).toHaveBeenCalledWith(waypoint);
    });
  });
});
