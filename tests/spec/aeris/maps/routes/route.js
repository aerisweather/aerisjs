define([
  'aeris/util',
  'aeris/model',
  'aeris/maps/routes/route'
], function(
  _,
  Model,
  Route
) {

  var MockWaypoint = function(opt_attrs, opt_options) {
    var attrs = _.defaults(opt_attrs || {}, {
      position: [12, 34]
    });
    var stubbedMethods = [
      'setPathStartsAt',
      'getDistance',
      'getPosition',
      'setPosition',
      'setMap',
      'select',
      'deselect'
    ];

    // Use Model ctor
    Model.call(this, attrs, opt_options);

    _.extend(this, jasmine.createSpyObj('mockWaypoint', stubbedMethods));

    this.getDistance.andCallFake(function() {
      return this.get('distance') || 0;
    });
    this.getPosition.andCallFake(function() {
      return this.get('position');
    });
    this.setPosition.andCallFake(function(position) {
      this.set('position', position);
    });
    this.setMap.andCallFake(function(map) {
      this.set('map', map);
    });
    this.deselect.andCallFake(function(opts) {
      this.set({ selected: false }, opts);
      this.trigger('deselect', this);
    });
    this.select.andCallFake(function(opts) {
      this.set({ selected: true }, opts);
      this.trigger('select', this);
    });
  };
  _.inherits(MockWaypoint, Model);


  function getStubbedWaypointCollection(count, opt_attrs, opt_options) {
    var waypoints = [];

    count || (count = 3);

    _.times(count, function() {
      waypoints.push(new MockWaypoint(opt_attrs, opt_options));
    });

    return waypoints;
  }


  describe('A Route', function() {

    describe('atOffset', function() {

      it('should return a waypoint at an offset from another', function() {
        var route = new Route();
        var waypoints = [new MockWaypoint(), new MockWaypoint(), new MockWaypoint()];

        route.add(waypoints);

        expect(route.atOffset(waypoints[0], 1)).toEqual(waypoints[1]);
        expect(route.atOffset(waypoints[0], 2)).toEqual(waypoints[2]);
        expect(route.atOffset(waypoints[1], 1)).toEqual(waypoints[2]);
        expect(route.atOffset(waypoints[1], -1)).toEqual(waypoints[0]);
        expect(route.atOffset(waypoints[2], -1)).toEqual(waypoints[1]);
        expect(route.atOffset(waypoints[2], -2)).toEqual(waypoints[0]);
      });

    });


    describe('getPrevious', function() {

      it('should return the previous waypoint', function() {
        var route = new Route();
        var waypoint = new MockWaypoint();

        spyOn(route, 'atOffset');

        route.getPrevious(waypoint);
        expect(route.atOffset).toHaveBeenCalledWith(waypoint, -1);
      });

    });


    describe('getNext', function() {

        it('should return the next waypoint', function() {
        var route = new Route();
        var waypoint = new MockWaypoint();

        spyOn(route, 'atOffset');

        route.getNext(waypoint);
        expect(route.atOffset).toHaveBeenCalledWith(waypoint, 1);
      });

    });


    describe('getSelected', function() {

      it('should return a list of selected waypoints', function() {
        var waypoints = [
          new MockWaypoint({ selected: true }),   // 0
          new MockWaypoint({ selected: false }),  // 1
          new MockWaypoint({ selected: true }),   // 2
          new MockWaypoint({ selected: false }),  // 3
          new MockWaypoint({ selected: true })    // 4
        ];
        var route = new Route(waypoints);

        expect(route.getSelected()).toEqual([
          waypoints[0], waypoints[2], waypoints[4]
        ]);
      });

        it('should return an empty array if no waypoints are selected', function() {
          var waypoints = [
            new MockWaypoint({ selected: false }),
            new MockWaypoint({ selected: false }),
            new MockWaypoint({ selected: false }),
            new MockWaypoint({ selected: false }),
            new MockWaypoint({ selected: false })
          ];
          var route = new Route(waypoints);

          expect(route.getSelected()).toEqual([]);
      });

    });


    describe('getDeselected', function() {

      it('should return a list of waypoints which are not selected', function() {
        var waypoints = [
          new MockWaypoint({ selected: true }),   // 0
          new MockWaypoint({ selected: false }),  // 1
          new MockWaypoint({ selected: true }),   // 2
          new MockWaypoint({ selected: false }),  // 3
          new MockWaypoint({ selected: false })    // 4
        ];
        var route = new Route(waypoints);

        expect(route.getDeselected()).toEqual([
          waypoints[1], waypoints[3], waypoints[4]
        ]);
      });

      it('should return an empty array if all waypoints are selected', function() {
        var waypoints = [
          new MockWaypoint({ selected: true }),
          new MockWaypoint({ selected: true }),
          new MockWaypoint({ selected: true }),
          new MockWaypoint({ selected: true }),
          new MockWaypoint({ selected: true })
        ];
        var route = new Route(waypoints);

        expect(route.getDeselected()).toEqual([]);
      });

    });


    describe('selected waypoints', function() {

      it('should select all waypoints', function() {
        var waypoints = [
          new MockWaypoint(),
          new MockWaypoint(),
          new MockWaypoint()
        ];
        var route = new Route(waypoints);

        // Spy on 'select' method
        _.each(waypoints, function(wp, i) {
          wp.select = jasmine.createSpy('select_' + i);
        });

        route.selectAll();

        _.each(waypoints, function(wp) {
          expect(wp.select).toHaveBeenCalled();
        });
      });

      it('should deselect all waypoints', function() {
        var waypoints = [
          new MockWaypoint(),
          new MockWaypoint(),
          new MockWaypoint()
        ];
        var route = new Route(waypoints);

        // Spy on 'select' method
        _.each(waypoints, function(wp, i) {
          wp.deselect = jasmine.createSpy('select_' + i);
        });

        route.deselectAll();

        _.each(waypoints, function(wp) {
          expect(wp.deselect).toHaveBeenCalled();
        });
      });
    });


    describe('deselectAllExcept', function() {

      var SelectedWaypoint = function() {
        MockWaypoint.call(this, { selected: true });
      };
      _.inherits(SelectedWaypoint, MockWaypoint);

      var DeselectedWaypoint = function() {
        MockWaypoint.call(this, { selected: false });
      };
      _.inherits(DeselectedWaypoint, MockWaypoint);

      it('should select all waypoints except the specified waypoint', function() {
        var waypoints = [new SelectedWaypoint(), new SelectedWaypoint(), new SelectedWaypoint()];
        var route = new Route(waypoints);

        route.deselectAllExcept(waypoints[1]);

        expect(waypoints[0].get('selected')).toEqual(false);
        expect(waypoints[1].get('selected')).toEqual(true);
        expect(waypoints[2].get('selected')).toEqual(false);
      });

      it('should not select or deselect the specified waypoint', function() {
        var waypoints = [new DeselectedWaypoint(), new DeselectedWaypoint(), new DeselectedWaypoint()];
        var route = new Route(waypoints);

        route.deselectAllExcept(waypoints[1]);

        expect(waypoints[1].get('selected')).toEqual(false);
        expect(waypoints[1].select).not.toHaveBeenCalled();
        expect(waypoints[1].deselect).not.toHaveBeenCalled();
      });

      it('should do nothing if it is the only waypoint in the route', function() {
        var waypoint = new MockWaypoint();
        var route = new Route([waypoint]);

        route.deselectAllExcept(waypoint);

        expect(waypoint.select).not.toHaveBeenCalled();
        expect(waypoint.deselect).not.toHaveBeenCalled();
      });

      it('should not trigger a deselect method on the specified waypoint', function() {
        var waypoints = [new SelectedWaypoint(), new SelectedWaypoint(), new SelectedWaypoint()];
        var route = new Route(waypoints);
        var onDeselect = jasmine.createSpy('onDeselect');
        waypoints[1].on('deselect', onDeselect);

        route.deselectAllExcept(waypoints[1]);

        expect(onDeselect).not.toHaveBeenCalled();
      });

      it('should throw an error if the specified waypoint isn\'t in the route', function() {
        var route = new Route();

        expect(function() {
          route.deselectAllExcept(new MockWaypoint());
        }).toThrowType('WaypointNotInRouteError');
      });

    });


    describe('getLastWaypoint', function() {

      it('should return the last waypoint in the route', function() {
        var route = new Route();
        var COUNT = 3;
        var waypoints = getStubbedWaypointCollection(3, COUNT);
        var LAST_STUBBED_WAYPOINT = waypoints[COUNT - 1];
        route.add(waypoints);

        expect(route.getLastWaypoint()).toEqual(LAST_STUBBED_WAYPOINT);
      });

    });


    describe('recalculateAndUpdateDistance', function() {

      it('should recalculate total route distance', function() {
        var WAYPOINT_COUNT = 7, WAYPOINT_DISTANCE = 12345.67;
        var WAYPOINT_TOTAL_DISTANCE = WAYPOINT_COUNT * WAYPOINT_DISTANCE;

        var waypoints = getStubbedWaypointCollection(WAYPOINT_COUNT, { distance: WAYPOINT_DISTANCE });
        var route = new Route(waypoints);

        route.recalculateAndUpdateDistance();
        expect(route.distance).toEqual(WAYPOINT_TOTAL_DISTANCE);
      });

    });


    describe('distanceTo', function() {
      it('should return the distance to a given waypoint', function() {
        var waypoints = [
          new MockWaypoint({ distance: 0 }),    // 0
          new MockWaypoint({ distance: 100 }),  // 1
          new MockWaypoint({ distance: 50 }),   // 2
          new MockWaypoint({ distance: 25 })    // 3
        ];
        var route = new Route(waypoints);

        expect(route.distanceTo(waypoints[0])).toEqual(0);
        expect(route.distanceTo(waypoints[1])).toEqual(100);
        expect(route.distanceTo(waypoints[2])).toEqual(150);
        expect(route.distanceTo(waypoints[3])).toEqual(175);
      });

      it('should complain if the waypoint doesn\'t exist', function() {
        var waypoints = [
          new MockWaypoint({ distance: 0 }),    // 0
          new MockWaypoint({ distance: 100 }),  // 1
          new MockWaypoint({ distance: 50 }),   // 2
          new MockWaypoint({ distance: 25 })    // 3
        ];
        var route = new Route(waypoints);

        expect(function() {
          route.distanceTo(new MockWaypoint({ distance: 999 }));
        }).toThrowType('WaypointNotInRouteError');
      });
    });


    describe('updating paths (event bindings)', function() {
      var route;
      var firstWaypoint, middleWaypoint, lastWaypoint;
      var STUB_MOVED_POSITION = [12.34, 56.78];
      var STUB_PATH = [
        [12, 34], [56, 78], [90, 12]
      ];

      beforeEach(function() {
        firstWaypoint = new MockWaypoint();
        middleWaypoint = new MockWaypoint();
        lastWaypoint = new MockWaypoint();

        route = new Route();

        route.prepareWithWaypoints = function(waypoints) {
          route.add(waypoints, { silent: true });
        };


        spyOn(route, 'updatePathBetween');
      });


      describe('when a waypoint at the start of the route', function() {

        describe('is added', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([middleWaypoint, lastWaypoint]);
            route.add(firstWaypoint, { at: 0 });
          });


          it('should update the path between the added waypoint and the second waypoint in the route', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(firstWaypoint, middleWaypoint);
          });

        });

        describe('is moved', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, middleWaypoint, lastWaypoint]);
            firstWaypoint.set('position', STUB_MOVED_POSITION);
          });


          it('should update the path between the added waypoint and the second waypoint in the route', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(firstWaypoint, middleWaypoint);
          });

        });

        describe('is removed', function() {
          var newFirstWaypoint;

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, middleWaypoint, lastWaypoint]);
            route.remove(firstWaypoint);

            newFirstWaypoint = route.first();
          });

          it('should set an empty path on the (new) first waypoint', function() {
            expect(newFirstWaypoint.get('path')).toEqual([]);
          });

          it('should set a distance of zero on the (new) first waypoint', function() {
            expect(newFirstWaypoint.get('distance')).toEqual(0);
          });

        });
      });


      describe('when a waypoint at the middle of the route', function() {

        describe('is added', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, lastWaypoint]);
            route.add(middleWaypoint, { at: 1 });
          });

          it('should update the path to the previous waypoint', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(firstWaypoint, middleWaypoint);
          });

          it('should update the path to the next waypoint', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(middleWaypoint, lastWaypoint);
          });

        });

        describe('is moved', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, middleWaypoint, lastWaypoint]);
            middleWaypoint.set('position', STUB_MOVED_POSITION);
          });

          it('should update the path to the previous waypoint', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(firstWaypoint, middleWaypoint);
          });

          it('should update the path to the next waypoint', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(middleWaypoint, lastWaypoint);
          });


        });

        describe('is removed', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, middleWaypoint, lastWaypoint]);
            route.remove(middleWaypoint);
          });


          it('should update the path between the surrounding waypoints', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(firstWaypoint, lastWaypoint);
          });

        });
      });


      describe('when a waypoint at the end of the route', function() {

        describe('is added', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, middleWaypoint]);
            route.add(lastWaypoint);
          });

          it('should update the path to the previous waypoint', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(middleWaypoint, lastWaypoint);
          });

        });

        describe('is moved', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, middleWaypoint, lastWaypoint]);
            lastWaypoint.set('position', STUB_MOVED_POSITION);
          });

          it('should update the path to the previous waypoint', function() {
            expect(route.updatePathBetween).toHaveBeenCalledWith(middleWaypoint, lastWaypoint);
          });

        });

        describe('is removed', function() {
          var newLastWaypont;

          beforeEach(function() {
            route.prepareWithWaypoints([firstWaypoint, middleWaypoint, lastWaypoint]);
            route.remove(lastWaypoint);

            newLastWaypont = route.last();
          });

          it('should not update any paths', function() {
            expect(route.updatePathBetween).not.toHaveBeenCalled();
          });

        });

      });


      describe('when the only waypoint in a route', function() {
        var onlyWaypoint;

        beforeEach(function() {
          onlyWaypoint = new MockWaypoint();
        });

        describe('is added', function() {

          beforeEach(function() {
            route.add(onlyWaypoint);
          });

          it('should not update any paths', function() {
            expect(route.updatePathBetween).not.toHaveBeenCalled();
          });

        });

        describe('is moved', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([onlyWaypoint]);
            onlyWaypoint.set('position', STUB_MOVED_POSITION);
          });

          it('should not update any paths', function() {
            expect(route.updatePathBetween).not.toHaveBeenCalled();
          });

        });

        describe('is removed', function() {

          beforeEach(function() {
            route.prepareWithWaypoints([onlyWaypoint]);
            route.remove(onlyWaypoint);
          });

          it('should not update any paths', function() {
            expect(route.updatePathBetween).not.toHaveBeenCalled();
          });

        });

      });


      describe('when a waypoint\'s path changes', function() {

        it('should set the previous waypoint\'s position to the first point in the changed waypoint\'s path', function() {
          route.prepareWithWaypoints([firstWaypoint, lastWaypoint]);

          lastWaypoint.set('path', STUB_PATH);

          expect(firstWaypoint.get('position')).toEqual(STUB_PATH[0]);
        });

        it('should do nothing if there is no previous waypoint', function() {
          route.prepareWithWaypoints([firstWaypoint, lastWaypoint]);

          // Just don't throw any errors, please
          firstWaypoint.set('path', STUB_PATH);
        });

      });

      describe('when the route is reset', function() {

        var MockWaypointWithPath = function(opt_path) {
          var path = opt_path || ['STUB', 'PATH'];

          return new MockWaypoint({
            path: path
          });
        };

        var MockWaypointWithoutPath = function(opt_attrs) {
          var attrs = _.defaults(opt_attrs || {}, {
            path: []
          });
          return new MockWaypoint(attrs);
        };

        beforeEach(function() {
          firstWaypoint = new MockWaypointWithoutPath({
            id: 'FIRST'
          });
          middleWaypoint = new MockWaypointWithoutPath({
            id: 'MIDDLE'
          });
          lastWaypoint = new MockWaypointWithoutPath({
            id: 'LAST'
          });
        });


        it('should set any missing waypoint paths', function() {
          route.reset([
            firstWaypoint,
            middleWaypoint,
            lastWaypoint
          ]);

          expect(route.updatePathBetween).toHaveBeenCalledWith(firstWaypoint, middleWaypoint);
          expect(route.updatePathBetween).toHaveBeenCalledWith(middleWaypoint, lastWaypoint);
        });

        it('should not overwrite any existing waypoint paths', function() {
          var middleWaypointWithPath = new MockWaypointWithPath();
          middleWaypointWithPath.id = 'MIDDLE_WITH_PATH';

          route.reset([
            firstWaypoint,
            middleWaypointWithPath,
            lastWaypoint
          ]);

          expect(route.updatePathBetween).not.toHaveBeenCalledWith(firstWaypoint, middleWaypointWithPath);
          expect(route.updatePathBetween).toHaveBeenCalledWith(middleWaypointWithPath, lastWaypoint);
        });

        it('should do nothing if no waypoints are added', function() {
          route.reset();
        });

      });
    });


    describe('updatePathBetween', function() {
      var route, originWaypoint, destinationWaypoint;
      var ORIGIN_LATLON, DESTINATION_LATLON;

      beforeEach(function() {
        ORIGIN_LATLON = [12, 34];
        DESTINATION_LATLON = [98, 76];
        originWaypoint = new MockWaypoint({ position: ORIGIN_LATLON });
        destinationWaypoint = new MockWaypoint({ position: DESTINATION_LATLON });

        route = new Route();
      });


      it('should set the destination to start it\'s path at the origin\'s position', function() {
        route.updatePathBetween(originWaypoint, destinationWaypoint);

        expect(destinationWaypoint.setPathStartsAt).toHaveBeenCalledWith(ORIGIN_LATLON);
      });

      it('should not modify the origin waypoint', function() {
        route.updatePathBetween(originWaypoint, destinationWaypoint);

        expect(originWaypoint.setPathStartsAt).not.toHaveBeenCalled();
      });

    });


    describe('should import/export to JSON', function() {

      describe('should export an array of waypoints', function() {

        it('as a JSON string, using export', function() {
          var route = new Route();

          spyOn(JSON, 'stringify');

          route.export();

          expect(JSON.stringify).toHaveBeenCalledWith(route);
        });
      });

      describe('should import', function() {
        it('a JSON string', function() {
          var route = new Route();
          var waypoints = getStubbedWaypointCollection();
          var jsonString = 'some valid json string';
          var options = { some: 'reset options'};

          spyOn(JSON, 'parse').andReturn(waypoints);
          spyOn(route, 'reset');

          route.import(jsonString, options);

          expect(JSON.parse).toHaveBeenCalledWith(jsonString);
          expect(route.reset).toHaveBeenCalledWith(waypoints, options);
        });

        it('but reject poorly formed JSON input', function() {
          var route = new Route();

          spyOn(JSON, 'parse').andCallFake(function() {
            throw new window.SyntaxError('try harder next time.');
          });

          expect(function() {
            route.import('some json string');
          }).toThrowType('JSONParseError');
        });
      });
    });

  });
});
