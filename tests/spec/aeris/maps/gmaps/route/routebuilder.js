define([
  'aeris',
  'jasmine',
  'sinon',
  'jquery',
  'gmaps/route/route',
  'gmaps/route/routebuilder',
  'gmaps/map',
  'base/events/click'
], function(aeris, jasmine, sinon, $, Route, RouteBuilder, AerisMap, ClickEvent) {
  var map, $canvas;

  beforeEach(function() {
    $canvas = $('<div id="map-canvas"></div>').appendTo('body');
    map = new AerisMap('map-canvas', {
      center: [44.98, -93.2636],
      zoom: 15
    });


    // Wait for the map to initialize
    waitsFor(function() {
      return map.initialized.state === 'resolved';
    }, 'map to initialize', 1000);
  });

  afterEach(function() {
    map = null;
    $canvas.remove();
  });


  describe('A RouteBuilder', function() {
    it('executes AddWayPointCommand on map click', function() {
      // Inject a mocked click event
      var clickInstance = new aeris.maps.events.Click();
      sinon.stub(aeris.maps.events, 'Click').returns(clickInstance);

      // Grab the callback from the click event
      var evtHandler, evtCtx;
      sinon.stub(clickInstance, 'on', function(topic, callback, ctx) {
        if (topic === 'click') {
          evtHandler = callback;
          evtCtx = ctx;
        }
      });

      // Spy on AddWaypointCommand
      var commandSpy = sinon.spy();
      sinon.stub(aeris.maps.gmaps.route, 'AddWaypointCommand').returns({
        execute: commandSpy
      });


      runs(function() {
        new RouteBuilder(map, {
          route: new Route()
        });

        // Call the click event handler
        evtHandler.call(evtCtx, [44.98, -93.2636]);

        // Check that the AddWaypoinCommand was executed
        expect(commandSpy.calledOnce).toEqual(true);
      });
    });
  });
});
