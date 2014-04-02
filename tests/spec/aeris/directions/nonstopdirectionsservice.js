define([
  'aeris/util',
  'aeris/directions/nonstopdirectionsservice',
  'mocks/aeris/directions/promises/promisetofetchdirections'
], function(_, NonstopDirectionsService, MockPromiseToFetchDirections) {
  var MockDistanceCalculator = function() {};



  describe('A NonstopDirectionsService', function() {
    var directionsService;
    var STUB_ORIGIN, STUB_DESTINATION, STUB_CALCULATED_DISTANCE;

    beforeEach(function() {
      STUB_ORIGIN = [12, 34];
      STUB_DESTINATION = [56, 78];
      STUB_CALCULATED_DISTANCE = 1234.56;

      MockDistanceCalculator.getDistanceBetween = jasmine.createSpy('getDistanceBetween').
        andReturn(STUB_CALCULATED_DISTANCE);

      directionsService = new NonstopDirectionsService({
        distanceCalculator: MockDistanceCalculator,
        PromiseToFetchDirections: MockPromiseToFetchDirections
      });
    });


    describe('fetchPath', function() {

      it('should resolve with a direct path', function() {
        var promise = directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION);
        var directPath = [STUB_ORIGIN, STUB_DESTINATION];

        promise.shouldResolveWithPath(directPath);
      });

      it('should get a distance from the distanceCalculator using the origin and destination points', function() {
        directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION);

        expect(MockDistanceCalculator.getDistanceBetween).
          toHaveBeenCalledWith(STUB_ORIGIN, STUB_DESTINATION);
      });

      it('should resolve with a distance from the distanceCalculator', function() {
        var promise = directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION);

        promise.shouldResolveWithDistance(STUB_CALCULATED_DISTANCE);
      });


      describe('if the calculator throws an error', function() {
        var STUB_ERROR;

        beforeEach(function() {
          STUB_ERROR = new Error();

          MockDistanceCalculator.getDistanceBetween.andCallFake(function() {
            throw STUB_ERROR;
          });
        });


        it('should reject using the thrown error', function() {
          var promise = directionsService.fetchPath(STUB_ORIGIN, STUB_DESTINATION);

          promise.shouldRejectWithError(STUB_ERROR);
        });

      });

    });

  });

});
