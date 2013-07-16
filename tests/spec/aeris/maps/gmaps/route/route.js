define(['jasmine', 'gmaps/route/route', 'underscore'], function(jasmine, Route, _) {
  describe('A Route', function() {

    function getMockWaypoint(opt_options) {
      opt_options || (opt_options = {});
      return {
        distance: opt_options.distance || 0,
        previous: opt_options.previous || null,
        toJSON: function() {}
      }
    }

    it('should construct with no waypoints or distance', function() {
      var route = new Route();
      expect(route.distance).toEqual(0);
      expect(route.getWaypoints()).toEqual([]);
    });

    it('should add a waypoint', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      route.addWaypoint(wpMock);

      expect(route.getWaypoints().length).toEqual(1);
      expect(route.distance).toEqual(7);
    });

    it('should trigger a \'addWaypoint\' event', function() {
      var route = new Route();
      var triggered = false;

      route.on('addWaypoint', function() {
        triggered = true;
      });
      route.addWaypoint(getMockWaypoint());

      expect(triggered).toBe(true);
    });

    it('should add multiple waypoints, and calculate total route distance', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      route.addWaypoint(wpMock);
      route.addWaypoint(wpMock2);
      expect(route.getWaypoints().length).toEqual(2);
      expect(route.distance).toEqual(18);
    });

    it('should tell each waypoint about the previous waypoint in the route', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      route.addWaypoint(wpMock);
      expect(wpMock.previous).toBeNull();
      route.addWaypoint(wpMock2);
      expect(wpMock2.previous.distance).toEqual(7);
    });

    it('should return the last waypoint in the route', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      expect(route.getLastWaypoint()).toBeNull();

      route.addWaypoint(wpMock);
      expect(route.getLastWaypoint().distance).toEqual(7);

      route.addWaypoint(wpMock2);
      expect(route.getLastWaypoint().distance).toEqual(11);
    });

    it('should serialize as a JSON object', function() {
      var route = new Route();
      var wpMock = getMockWaypoint({
        distance: 7
      });
      var wpMock2 = getMockWaypoint({
        distance: 11
      });

      spyOn(wpMock, 'toJSON').andReturn({ 'some': 'jsonObject' });
      spyOn(wpMock2, 'toJSON').andReturn({ 'another': 'jsonObject' });

      route.addWaypoint(wpMock);
      route.addWaypoint(wpMock2);

      expect(_.isEqual(route.toJSON(), {
        distance: 18,
        waypoints: [
          { 'some': 'jsonObject' },
          { 'another': 'jsonObject' }
        ]
      })).toEqual(true);
    });

    it('should parse a JSON string into a route object', function() {
      // Taken from an example export
      var jsonStr = '{"distance":2452,"waypoints":[{"originalLatLon":[44.978278126139514,-93.26341152191162],"geocodedLatLon":[44.978350000000006,-93.26335],"followPaths":true,"travelMode":"WALKING","path":null,"previous":null,"distance":0},{"originalLatLon":[44.972752843480855,-93.27199459075928],"geocodedLatLon":[44.97276,-93.272],"followPaths":true,"travelMode":"WALKING","path":[[44.978350000000006,-93.26335],[44.979310000000005,-93.26556000000001],[44.979350000000004,-93.26569],[44.97887,-93.26608],[44.979110000000006,-93.26667],[44.978060000000006,-93.26758000000001],[44.97672,-93.26873],[44.97574,-93.26950000000001],[44.97478,-93.27031000000001],[44.97415,-93.27086000000001],[44.97316000000001,-93.27170000000001],[44.97276,-93.272]],"previous":{"originalLatLon":[44.978278126139514,-93.26341152191162],"geocodedLatLon":[44.978350000000006,-93.26335],"followPaths":true,"travelMode":"WALKING","path":null,"previous":null,"distance":0},"distance":1153},{"originalLatLon":[44.96953457638823,-93.2580041885376],"geocodedLatLon":[44.969550000000005,-93.25799],"followPaths":true,"travelMode":"WALKING","path":[[44.97276,-93.272],[44.97280000000001,-93.27197000000001],[44.97233000000001,-93.27082000000001],[44.9722,-93.27051],[44.97167,-93.26922],[44.971630000000005,-93.26905000000001],[44.97110000000001,-93.26789000000001],[44.97052,-93.26655000000001],[44.969910000000006,-93.2651],[44.9697,-93.26457],[44.969120000000004,-93.26321],[44.96904000000001,-93.26314],[44.968920000000004,-93.26310000000001],[44.968920000000004,-93.26273],[44.96891,-93.26264],[44.96887,-93.26255],[44.96886000000001,-93.26028000000001],[44.969100000000005,-93.25999],[44.96911,-93.25964],[44.969260000000006,-93.25964],[44.96925,-93.25906],[44.9692,-93.25901],[44.9692,-93.25898000000001],[44.969210000000004,-93.25889000000001],[44.96925,-93.25881000000001],[44.969300000000004,-93.25876000000001],[44.969350000000006,-93.25874],[44.96941,-93.25874],[44.969460000000005,-93.25877000000001],[44.96965,-93.25826],[44.969570000000004,-93.25804000000001],[44.969550000000005,-93.25799]],"previous":{"originalLatLon":[44.972752843480855,-93.27199459075928],"geocodedLatLon":[44.97276,-93.272],"followPaths":true,"travelMode":"WALKING","path":[[44.978350000000006,-93.26335],[44.979310000000005,-93.26556000000001],[44.979350000000004,-93.26569],[44.97887,-93.26608],[44.979110000000006,-93.26667],[44.978060000000006,-93.26758000000001],[44.97672,-93.26873],[44.97574,-93.26950000000001],[44.97478,-93.27031000000001],[44.97415,-93.27086000000001],[44.97316000000001,-93.27170000000001],[44.97276,-93.272]],"previous":{"originalLatLon":[44.978278126139514,-93.26341152191162],"geocodedLatLon":[44.978350000000006,-93.26335],"followPaths":true,"travelMode":"WALKING","path":null,"previous":null,"distance":0},"distance":1153},"distance":1299}]}';
      var route = new Route();
      var waypoints;

      var eventFlag = false;
      route.on('topic', function() {
        eventFlag = true;
      });

      route.importJSON(jsonStr);
      waypoints = route.getWaypoints();

      // Test: meta-data imported
      expect(route.distance).toEqual(2452);

      // Test: waypoints imported
      //      note: not testing parsing of Waypoints (belongs in Waypoint's spec)
      expect(waypoints.length).toEqual(3);
      expect(waypoints[0] instanceof Route).toEqual(true);

      // Make sure we didn't lose our subscribers.
      route.trigger('topic');
      expect(eventFlag).toEqual(true);
    });
  });
});
