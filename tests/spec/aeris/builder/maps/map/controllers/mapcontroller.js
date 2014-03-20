define([
  'aeris/util',
  'aeris/model',
  'aeris/builder/maps/map/controllers/mapcontroller'
], function(_, Model, MapController) {
  function TestFactory(opt_options) {
    this.options = _.extend({
      center: [45, -90],
      zoom: 4,
      state: new Model()
    }, opt_options);

    this.state = options.state;

    this.controller = new MapController(this.options);
  }

  var MockMap = jasmine.createSpy('MockMap').andCallFake(function MockMap() {
  });
  _.extend(MockMap.prototype, jasmine.createSpyObj('mock map', [
    'setCenter',
    'setZoom'
  ]));


  /**
   * Creates a MockMarker class
   * within the aeris.maps namespace.
   *
   * @param {Object=} opt_options
   * @param {string=} opt_options.name
   *
   * @return {Function} MockMarker constructor.
   * @constructor
   */
  function MockMarkerFactory(opt_options) {
    var options = _.extend({
      name: 'SomeMarker'
    }, opt_options);

    _.provide('aeris.maps.' + options.name);

    var MockMarker = jasmine.createSpy(options.name).andCallFake(function() {
    });
    _.extend(MockMarker.prototype, jasmine.createSpyObj('MockMarker prototype', [
      'setMap',
      'remove'
    ]));

    return _.expose(MockMarker, 'aeris.maps' + [options.name]);
  }

  describe('A MapController', function() {

    describe('render', function() {

      it('should create a map, with specified options', function() {
        throw new UntestedSpecError();
      });

    });

    describe('binds to application state', function() {

      it('should update the map center', function() {
        throw new UntestedSpecError();
      });

      it('should update the map zoom', function() {
        throw new UntestedSpecError();
      });

      it('should add new markers to the map', function() {
        var test = new TestFactory();
        var MarkerA = new MockMarkerFactory({ name: 'MarkerA' });
        var MarkerB = new MockMarkerFactory({ name: 'MarkerB' });

        // Add markers to the application state
        // by name
        test.state.set('markers', ['MarkerA', 'MarkerB']);

        _.each([MarkerA, MarkerB], function(Marker) {
          // Marker was constructed
          expect(Marker).toHaveBeenCalled();
        });
      });

      it('should not render duplicate markers of the same class', function() {
        throw new UntestedSpecError();
      });

      it('should remove markers from the map', function() {
        throw new UntestedSpecError();
      });

      it('should add and remove markers', function() {
        throw new UntestedSpecError();
      });

    });

  });
});
