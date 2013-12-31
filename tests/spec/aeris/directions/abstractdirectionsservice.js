define([
  'jasmine',
  'sinon',
  'directions/abstractdirectionsservice',
  'aeris/util',
  'strategy/route/waypoint'
], function(jasmine, sinon, AbstractDirectionsService, _, Waypoint) {

  var StubbedWaypoint = function() {
    return sinon.createStubInstance(Waypoint);
  };

  var StubbedDirectionsService = function() {
    AbstractDirectionsService.apply(this, arguments);
  };
  _.inherits(StubbedDirectionsService, AbstractDirectionsService);

  StubbedDirectionsService.prototype.fetchDirectionsPath_ = jasmine.createSpy('fetchDirectionsPath_');
  StubbedDirectionsService.prototype.fetchDirectPath_ = jasmine.createSpy('fetchDirectPath_');
  StubbedDirectionsService.prototype.getSupportedTravelModes = jasmine.createSpy('getSupportedTravelModes');
  StubbedDirectionsService.prototype.supportsTravelMode = jasmine.createSpy('supportsTravelMode').andReturn(true);

  describe('An AbstractDirectionsService', function() {
    it('should fetch directions', function() {
      var service = new StubbedDirectionsService();
      var origin = new StubbedWaypoint();
      var destination = new StubbedWaypoint();
      var options = {
        followDirections: true,
        travelMode: 'JETSKI'
      };

      service.fetchPath(origin, destination, options);

      expect(service.fetchDirectionsPath_).toHaveBeenCalledWith(origin, destination, options);
    });

    it('should fetch a direct path', function() {
      var service = new StubbedDirectionsService();
      var origin = new StubbedWaypoint();
      var destination = new StubbedWaypoint();
      var options = {
        followDirections: false,
        travelMode: 'JETSKI'
      };

      service.fetchPath(origin, destination, options);

      expect(service.fetchDirectPath_).toHaveBeenCalledWith(origin, destination, options);
    });

    it('should require a supported travel mode, if following directions', function() {
      var service = new StubbedDirectionsService();
      var origin = new StubbedWaypoint();
      var destination = new StubbedWaypoint();
      var options = {
        followDirections: true,
        travelMode: 'JETSKI'
      };

      service.supportsTravelMode.andReturn(false);

      expect(function() {
        service.fetchPath(origin, destination, options);
      }).toThrowType('InvalidArgumentError');
    });
  });
});
