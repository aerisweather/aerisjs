define([
  'aeris/util'
], function(_) {
  /**
   * Mock the DirectionsService constructor
   * and provide a mocked instance.
   *
   * Provides configuration interface for
   * testing expected results, by spying on
   * the {google.maps.DirectionsService#route} method.
   *
   * @param {Object=} opt_options
   * @param {google.maps.DirectionsRequest=} opt_options.expectedRequest
   * @param {google.maps.DirectionsResult=} opt_options.results
   * @param {Boolean=} opt_options.success
   *        If false, route will response with an empty results object
   *        and an error code. Defaults to true.
   *
   * @return {google.maps.DirectionsService}
   */
  var MockDirectionsService = function(opt_options) {
    var directions = sinon.createStubInstance(google.maps.DirectionsService);

    // Inject mocked directions service
    spyOn(google.maps, 'DirectionsService').andReturn(directions);

    // Sub route method
    directions.route = jasmine.createSpy('route').
      andCallFake(function(req, callback) {
        var status = (_.isUndefined(opt_options.success) || opt_options.success) ?
          google.maps.DirectionsStatus.OK :
          google.maps.DirectionsStatus.UNKNOWN_ERROR;

        // Return mock results,
        // Or an empty object, if success === false.
        var results = (status === google.maps.DirectionsStatus.OK && opt_options.results) ?
          opt_options.results :
        {};

        if (opt_options.expectedRequest) {
          expect(req.origin).toEqual(opt_options.expectedRequest.origin);
          expect(req.destination).toEqual(opt_options.expectedRequest.destination);
        }

        callback(results, status);
      });

    return directions;
  };

  return MockDirectionsService;
});
