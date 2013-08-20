define([
  'jasmine',
  'sinon',
  'aeris/util',
  'gmaps/route/commands/removewaypointcommand',
  'gmaps/route/route',
  'gmaps/route/waypoint'
], function(
  jasmine,
  sinon,
  _,
  RemoveWaypointCommand,
  Route,
  Waypoint
) {
  function getStubbedWaypoint() {
    return sinon.createStubInstance(Waypoint);
  }

  function getStubbedRoute(at_index) {
    var route = sinon.createStubInstance(Route);
    route.remove = jasmine.createSpy('remove');
    route.add = jasmine.createSpy('add');
    route.indexOf = jasmine.createSpy('indexOf').andReturn(at_index);
    return route;
  }

  var TestFactory = function(opt_at_index) {
    var at_index = _.isUndefined(opt_at_index) ? 0 : opt_at_index;
    var self = this;

    this.waypoint_ = getStubbedWaypoint();
    this.route_ = getStubbedRoute(at_index);

    this.getRoute().has = jasmine.createSpy('has').andCallFake(function(waypoint) {
      expect(waypoint).toEqual(self.getWaypoint());
      return true;
    });

    this.command_ = new RemoveWaypointCommand(this.getRoute(), this.getWaypoint());
  };
  TestFactory.prototype = {
    getRoute: function() { return this.route_; },
    getWaypoint: function() { return this.waypoint_; },
    getCommand: function() { return this.command_; }
  };


  describe('A RemoveWaypointCommand', function() {
    it('should remove a waypoint', function() {
      var f = new TestFactory();

      f.getCommand().execute();
      expect(f.getRoute().remove).toHaveBeenCalledWith(f.getWaypoint());
    });

    it('should undo', function() {
      var wpIndex = 2;
      var f = new TestFactory(wpIndex);

      f.getCommand().execute();
      f.getCommand().undo();

      expect(f.getRoute().add).toHaveBeenCalledWith(
        f.getWaypoint(),
        { at: wpIndex }
      );
    });
  });
});
