define([
  'aeris/builder/routes/routebuilder/controllers/routecontrolscontroller',
  'aeris/maps/routes/routebuilder',
  'aeris/maps/routes/route',
  'aeris/maps/routes/waypoint',
  'sinon',
  'aeris/util',
  'aeris/util/latlonutil',
  'testUtils'
], function(ControlsController, RouteBuilder, Route, Waypoint, sinon, _, latLonUtil, testUtils) {

  function getStubbedOptions(opt_options) {
    var options = _.extend({
      routeBuilder: sinon.createStubInstance(RouteBuilder)
    }, opt_options);

    spyOn(options.routeBuilder, 'getRoute').andReturn(options.route);

    return {
      routeBuilder: options.routeBuilder
    };
  }


  describe('A ControlsController', function() {
    describe('should set the starting waypoint', function() {
      var controller;
      var degrees = [
        [45, 17, 23],
        [-90, 21, 13]
      ];
      var latLon = latLonUtil.degreesToLatLon(degrees);

      function createValueSpy(val) {
        return {
          val: jasmine.createSpy().andReturn(val)
        };
      }

      function getStubbedUI() {
        var latLon = testUtils.getRandomLatLon();
        var degrees = latLonUtil.latLonToDegrees(latLon);
        
        return {
          ui: {
            latDeg: createValueSpy(degrees[0][0]),
            latMin: createValueSpy(degrees[0][1]),
            latSec: createValueSpy(degrees[0][2]),
            lonDeg: createValueSpy(degrees[1][0]),
            lonMin: createValueSpy(degrees[1][1]),
            lonSec: createValueSpy(degrees[1][2])
          },
          latLon: latLon,
          degrees: degrees
        };
      }

      it('when no waypoint exists', function() {
        var controller, opts;
        var route = sinon.createStubInstance(Route);
        var fakeUI = getStubbedUI();

        // Stub route to return no waypoints
        spyOn(route, 'at').andReturn(undefined);

        // Create controller with stubbed dependencies
        opts = getStubbedOptions({
          route: route
        });
        controller = new ControlsController(opts);

        // Stub out ui to return canned values
        controller.ui = fakeUI.ui;


        // Keep an eye on the Builder
        spyOn(opts.routeBuilder, 'addWaypoint').andCallFake(function(waypoint) {
          expect(waypoint.getPosition()).toBeNearLatLng(fakeUI.latLon, 0.01);
        });

        controller.setStartingWaypoint();

        expect(opts.routeBuilder.addWaypoint).toHaveBeenCalled();
    });

      it('when a waypoint exists', function() {
        var controller, opts;
        var route = sinon.createStubInstance(Route);
        var fakeUI = getStubbedUI();
        var waypoint = sinon.createStubInstance(Waypoint);

        // Stub on route to return a first waypoint
        spyOn(route, 'at').andCallFake(function(index) {
          expect(index).toEqual(0);
          return waypoint;
        });

        // Create controller with stubbed dependencies
        opts = getStubbedOptions({
          route: route
        });
        controller = new ControlsController(opts);

        // Stub out controller UI, to return canned latLon values
        controller.ui = fakeUI.ui;


        // Keep an eye on MoveWaypoint command
        spyOn(opts.routeBuilder, 'moveWaypoint').andCallFake(function(actualWp, latLon) {
          expect(actualWp).toEqual(waypoint);
          expect(latLon).toBeNearLatLng(fakeUI.latLon, 0.01);
        });

        controller.setStartingWaypoint();
        expect(opts.routeBuilder.moveWaypoint).toHaveBeenCalled();
      });
    });
  });
});
