define([
  'aeris/util',
  'gmaps/route/commands/appendreverseroutecommand',
  'gmaps/route/route'
], function(_, AppendReverseRouteCommand, Route) {

  var MockRoute = function() {
    var methods = [
      'getWaypoints',
      'has',
      'add',
      'set'
    ];

    _.extend(this, jasmine.createSpyObj('route', methods));

    this.setStubbedWaypoints([]);
  };
  _.inherits(MockRoute, Route);


  MockRoute.prototype.setStubbedWaypoints = function(waypoints) {
    this.getWaypoints.andReturn(waypoints);

    this.has.andCallFake(function(wp) {
      return !!waypoints.indexOf(wp);
    });
  };


  var MockRouteReverser = function() {
    var methods = [
      'getWaypointInReverse',
      'getRouteWaypointsInReverse'
    ];

    _.extend(this, jasmine.createSpyObj('routeReverser', methods));

    this.getRouteWaypointsInReverse.andReturn([]);
  };



  describe('An AppendReverseRouteCommand', function() {

    describe('execute', function() {
      var command;
      var route;
      var reverser;


      beforeEach(function() {
        reverser = new MockRouteReverser();
        route = new MockRoute();
        command = new AppendReverseRouteCommand(route, {
          routeReverser: reverser
        });
      });


      it('should add reversed waypoints onto the route, omitting the first reversed waypoint', function() {
        var reverseWaypoints = ['pointC', 'pointB', 'pointA'];
        reverser.getRouteWaypointsInReverse.andReturn(reverseWaypoints);

        command.execute();

        expect(route.add).toHaveBeenCalledWith(['pointB', 'pointA']);
      });

    });


    describe('undo', function() {
      var command;
      var route;
      var reverser;


      beforeEach(function() {
        reverser = new MockRouteReverser();
        route = new MockRoute();
        command = new AppendReverseRouteCommand(route, {
          routeReverser: reverser
        });
      });

      it('should remove the appended waypoints', function() {
        var waypointsOrig = ['pointA', 'pointB', 'pointC'];

        route.setStubbedWaypoints(waypointsOrig);

        command.execute();
        route.setStubbedWaypoints([
          'pointA', 'pointB', 'pointC', 'pointB_reverse', 'pointA_reverse'
        ]);

        command.undo();
        expect(route.set).toHaveBeenCalledWith([
          'pointA', 'pointB', 'pointC'
        ])
      });

    });

  });

});
