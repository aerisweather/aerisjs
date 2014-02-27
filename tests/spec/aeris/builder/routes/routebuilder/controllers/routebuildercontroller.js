define([
  'aeris/util',
  'aeris/builder/routes/routebuilder/controllers/routebuildercontroller',
  'aeris/events',
  'mocks/aeris/toggle',
  'mocks/aeris/maps/routes/routebuilder'
], function(_, RouteBuilderController, Events, MockRoutePoint, MockRouteBuilder) {


  describe('A RouteBuilderController', function() {
    var routeBuilderController, mockRouteBuilder, eventHub;

    beforeEach(function() {
      mockRouteBuilder = new MockRouteBuilder();
      eventHub = new Events();

      routeBuilderController = new RouteBuilderController({
        routeBuilder: mockRouteBuilder,
        eventHub: eventHub,
        RoutePoint: MockRoutePoint
      });
    });


    describe('Event hub events', function() {

      describe('routepoint:click', function() {
        var onRoutepointClick, mockRoutepoint, LAT_LON_STUB = 'LAT_LON_STUB';

        beforeEach(function() {
          mockRoutepoint = new MockRoutePoint();

          onRoutepointClick = jasmine.createSpy('onRoutepointClick');
          eventHub.on('routepoint:click', onRoutepointClick);
        });


        it('should emit when the routeBuilder emits a \'waypoint:click\' event ', function() {
          routeBuilderController.render();

          mockRouteBuilder.trigger('waypoint:click', LAT_LON_STUB, mockRoutepoint);

          expect(onRoutepointClick).toHaveBeenCalled();
        });

        it('should provide the latLon and routepoint params provided by the routeBuilder \'waypoint:click\' event', function() {
          routeBuilderController.render();

          mockRouteBuilder.trigger('waypoint:click', LAT_LON_STUB, mockRoutepoint);

          expect(onRoutepointClick).toHaveBeenCalledWith(LAT_LON_STUB, mockRoutepoint);
        });

        it('should not emit before the controller is rendered', function() {
          mockRouteBuilder.trigger('waypoint:click', LAT_LON_STUB, mockRoutepoint);

          expect(onRoutepointClick).not.toHaveBeenCalled();
        });

      });

    });

  });

});
