define([
  'aeris/util',
  'aeris/maps/routes/commands/reverseroutecommand',
  'aeris/maps/routes/route'
], function(_, ReverseRouteCommand, Route) {

  var MockRoute = function() {
    var methods = [
      'getWaypoints',
      'has',
      'reset'
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
  };



  describe('A ReverseRouteCommand', function() {

    describe('execute', function() {
      var command;
      var route;
      var reverser;


      beforeEach(function() {
        reverser = new MockRouteReverser();
        route = new MockRoute();
        command = new ReverseRouteCommand(route, {
          routeReverser: reverser
        });
      });


      it('should reset the route with reversed waypoints', function() {
        var reverseWaypoints = ['pointC', 'pointB', 'pointA'];
        reverser.getRouteWaypointsInReverse.andReturn(reverseWaypoints);

        command.execute();

        expect(route.reset).toHaveBeenCalledWith(reverseWaypoints);
      });

    });


    describe('undo', function() {
      var command;
      var route;
      var reverser;


      beforeEach(function() {
        reverser = new MockRouteReverser();
        route = new MockRoute();
        command = new ReverseRouteCommand(route, {
          routeReverser: reverser
        });
      });

      it('should reset the route with the original waypoints', function() {
        var waypointsOrig = ['pointA', 'pointB', 'pointC'];
        var waypointsReverse = ['pointC', 'pointB', 'pointA'];

        route.setStubbedWaypoints(waypointsOrig);

        command.execute();
        route.setStubbedWaypoints(waypointsReverse);

        command.undo();
        expect(route.reset).toHaveBeenCalledWith([
          'pointA', 'pointB', 'pointC'
        ]);
      });

    });

  });

});
