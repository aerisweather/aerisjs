define([
  'aeris/maps/routes/commands/addwaypointcommand',
  'aeris/maps/routes/waypoint',
  'aeris/maps/routes/route',
  'aeris/util',
  'testErrors/untestedspecerror',
  'sinon'
], function(
  AddWaypointCommand,
  Waypoint,
  Route,
  _,
  UntestedSpecError,
  sinon
) {

  function getStubbedWaypoint() {
    return sinon.createStubInstance(Waypoint);
  }

  function getStubbedRoute() {
    var route = sinon.createStubInstance(Route);
    route.add = jasmine.createSpy('add');
    route.remove = jasmine.createSpy('remove');
    route.getWaypoints = jasmine.createSpy('getWaypoints').andReturn([
      getStubbedWaypoint(), getStubbedWaypoint(), getStubbedWaypoint()
    ]);

    return route;
  }

  var TestFactory = function(opt_options) {
    this.route_ = getStubbedRoute();
    this.waypoint_ = getStubbedWaypoint();
    this.command_ = new AddWaypointCommand(this.getRoute(), this.getWaypoint(), opt_options);
  };
  TestFactory.prototype = {
    getRoute: function() { return this.route_; },
    getWaypoint: function() { return this.waypoint_; },
    getCommand: function() { return this.command_; }
  };

  describe('An AddWaypointCommand', function() {
    it('should add waypoint to a route at a specified index', function() {
      var index = 7;
      var factory = new TestFactory({ at: index });

      factory.getCommand().execute();
      expect(factory.getRoute().add).toHaveBeenCalledWith(
        factory.getWaypoint(),
        { at: index }
      );
    });

    it('should add a waypoint to the end of a route', function() {
      var factory = new TestFactory();
      var routeLength = factory.getRoute().getWaypoints().length;

      factory.getCommand().execute();
      expect(factory.getRoute().add).toHaveBeenCalledWith(
        factory.getWaypoint(),
        { at: routeLength }
      );
    });

    it('should undo', function() {
      var factory = new TestFactory();

      factory.getCommand().execute();
      factory.getCommand().undo();

      expect(factory.getRoute().remove).toHaveBeenCalledWith(factory.getWaypoint());
    });
  });
});

