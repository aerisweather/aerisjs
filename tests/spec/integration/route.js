define([
  'aeris',
  'packages/gmaps/routes'
], function(aeris) {
  describe('The Aeris Routes package for Google Maps', function() {
    var aerisMap, route, routeRenderer, routeBuilder;
    var $canvas = $('<div id="map-canvas"><div>');

    var mockPath = [
      new google.maps.LatLng(40, -90),
      new google.maps.LatLng(39, -89),
      new google.maps.LatLng(38, -88),
      new google.maps.LatLng(37, -87)
    ];
    var mockDirectionsResponse = {
      routes: [
        {
          overview_path: mockPath,
          legs: [{
            distance: { value: 1234 }
          }]
        }
      ]
    };

    /**
     *
     * @param {Array<number, number>} latLon
     * @param {google.maps.Map=} opt_map Defaults to aerisMap.map.
     * @return {google.maps.MouseEvent} Mock mouse event.
     */
    function triggerClick(latLon, opt_map) {
      var mouseEvent;

      map = opt_map || aerisMap.map;
      latLon = latLon || [90, -45];

      mouseEvent = {
        latLng: new google.maps.LatLng(latLon[0], latLon[1])
      };

      google.maps.event.trigger(map, 'click', mouseEvent);

      return mouseEvent;
    }

    beforeEach(function() {
      $canvas.appendTo('body');

      //sinon.mock(google.maps.Map.prototype);
      aerisMap = new aeris.maps.gmaps.Map('map-canvas', {
        center: [44.98, -93.2636],
        zoom: 15
      });

      route = new aeris.maps.gmaps.route.Route();
      routeRenderer = new aeris.maps.gmaps.route.RouteRenderer(aerisMap, {
        route: route
      });
      routeBuilder = new aeris.maps.gmaps.route.RouteBuilder(aerisMap, {
        route: route
      });


      waitsFor(function() {
        return aerisMap.initialized.state === 'resolved';
      });
    });

    afterEach(function() {
      $canvas.remove().empty();
      aerisMap = null;
      route = null;
      routeRenderer = null;
      routeBuilder = null;
    });




    describe('Map interactions', function() {
      it('should add waypoint icon on map click', function() {
        spyOn(google.maps.Marker.prototype, 'setMap');
        triggerClick();

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(aerisMap.map);
      });

      it('should add waypoint icon in the correct location', function() {
        //spyOn(google.maps, 'Marker').andCallThrough();
        var event;

        spyOn(google.maps.Marker.prototype, 'setPosition');
        event = triggerClick([90, -45]);

        expect(google.maps.Marker.prototype.setPosition).toHaveBeenCalledWith(event.latLng);
      });

      /* @todo
      it('should remove waypoint icon on waypoint click', function() {

      });

      it('should move waypoint icon on drag', function() {

      });

      it('should split path on path click', function() {

      });

      describe('Undo/Redo', function() {
        it('should undo adding a waypoint', function() {

        });

        it('should redo adding a waypoint', function() {

        });

        it('should undo removing a waypoint', function() {

        });

        it('should redo remove a waypoint', function() {

        });
      });
      */

    });



    /*
    it('should clear all waypoints', function() {

    });
    */

    describe('Directions', function() {
      it('should query directions between waypoints', function() {
        var endTestMsg = 'End of test. Should only query directions for >1 waypoint';
        var secondClick, thirdClick;

        // Throw error on constructor, to break script
        // --> and limit scope of test
        spyOn(google.maps.DirectionsService.prototype, 'route').andThrow(endTestMsg);

        triggerClick([89, -44]);
        secondClick = function() { triggerClick([90, -45]); };
        thirdClick = function() { triggerClick([88, -43]); };

        // Test: Script ended like we asked it to
        expect(secondClick).toThrow(endTestMsg);
        expect(thirdClick).toThrow(endTestMsg);

        // Test: Queried DirectionsService
        expect(google.maps.DirectionsService.prototype.route).toHaveBeenCalled();

        // Test: Only queried for last two clicks (not first one)
        expect(google.maps.DirectionsService.prototype.route.callCount).toEqual(2);
      });

      it('should draw paths between waypoint, based on returned directions', function() {

        spyOn(google.maps.DirectionsService.prototype, 'route').andCallFake(function(request, callback) {
          callback(mockDirectionsResponse, google.maps.DirectionsStatus.OK);
        });

        spyOn(google.maps.Polyline.prototype, 'setPath');

        // Click two waypoints
        triggerClick([40, -90]);
        triggerClick([39, -89]);

        // Test: draws a polyline with returned path
        expect(google.maps.Polyline.prototype.setPath.callCount).toEqual(1);
        expect(google.maps.Polyline.prototype.setPath.mostRecentCall.args[0]).toEqual(mockPath);
      });

      it('should get directions for different different travel modes', function() {
        var endTestMsg = 'end of test';
        var testCount = 0;
        spyOn(google.maps.DirectionsService.prototype, 'route').andThrow(endTestMsg);

        function testMode(mode) {
          routeBuilder.travelMode = mode;

          // Click two waypoints
          // --> breaks script, to limit test scope
          expect(function() {
            triggerClick([40, -90]);
            triggerClick([39, -89]);
          }).toThrow(endTestMsg);

          // Test: DirectionsService was called with correct transit mode
          expect(google.maps.DirectionsService.prototype.route).toHaveBeenCalled();
          expect(google.maps.DirectionsService.prototype.route.mostRecentCall.args[0].travelMode).
            toEqual(mode);

          testCount++;
        }

        testMode('BICYCLING');
        testMode('WALKING');
        testMode('DRIVING');
        testMode('TRANSIT');

        // Make sure all the tests ran
        expect(testCount).toEqual(4);
      });

      it('should draw direct paths between waypoints (not following directions)', function() {
        spyOn(google.maps.Polyline.prototype, 'setPath');
        spyOn(google.maps.DirectionsService.prototype, 'route').
          andThrow('should not call directions service for non-directions path');

        routeBuilder.followPaths = false;

        triggerClick([40, -90]);
        triggerClick([39, -89]);

        expect(google.maps.Polyline.prototype.setPath).toHaveBeenCalled();
        expect(google.maps.Polyline.prototype.setPath.mostRecentCall.args[0]).
          toEqual([
            new google.maps.LatLng(40, -90),
            new google.maps.LatLng(39, -89)
          ]);

        // Shouldn't call directions service
        expect(google.maps.DirectionsService.prototype.route).not.toHaveBeenCalled();
      });

      it('should calculate total distance', function() {
        triggerClick([40, -90]);
        triggerClick([39, -89]);
        triggerClick([38, -88]);

        // Wait for directions service
        // ... would be nice to expose this promise.... @todo
        var flag = false;
        waitsFor(function() {
          window.setInterval(function() {
            flag = true;
          }, 800);
          return flag;
        }, 'Directions service timeout.', 820);

        runs(function() {
          var precision = 10000;
          expect(route.distance).toBeLessThan(530594 + precision);
          expect(route.distance).toBeGreaterThan(530593 - precision);
        });
      });
    });


    describe('Import/Export', function() {

      /*it('import a route', function() {
        var mapper = new aeris.maps.gmaps.routes.JSONRouteMapper();
        var jsonExport;

        // Create a route
        triggerClick([40, -90]);
        triggerClick([37, -89]);
        triggerClick([35, -88]);
        triggerClick([45, -73]);

        jsonExport = mapper.export(route);
        route.import(jsonImport);
      });*/
    });
  });
});
