define([
  'jasmine',
  'sinon',
  'testUtils',
  'gmaps/route/commands/movewaypointcommand',
  'gmaps/route/waypoint',
  'gmaps/route/route'
], function(
  jasmine,
  sinon,
  testUtils,
  MoveWaypointCommand,
  Waypoint,
  Route
) {

  function getStubbedWaypoint() {
    var waypoint = sinon.createStubInstance(Waypoint);
    waypoint.set = jasmine.createSpy('set');
    return waypoint;
  }

  function getStubbedRoute() {
    return sinon.createStubInstance(Route);
  }

  var TestFactory = function() {
    this.route_ = getStubbedRoute();
    this.waypoint_ = getStubbedWaypoint();
    this.newLatLon_ = testUtils.getRandomLatLon();
    this.originalLatLon_ = this.newLatLon_.slice(0);
    this.originalGeocodedLatLon_ = testUtils.getRandomLatLon();
    this.command_ = new MoveWaypointCommand(this.getRoute(), this.getWaypoint(), this.getNewLatLon());

    this.getWaypoint().getPosition = jasmine.createSpy('getPosition').
      andReturn(this.getOriginalGeocodedLatLon());

    this.getWaypoint().latLon = this.getOriginalLatLon();
  };
  TestFactory.prototype = {
    getRoute: function() { return this.route_; },
    getWaypoint: function() { return this.waypoint_; },
    getCommand: function() { return this.command_; },
    getNewLatLon: function() { return this.newLatLon_; },
    getOriginalLatLon: function() { return this.originalLatLon_; },
    getOriginalGeocodedLatLon: function() { return this.originalGeocodedLatLon_; }
  };

  describe('A MoveWaypointCommand', function() {
    var f;
    beforeEach(function() {
      f = new TestFactory();
    });

    it('should set a waypoint\'s latLon property', function() {
      f.getCommand().execute();

      expect(f.getWaypoint().set).toHaveBeenCalledWith({
        latLon: f.getNewLatLon()
      });
    });

    it('should undo', function() {
      f.getCommand().execute();
      f.getCommand().undo();

      expect(f.getWaypoint().set.callCount).toEqual(2);
      expect(f.getWaypoint().set.mostRecentCall.args[0]).toEqual({
        latLon: f.getOriginalLatLon()
      });
    });
  });
});
