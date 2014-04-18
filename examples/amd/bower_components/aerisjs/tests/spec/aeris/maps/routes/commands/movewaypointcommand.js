define([
  'testUtils',
  'aeris/model',
  'aeris/maps/routes/commands/movewaypointcommand',
  'aeris/maps/routes/waypoint',
  'aeris/maps/routes/route'
], function(
  testUtil,
  Model,
  MoveWaypointCommand,
  Waypoint,
  Route
) {

  var MockWaypoint = function() {
    Model.apply(this, arguments);

    spyOn(this, 'getPosition').andReturn(this.get('position'));
  };
  _.inherits(MockWaypoint, Waypoint);


  var MockRoute = function() {
  };
  _.inherits(MockRoute, Route);


  function throwError(err) {
    console.log('Error: ', arguments);

    if (err instanceof Error) {
      throw err;
    }
  }


  describe('A MoveWaypointCommand', function() {

    describe('execute', function() {

      it('should set the new position on the waypoint', function() {
        var waypoint = new MockWaypoint({
          position: [45, -90]
        });

        var command = new MoveWaypointCommand(new MockRoute(), waypoint, [30, -20]);

        command.execute().
          done(testUtil.setFlag).
          fail(throwError);

        waitsFor(testUtil.checkFlag, 100, 'Command to execute');
        runs(function() {
          expect(waypoint.get('position')).toEqual([30, -20]);
        });
      });

    });

    describe('undo', function() {

      it('should reset the waypoint to the old position', function() {
        var waypoint = new MockWaypoint({
          position: [45, -90]
        });

        var command = new MoveWaypointCommand(new MockRoute(), waypoint, [30, -20]);

        command.execute().
          done(testUtil.setFlag).
          fail(throwError);

        waitsFor(testUtil.checkFlag, 100, 'Command to execute');
        runs(testUtil.resetFlag);
        runs(function() {
          command.undo().
            done(function() {
              expect(waypoint.get('position')).toEqual([45, -90]);
            }).
            done(testUtil.setFlag).
            fail(throwError);
        });
        waitsFor(testUtil.checkFlag, 100, 'Command to undo');
      });

      it('should use a copy of the old position', function() {
        var position_orig = [45, -90];
        var waypoint = new MockWaypoint({
          position: position_orig
        });

        var command = new MoveWaypointCommand(new MockRoute(), waypoint, [30, -20]);

        command.execute().
          done(testUtil.setFlag).
          fail(throwError);

        waitsFor(testUtil.checkFlag, 100, 'Command to execute');
        runs(testUtil.resetFlag);
        runs(function() {
          // Modifiy original position
          position_orig.splice(1, 0, 'foo', 'bar');

          command.undo().
            done(function() {
              // Modifiy original position
              position_orig.splice(1, 0, 'foo', 'bar');

              // Should change new position
              expect(waypoint.get('position')).toEqual([45, -90]);
            }).
            done(testUtil.setFlag).
            fail(throwError);
        });
        waitsFor(testUtil.checkFlag, 100, 'Command to undo');
      });

    });

  });

});
