require([
  'jasmine',
  'sinon',
  'gmaps/route/directions/abstractdirectionsservice',
  'gmaps/route/directions/googledirectionsservice',
  'gmaps/route/waypoint',
  'aeris/promise',
  'mocks/directionsresults',
  'mocks/directionsservice',
  'testUtils',
  'gmaps/utils'
], function(
  jasmine,
  sinon,
  AbstractDirectionsService,
  GoogleDirectionsService,
  Waypoint,
  Promise,
  StubbedDirectionsResults,
  StubbedDirectionsService,
  testUtils,
  mapUtils
) {
  var StubbedWaypoint = function() {
    var waypoint = sinon.createStubInstance(Waypoint);

    waypoint.latLon = testUtils.getRandomLatLon();
  };
  StubbedWaypoint.prototype.getPosition = function() {
    return this.latLon;
  };

  var StubbedServiceAPI = function() {
    return {
      route: jasmine.createSpy('route')
    };
  };

  describe('The GoogleDirectionsService', function() {
    describe('should fetch a path following directions', function() {
      it('and query the google directions service', function() {
        var service = new GoogleDirectionsService();
        var api = new StubbedServiceAPI();
        var origin = new StubbedWaypoint(), destination = new StubbedWaypoint();
        var options = {
          followDirections: true,
          travelMode: 'DRIVING'
        };

        spyOn(service, 'getServiceAPI').andReturn(api);

        api.route.andReturn(function(request) {
          expect(request.origin).toEqual(mapUtils.arrayToLatLng(origin.getPosition()));
          expect(request.destination).toEqual(mapUtils.arrayToLatLng(destination.getPosition()));
        });

        service.fetchPath(origin, destination, options);

        expect(api.route).toHaveBeenCalled();
      });

      it('and resolve a promise with path data', function() {
        var service = new GoogleDirectionsService();
        var origin = new StubbedWaypoint(), destination = new StubbedWaypoint();
        var options = {
          followDirections: true,
          travelMode: 'DRIVING'
        };
        var results = new StubbedDirectionsResults();
        var api = new StubbedDirectionsService({ results: results });

        // Inject directions service api
        spyOn(service, 'getServiceAPI').andReturn(api);

        // Spy on the returned promise
        spyOn(aeris.Promise.prototype, 'resolve');
        service.fetchPath(origin, destination, options);

        expect(aeris.Promise.prototype.resolve).toHaveBeenCalledWith({
          path: mapUtils.latLngToPath(results.routes[0].overview_path),
          distance: results.routes[0].legs[0].distance.value,
          status: {
            code: AbstractDirectionsService.Status.OK,
            apiCode: google.maps.DirectionsStatus.OK
          }
        });
      });

      it('and reject a promise with bad data', function() {
        var service = new GoogleDirectionsService();
        var origin = new StubbedWaypoint(), destination = new StubbedWaypoint();
        var options = {
          followDirections: true,
          travelMode: 'DRIVING'
        };
        var api = new StubbedDirectionsService({ success: false });

        // Inject directions service api
        spyOn(service, 'getServiceAPI').andReturn(api);

        // Spy on the returned promise
        spyOn(aeris.Promise.prototype, 'reject');
        service.fetchPath(origin, destination, options);

        expect(aeris.Promise.prototype.reject).toHaveBeenCalledWith({
          path: [],
          distance: -1,
          status: {
            code: AbstractDirectionsService.Status.API_ERROR,
            apiCode: google.maps.DirectionsStatus.UNKNOWN_ERROR
          }
        });
      });
    });

    describe('should fetch a direct path', function() {
      it('and calculate path distance', function() {
        var service = new GoogleDirectionsService();
        var origin = new StubbedWaypoint(), destination = new StubbedWaypoint();
        var options = {
          followDirections: false,
          travelMode: 'DRIVING'
        };

        spyOn(google.maps.geometry.spherical, 'computeDistanceBetween');

        service.fetchPath(origin, destination, options);

        expect(google.maps.geometry.spherical.computeDistanceBetween).
          toHaveBeenCalledWith(
            mapUtils.arrayToLatLng(origin.getPosition()),
            mapUtils.arrayToLatLng(destination.getPosition())
          );
      });

      it('and resolve a promise with path data', function() {
        var distance = 1234;
        var service = new GoogleDirectionsService();
        var origin = new StubbedWaypoint(), destination = new StubbedWaypoint();
        var options = {
          followDirections: false,
          travelMode: 'DRIVING'
        };

        spyOn(google.maps.geometry.spherical, 'computeDistanceBetween').andReturn(1234);

        // Spy on the returned promise
        spyOn(aeris.Promise.prototype, 'resolve');
        service.fetchPath(origin, destination, options);

        expect(Promise.prototype.resolve).toHaveBeenCalledWith({
          path: [
            origin.getPosition(),
            destination.getPosition()
          ],
          distance: distance,
          status: {
            code: AbstractDirectionsService.Status.OK
          }
        });
      });
    });
  });
});


