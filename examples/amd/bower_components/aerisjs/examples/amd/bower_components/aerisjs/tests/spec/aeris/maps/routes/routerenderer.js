define([
  'aeris/util',
  'aeris/maps/routes/routerenderer',
  'mocks/mapobject',
  'aeris/collection'
], function(_, RouteRenderer, MockMapObject, Collection) {

  var MockWaypoint = function() {
    var stubbedMethods = [
      'isSelected',
      'stylePath',
      'getRoute'
    ];

    MockMapObject.apply(this, arguments);

    _.extend(this, jasmine.createSpyObj('mockWaypoint', stubbedMethods));
  };
  _.inherits(MockWaypoint, MockMapObject);


  MockWaypoint.prototype.triggerMockClickEvent = function(opt_atLatLon) {
    var stubbedLatLon = opt_atLatLon || [42, 65];

    this.trigger('click', stubbedLatLon, this);
  };


  MockWaypoint.prototype.triggerMockDragendEvent = function(opt_atLatLon) {
    var stubbedLatLon = opt_atLatLon || [42, 65];

    this.trigger('dragend', stubbedLatLon, this);
  };


  MockWaypoint.prototype.triggerMockPathClick = function(opt_atLatLon) {
    var stubbedLatLon = opt_atLatLon || [42, 65];

    this.trigger('path:click', stubbedLatLon, this);
  };

  MockWaypoint.prototype.triggerMockSelect = function() {
    this.trigger('select', this, {});
    this.trigger('change:selected', this, true, {});
  };

  MockWaypoint.prototype.triggerMockDeselect = function() {
    this.trigger('deselect', this, {});
    this.trigger('change:selected', this, false, {});
  };


  var MockRoute = function() {
    Collection.apply(this, arguments);
  };
  _.inherits(MockRoute, Collection);


  describe('A RouteRenderer', function() {

    describe('constructor', function() {

      it('should set a map', function() {
        spyOn(RouteRenderer.prototype, 'setMap');

        new RouteRenderer({
          map: { some: 'map' }
        });

        expect(RouteRenderer.prototype.setMap).toHaveBeenCalledWith({ some: 'map' });
      });

      it('should set map as null', function() {
        spyOn(RouteRenderer.prototype, 'setMap');

        new RouteRenderer({
          map: null
        });

        expect(RouteRenderer.prototype.setMap).toHaveBeenCalledWith(null);
      });

    });

    describe('Events', function() {
      var waypoint, renderer;

      beforeEach(function() {
        waypoint = new MockWaypoint();
        renderer = new RouteRenderer();

        renderer.renderWaypoint(waypoint);
      });

      describe('marker:click', function() {
        var onMarkerClick;

        beforeEach(function() {
          onMarkerClick = jasmine.createSpy('onMarkerClick');
          renderer.on('marker:click', onMarkerClick);
        });


        it('should proxy the waypoint \'click\' event', function() {
          waypoint.triggerMockClickEvent();
          expect(onMarkerClick).toHaveBeenCalled();
        });

        it('should provide a latLon, and the clicked waypoint', function() {
          var latLonStub = [12, 34];
          waypoint.triggerMockClickEvent(latLonStub);
          expect(onMarkerClick).toHaveBeenCalledWith(latLonStub, waypoint);
        });

        it('should not be triggered after a waypoint is erased', function() {
          renderer.eraseWaypoint(waypoint);

          waypoint.triggerMockClickEvent();
          expect(onMarkerClick).not.toHaveBeenCalled();
        });

      });

      describe('marker:dragend', function() {
        var onMarkerDragend;

        beforeEach(function() {
          onMarkerDragend = jasmine.createSpy('onMarkerDragend');
          renderer.on('marker:dragend', onMarkerDragend);
        });

        it('should proxy the waypoint\'s \'dragend\' event', function() {
          waypoint.triggerMockDragendEvent();
          expect(onMarkerDragend).toHaveBeenCalled();
        });

        it('should provide a latLon, and the proxied waypoint', function() {
          var stubbedLatLon = [73, 92];

          waypoint.triggerMockDragendEvent(stubbedLatLon);
          expect(onMarkerDragend).toHaveBeenCalledWith(stubbedLatLon, waypoint);
        });

        it('should not be triggered after a waypoint is erased', function() {
          renderer.eraseWaypoint(waypoint);

          waypoint.triggerMockDragendEvent();
          expect(onMarkerDragend).not.toHaveBeenCalled();
        });

      });

      describe('path:click', function() {
        var onPathClick;

        beforeEach(function() {
          onPathClick = jasmine.createSpy('onPathClick');
          renderer.on('path:click', onPathClick);
        });

        it('should proxy the waypoint \'path:click\' event', function() {
          waypoint.triggerMockPathClick();
          expect(onPathClick).toHaveBeenCalled();
        });

        it('should provide a latLon, and the proxied waypoint', function() {
          var stubbedLatLon = [93, 77];

          waypoint.triggerMockPathClick(stubbedLatLon);
          expect(onPathClick).toHaveBeenCalledWith(stubbedLatLon, waypoint);
        });

        it('should not be triggered after a waypoint is erased', function() {
          renderer.eraseWaypoint(waypoint);

          waypoint.triggerMockPathClick();
          expect(onPathClick).not.toHaveBeenCalled();
        });

      });

      it('should not trigger redundant events if a waypoint is rendered multiple times', function() {
        var onMarkerClick = jasmine.createSpy('onWaypointClick');
        renderer.on('marker:click', onMarkerClick);

        renderer.renderWaypoint(waypoint);
        renderer.renderWaypoint(waypoint);
        renderer.renderWaypoint(waypoint);

        waypoint.triggerMockClickEvent();
        expect(onMarkerClick.callCount).toEqual(1);
      });

    });


    describe('setStyles', function() {
      var renderer;
      var waypoints;

      beforeEach(function() {
        renderer = new RouteRenderer();
        waypoints = [
          new MockWaypoint(), new MockWaypoint(), new MockWaypoint()
        ];
        _.each(waypoints, renderer.renderWaypoint, renderer);
      });


      it('should update the styles of rendered waypoints', function() {
        renderer.setStyles({
          waypoint: {
            url: 'newUrl.png'
          }
        });

        _.each(waypoints, function(wp) {
          expect(wp.get('url')).toEqual('newUrl.png');
        });
      });

      it('should not affect previously set styles', function() {
        renderer.setStyles({
          waypoint: {
            url: 'newUrl.png'
          }
        });

        renderer.setStyles({
          path: {
            strokeColor: 'blue'
          }
        });

        _.each(waypoints, function(wp) {
          expect(wp.get('url')).toEqual('newUrl.png');
        });
      });

    });


    describe('setMap', function() {
      var mapStub, renderer;

      beforeEach(function() {
        renderer = new RouteRenderer();
        mapStub = { some: 'map' };
      });

      it('should set all rendered waypoints to a map', function() {
        var waypoints = [
          new MockWaypoint(), new MockWaypoint(), new MockWaypoint()
        ];

        _.each(waypoints, function(wp) {
          renderer.renderWaypoint(wp);
        });

        renderer.setMap(mapStub);

        _.each(waypoints, function(renderedWaypoint) {
          expect(renderedWaypoint.setMap).toHaveBeenCalledWith(mapStub);
        });
      });

      it('should cause all newly rendered waypoint to be set to a map', function() {
        var waypoint = new MockWaypoint();

        renderer.setMap(mapStub);

        renderer.renderWaypoint(waypoint);

        expect(waypoint.setMap).toHaveBeenCalledWith(mapStub);
      });

    });


    describe('renderRoute', function() {
      var route, renderer;

      beforeEach(function() {
        renderer = new RouteRenderer();
        route = new MockRoute();

        spyOn(renderer, 'renderWaypoint');
      });


      it('should render all waypoints in the route', function() {
        var waypoints = [
          new MockWaypoint(), new MockWaypoint(), new MockWaypoint()
        ];
        route.add(waypoints);

        renderer.renderRoute(route);

        _.each(waypoints, function(wp) {
          expect(renderer.renderWaypoint).toHaveBeenCalledWith(wp);
        });
      });

      it('should do nothing if the route has no waypoints', function() {
        route.reset([]);

        // Should not throw error
        renderer.renderRoute(route);

        expect(renderer.renderWaypoint).not.toHaveBeenCalled();
      });

    });


    describe('renderWaypoint', function() {
      var renderer, waypoint;

      beforeEach(function() {
        renderer = new RouteRenderer();
        waypoint = new MockWaypoint();
      });


      it('should accept waypoints without defined routes', function() {
        waypoint.getRoute.andReturn(undefined);

        // Should not throw error
        renderer.renderWaypoint(waypoint);
      });

      it('should set the waypoint to the renderer\'s map', function() {
        var mapStub = { some: 'map' };

        renderer.setMap(mapStub);
        renderer.renderWaypoint(waypoint);

        expect(waypoint.setMap).toHaveBeenCalledWith(mapStub);
      });


      describe('setStyles integration (waypoint)', function() {

        it('should set styles on a deselected waypoint', function() {
          renderer.setStyles({
            waypoint: {
              url: 'icon.png',
              clickable: false,
              draggable: true,
              offsetX: 15,
              offsetY: 20
            }
          });

          waypoint.isSelected.andReturn(false);
          renderer.renderWaypoint(waypoint);

          expect(waypoint.get('url')).toEqual('icon.png');
          expect(waypoint.get('clickable')).toEqual(false);
          expect(waypoint.get('draggable')).toEqual(true);
          expect(waypoint.get('offsetX')).toEqual(15);
          expect(waypoint.get('offsetY')).toEqual(20);
        });

        it('should set styles on a selected waypoint', function() {
          renderer.setStyles({
            selectedWaypoint: {
              url: 'blueIcon.png',
              clickable: true,
              draggable: false,
              offsetX: 15,
              offsetY: 20
            }
          });

          waypoint.isSelected.andReturn(true);
          renderer.renderWaypoint(waypoint);

          expect(waypoint.get('selectedUrl')).toEqual('blueIcon.png');
          expect(waypoint.get('clickable')).toEqual(true);
          expect(waypoint.get('draggable')).toEqual(false);
          expect(waypoint.get('selectedOffsetX')).toEqual(15);
          expect(waypoint.get('selectedOffsetY')).toEqual(20);
        });

        it('should change a waypoint\'s style when it is selected / deselected', function() {
          renderer.setStyles({
            waypoint: {
              url: 'icon.png',
              clickable: false,
              draggable: true
            },
            selectedWaypoint: {
              url: 'blueIcon.png',
              clickable: true,
              draggable: false
            }
          });

          // Render in deselected state
          waypoint.isSelected.andReturn(false);
          renderer.renderWaypoint(waypoint);


          // Change to selected state
          waypoint.triggerMockSelect();
          waypoint.isSelected.andReturn(true);

          // Should change attrs to selectedWaypoint options
          expect(waypoint.get('url')).toEqual('icon.png');
          expect(waypoint.get('clickable')).toEqual(false);
          expect(waypoint.get('draggable')).toEqual(true);


          // Change to deselected state
          waypoint.triggerMockDeselect();
          waypoint.isSelected.andReturn();

          // Should change attrs to waypoint options
          expect(waypoint.get('selectedUrl')).toEqual('blueIcon.png');
          expect(waypoint.get('clickable')).toEqual(true);
          expect(waypoint.get('draggable')).toEqual(false);
        });


        describe('Waypoint style ctor options', function() {
          var WAYPOINT_STYLE_ATTRS = [
            'url', 'clickable', 'draggable'
          ];

          it('should define defaults for all waypoint styles', function() {
            waypoint.isSelected.andReturn(false);
            renderer.renderWaypoint(waypoint);

            _.each(WAYPOINT_STYLE_ATTRS, function(attrName) {
              expect(waypoint.get(attrName)).toBeDefined();
            });
          });

          it('should define defaults for all selectedWaypoint styles', function() {
            waypoint.isSelected.andReturn(true);
            renderer.renderWaypoint(waypoint);

            _.each(WAYPOINT_STYLE_ATTRS, function(attrName) {
              expect(waypoint.get(attrName)).toBeDefined();
            });
          });

        });

      });


      describe('setStylesIntegration (path)', function() {

        it('should set styles on a path which follows directions', function() {
          renderer.setStyles({
            path: {
              strokeColor: 'green',
              strokeWeight: 117,
              strokeOpacity: 0.01
            }
          });
          waypoint.set('followDirections', true);

          renderer.renderWaypoint(waypoint);

          expect(waypoint.stylePath).toHaveBeenCalledWith({
            strokeColor: 'green',
            strokeWeight: 117,
            strokeOpacity: 0.01
          });
        });

        it('should set styles on a path does not follow directions', function() {
          renderer.setStyles({
            offPath: {
              strokeColor: 'blue',
              strokeWeight: 2,
              strokeOpacity: 0.95
            }
          });
          waypoint.set('followDirections', false);

          renderer.renderWaypoint(waypoint);

          expect(waypoint.stylePath).toHaveBeenCalledWith({
            strokeColor: 'blue',
            strokeWeight: 2,
            strokeOpacity: 0.95
          });
        });

        it('should change the path styles when the waypoint changes its followDirections attribute', function() {
          var pathStyles = {
            strokeColor: 'green',
            strokeWeight: 100,
            strokeOpacity: 0.01
          };
          var offPathStyles = {
            strokeColor: 'red',
            strokeWeight: 5,
            strokeOpacity: 0.95
          };
          renderer.setStyles({
            path: pathStyles,
            offPath: offPathStyles
          });

          waypoint.set('followDirections', true);
          renderer.renderWaypoint(waypoint);
          expect(waypoint.stylePath).toHaveBeenCalledWith(pathStyles);

          waypoint.set('followDirections', false);
          expect(waypoint.stylePath).toHaveBeenCalledWith(offPathStyles);

          waypoint.set('followDirections', true);
          expect(waypoint.stylePath).toHaveBeenCalledWith(pathStyles);
        });


        describe('Path style ctor options', function() {
          var PATH_STYLE_ATTRS = [
            'strokeColor', 'strokeOpacity', 'strokeWeight'
          ];

          it('should define defaults for all path and offPath styles', function() {
            // Path styles
            waypoint.set('followDirections', true);
            renderer.renderWaypoint(waypoint);

            waypoint.stylePath.andCallFake(function(attrs) {
              _.each(PATH_STYLE_ATTRS, function(attrName) {
                expect(attrs[attrName]).toBeDefined();
              });
            });
            expect(waypoint.stylePath).toHaveBeenCalled();
            expect(waypoint.stylePath.callCount).toEqual(1);


            // OffPath styles
            waypoint.set('followDirections', false);
            renderer.renderWaypoint(waypoint);

            expect(waypoint.stylePath.callCount).toBeGreaterThan(1);
          });

        });

      });

    });


    describe('eraseRoute', function() {
      var renderer, route;

      beforeEach(function() {
        renderer = new RouteRenderer();
        route = new MockRoute();

        spyOn(renderer, 'eraseWaypoint');
      });



      it('should erase all waypoints in the route', function() {
        var waypoints = [
          new MockWaypoint(), new MockWaypoint(), new MockWaypoint()
        ];
        route.add(waypoints);

        renderer.eraseRoute(route);

        _.each(waypoints, function(wp) {
          expect(renderer.eraseWaypoint).toHaveBeenCalledWith(wp);
        });
      });

      it('should do nothing if the route has no waypoints', function() {
        route.reset([]);

        // Should not throw error
        renderer.eraseRoute(route);

        expect(renderer.eraseWaypoint).not.toHaveBeenCalled();
      });

    });


    describe('eraseWaypoint', function() {
      var renderer, waypoint;

      beforeEach(function() {
        renderer = new RouteRenderer({
          waypoint: {
            url: 'deselected.png'
          },
          selectedWaypoint: {
            url: 'selected.png'
          }
        });
        waypoint = new MockWaypoint();

        renderer.renderWaypoint(waypoint);
      });


      it('should remove the waypoint from the map', function() {
        renderer.eraseWaypoint(waypoint);

        expect(waypoint.setMap).toHaveBeenCalledWith(null);
      });

      it('should no longer bind the waypoint\'s map to the renderer\'s map', function() {
        var newMap = { foo: 'bar' };

        renderer.eraseWaypoint(waypoint);
        renderer.setMap(newMap);

        expect(waypoint.setMap).not.toHaveBeenCalledWith(newMap);
      });

      it('should no longer proxy waypoint events', function() {
        var onMarkerClick = jasmine.createSpy('onClick');
        renderer.on('marker:click', onMarkerClick);

        renderer.eraseWaypoint(waypoint);

        waypoint.triggerMockClickEvent();
        expect(onMarkerClick).not.toHaveBeenCalled();
      });

      it('should no longer bind styles to the waypoint state', function() {
        waypoint.isSelected.andReturn(false);

        renderer.renderWaypoint(waypoint);
        renderer.eraseWaypoint(waypoint);

        waypoint.triggerMockSelect();
        expect(waypoint.get('url')).toEqual('deselected.png');

        waypoint.triggerMockDeselect();
        expect(waypoint.get('url')).toEqual('deselected.png');

        waypoint.triggerMockSelect();
        expect(waypoint.get('url')).toEqual('deselected.png');
      });

    });


    describe('destroy', function() {
      var renderer;

      beforeEach(function() {
        renderer = new RouteRenderer();

        spyOn(renderer, 'eraseWaypoint');
      });


      it('should erase all rendered waypoints', function() {
        var waypoints = [
          new MockWaypoint(), new MockWaypoint(), new MockWaypoint()
        ];
        _.each(waypoints, function(wp) {
          renderer.renderWaypoint(wp);
        });

        renderer.destroy();

        _.each(waypoints, function(wp) {
          expect(renderer.eraseWaypoint).toHaveBeenCalledWith(wp);
        });
      });


      it('should do nothing, if no waypoints were rendered', function() {
        // Should not throw error
        renderer.destroy();

        expect(renderer.eraseWaypoint).not.toHaveBeenCalled();
      });

    });

  });
});
