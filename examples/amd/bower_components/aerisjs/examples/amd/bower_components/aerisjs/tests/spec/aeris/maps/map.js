define([
  'aeris/util',
  'aeris/maps/map',
  'tests/spec/integration/helpers/mapcanvas',
  'aeris/errors/validationerror'
], function(_, Map, MapCanvas, ValidationError) {

  var MockMapView = function() {

  };

  var MapFactory = function(opt_el, opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      strategy: null
    });

    return new Map(opt_el, opt_attrs, options);
  };

  describe('A Map', function() {
    var mapCanvas;

    beforeEach(function() {
      mapCanvas = new MapCanvas();
    });
    afterEach(function() {
      mapCanvas.remove();
    });


    describe('constructor', function() {

      it('should require an existing element', function() {
        expect(function() {
          new MapFactory(null);
        }).toThrowType(ValidationError);

        expect(function() {
          new MapFactory('not-an-element');
        }).toThrowType(ValidationError);

        expect(function() {
          new MapFactory(document.getElementById('not-an-element'));
        }).toThrowType(ValidationError);

        new MapFactory(mapCanvas);
        new MapFactory(mapCanvas.id);
      });

    });


    describe('getElement', function() {

      it('should return the map canvas element (when created by id)', function() {
        var map = new MapFactory(mapCanvas.id);

        expect(map.getElement()).toEqual(mapCanvas);
      });

      it('should return the map canvas element (when created reference)', function() {
        var map = new MapFactory(mapCanvas);

        expect(map.getElement()).toEqual(mapCanvas);
      });

    });

  });

});
