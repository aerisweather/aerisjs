define([
  'aeris/util',
  'aeris/maps/layers/osm',
  'aeris/maps/strategy/layers/osm',
  'aeris/maps/map',
  'tests/spec/integration/helpers/mapcanvas',
  'mocks/mockfactory',
  'leaflet'
], function(_, OSMLayer, OSMLayerStrategy, Map, MapCanvas, MockFactory, Leaflet) {

  var MockLeafletTile = new MockFactory({
    methods: [
      'addEventListener',
      'addTo'
    ]
  });


  describe('OSM Layer', function() {
    var aerisOsmLayer, leafletOsmLayer;
    var aerisMap, leafletMap;
    var mapCanvas, MAP_CANVAS_ID = 'MAP_CANVAS_ID';

    beforeEach(function() {
      mapCanvas = new MapCanvas(MAP_CANVAS_ID);

      aerisMap = new Map(MAP_CANVAS_ID);
      leafletMap = aerisMap.getView();

      aerisOsmLayer = new OSMLayer(null, {
        // Provide strategy instance
        // so we can have synchronous access to the leaflet view
        strategy: OSMLayerStrategy
      });
      leafletOsmLayer = aerisOsmLayer.getView();
    });

    afterEach(function() {
      mapCanvas.remove();
    });


    describe('creating an OSM Layer', function() {

      it('should create a L.TileLayer instance', function() {
        expect(leafletOsmLayer).toBeInstanceOf(Leaflet.TileLayer);
      });

      describe('the L.TileLayer constructor options', function() {

        beforeEach(function() {
          spyOn(Leaflet, 'TileLayer').andCallFake(function(url, options) {
            var layer = new MockLeafletTile(url, options);

            layer.ctorUrl = url;
            layer.ctorOptions = options;

            return layer;
          });

          // Recreate map object instances,
          // using our stubbed Leaflet.TileLayer ctor
          aerisOsmLayer = new OSMLayer(null, {
            strategy: OSMLayerStrategy
          });
          leafletOsmLayer = aerisOsmLayer.getView();
        });

        it('should use the OSM tile server pattern', function() {
          expect(leafletOsmLayer.ctorUrl).toEqual('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        });


        describe('should use Aeris OSM layer attributes and Leaflet layer options: ', function() {


          it('subdomains', function() {
            expect(leafletOsmLayer.ctorOptions.subdomains).toEqual(aerisOsmLayer.get('subdomains'));
          });

          it('minZoom', function() {
            expect(leafletOsmLayer.ctorOptions.minZoom).toEqual(aerisOsmLayer.get('minZoom'));
          });

          it('maxZoom', function() {
            expect(leafletOsmLayer.ctorOptions.maxZoom).toEqual(aerisOsmLayer.get('maxZoom'));
          });

          it('opacity', function() {
            expect(leafletOsmLayer.ctorOptions.opacity).toEqual(aerisOsmLayer.get('opacity'));
          });

          it('zIndex', function() {
            expect(leafletOsmLayer.ctorOptions.zIndex).toEqual(aerisOsmLayer.get('zIndex'));
          });

        });

        it('should include an attribution to Open Street Maps', function() {
          expect(leafletOsmLayer.ctorOptions.attribution).toEqual(
            '<a href="http://www.openstreetmap.org/copyright" target="_blank">&copy OpenStreetMap contributors</a>'
          );
        });

      });

    });

    describe('adding to a map', function() {

      it('should add the leaflet layer to the leaflet map', function() {
        spyOn(leafletOsmLayer, 'addTo');

        aerisOsmLayer.setMap(aerisMap);

        expect(leafletOsmLayer.addTo).toHaveBeenCalledWith(leafletMap);
      });

    });

    describe('removing from the map', function() {

      beforeEach(function() {
        aerisOsmLayer.setMap(aerisMap);
      });


      it('should remove the leaflet layer from the leaflet map', function() {
        spyOn(leafletMap, 'removeLayer');

        aerisOsmLayer.setMap(null);

        expect(leafletMap.removeLayer).toHaveBeenCalledWith(leafletOsmLayer);
      });

    });

    describe('layer events', function() {

      describe('load', function() {
        var onLoad;

        beforeEach(function() {
          onLoad = jasmine.createSpy('onLoad');
          aerisOsmLayer.on('load', onLoad);
        });


        it('should proxy the leaflet load event', function() {
          leafletOsmLayer.fireEvent('load');

          expect(onLoad).toHaveBeenCalled();
        });


      });


      describe('load:reset', function() {
        var onLoadReset;

        beforeEach(function() {
          onLoadReset = jasmine.createSpy('onLoadReset');
          aerisOsmLayer.on('load:reset', onLoadReset);

          aerisOsmLayer.setMap(aerisMap);
        });


        it('should fire when the map pans', function() {
          aerisMap.setCenter([12.345, 67.8910]);
          expect(onLoadReset).toHaveBeenCalled();
        });

        it('should fire when the map zooms', function() {
          aerisMap.setZoom(aerisMap.getZoom() - 1);
          expect(onLoadReset).toHaveBeenCalled();
        });


      });


    });

    describe('layer manipulation', function() {

      describe('should update leaflet layer when aeris layer change attribute', function() {

        it('opacity', function() {
          aerisOsmLayer.setOpacity(0.12345);
          expect(leafletOsmLayer.options.opacity).toEqual(0.12345);
        });

        it('zIndex', function() {
          aerisOsmLayer.setZIndex(9876);
          expect(leafletOsmLayer.options.zIndex).toEqual(9876);
        });

      });

    });

  });

});
