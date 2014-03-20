define([
  'aeris/util',
  'aeris/maps/markers/marker',
  'aeris/maps/strategy/markers/marker',
  'aeris/maps/strategy/util',
  'aeris/maps/map',
  'tests/spec/integration/helpers/mapcanvas',
  'mocks/leaflet/events/event',
  'leaflet'
], function(_, Marker, MarkerStrategy, mapUtil, Map, MapCanvas, LeafletEvent, Leaflet) {


  describe('A Marker', function() {
    var aerisMarker, leafletMarker, leafletIcon;
    var aerisMap, leafletMap;
    var mapCanvas, MAP_CANVAS_ID = 'MAP_CANVAS_ID';

    beforeEach(function() {
      mapCanvas = new MapCanvas(MAP_CANVAS_ID);

      aerisMap = new Map(MAP_CANVAS_ID);
      leafletMap = aerisMap.getView();

      aerisMarker = new Marker({
        title: 'STUB_TITLE'
      }, {
        // Specify strategy to allow
        // synchronous access to marker view
        strategy: MarkerStrategy
      });
      leafletMarker = aerisMarker.getView();
      leafletIcon = leafletMarker.options.icon;
    });

    beforeEach(function() {
      this.addMatchers({
        toEqualPoint: function(pointB) {
          var pointA = this.actual;

          return pointA.equals(pointB);
        }
      });
    });


    afterEach(function() {
      mapCanvas.remove();
    });


    describe('creating a marker', function() {

      it('should create a Leaflet marker', function() {
        expect(leafletMarker).toBeInstanceOf(Leaflet.Marker);
      });

      describe('the Leaflet marker', function() {

        describe('constructor args', function() {

          it('should use the Aeris marker\'s position', function() {
            expect(mapUtil.toAerisLatLon(leafletMarker.getLatLng())).
              toEqual(aerisMarker.getPosition());
          });

          it('should use the aeris marker\'s title for the alt and title', function() {
            expect(leafletMarker.options.alt).toEqual(aerisMarker.get('title'));
            expect(leafletMarker.options.title).toEqual(aerisMarker.get('title'));
          });

          it('should use the aeris marker\'s clickable and draggable', function() {
            expect(leafletMarker.options.clickable).toEqual(aerisMarker.get('clickable'));
            expect(leafletMarker.options.draggable).toEqual(aerisMarker.get('draggable'));
          });

          describe('icon', function() {

            it('should use the aeris marker\'s url', function() {
              expect(leafletIcon.options.iconUrl).toEqual(aerisMarker.getUrl());
            });

            it('should use the aeris marker\'s offset attrs for the anchor', function() {
              var equivPoint = new Leaflet.Point(aerisMarker.get('offsetX'), aerisMarker.get('offsetY'));
              expect(leafletIcon.options.iconAnchor).toEqualPoint(equivPoint);
            });

          });


        });

      });

    });


    describe('attribute binding', function() {

      describe('should bind attributes', function() {

        it('position', function() {
          aerisMarker.setPosition([12.34, 56.78]);
          expect(mapUtil.toAerisLatLon(leafletMarker.getLatLng())).
            toEqual([12.34, 56.78]);

          leafletMarker.setLatLng(new Leaflet.LatLng(98.76, 54.32));
          expect(aerisMarker.getPosition()).toEqual([98.76, 54.32]);
        });

        it('icon url', function() {
          aerisMarker.setUrl('URL_A');
          expect(leafletMarker.options.icon.options.iconUrl).toEqual('URL_A');
        });

        it('offsetX/offsetY', function() {
          aerisMarker.set({
            offsetX: 123,
            offsetY: 456
          });
          expect(leafletMarker.options.icon.options.iconAnchor).
            toEqualPoint(new Leaflet.Point(123, 456));
        });

      });

    });


    describe('selected marker behavior', function() {

      beforeEach(function() {
        aerisMarker = new Marker({
          selected: true,
          selectedURL: 'selectedURL',
          selectedOffsetX: 1234,
          selectedOffsetY: 5678
        }, {
          strategy: MarkerStrategy
        });
        leafletMarker = aerisMarker.getView();
        leafletIcon = leafletMarker.options.icon;
      });

      describe('when an marker is created as selected', function() {

        it('should create a Leaflet marker using selected url', function() {
          expect(leafletIcon.options.iconUrl).toEqual(aerisMarker.getSelectedUrl());
        });

        it('should create a Leaflet marker using selected offset', function() {
          var selectedAnchorPoint = new Leaflet.Point(aerisMarker.get('selectedOffsetX'), aerisMarker.get('selectedOffsetY'));

          expect(leafletIcon.options.iconAnchor).toEqualPoint(selectedAnchorPoint);
        });

      });

      describe('when an marker is selected / deselected', function() {

        it('should update the Leaflet marker icon with the selected url and offset', function() {
          var anchorPoint = new Leaflet.Point(aerisMarker.get('offsetX'), aerisMarker.get('offsetY'));
          var selectedAnchorPoint = new Leaflet.Point(aerisMarker.get('selectedOffsetX'), aerisMarker.get('selectedOffsetY'));

          aerisMarker.deselect();
          expect(leafletMarker.options.icon.options.iconUrl).toEqual(aerisMarker.getUrl());
          expect(leafletMarker.options.icon.options.iconAnchor).toEqualPoint(anchorPoint);

          aerisMarker.select();
          expect(leafletMarker.options.icon.options.iconUrl).toEqual(aerisMarker.getSelectedUrl());
          expect(leafletMarker.options.icon.options.iconAnchor).toEqualPoint(selectedAnchorPoint);
        });

      });

    });


    describe('event proxying (Leaflet marker --> Aeris Marker)', function() {

      describe('click', function() {
        var onClick;

        beforeEach(function() {
          onClick = jasmine.createSpy('onClick');
          aerisMarker.on('click', onClick);
        });

        it('should proxy the Leaflet \'click\' event', function() {
          leafletMarker.fireEvent('click', new LeafletEvent({
            latlng: new Leaflet.LatLng(12, 34)
          }));

          expect(onClick).toHaveBeenCalledWith([12, 34], aerisMarker);
        });

      });


      describe('dragend', function() {
        var onDragEnd;

        beforeEach(function() {
          onDragEnd = jasmine.createSpy('onDragEnd');
          aerisMarker.on('dragend', onDragEnd);
        });

        it('should proxy the Leaflet \'dragend\' event', function() {
          leafletMarker.fireEvent('dragend', {
            distance: 1234
          });

          expect(onDragEnd).toHaveBeenCalledWith(aerisMarker.getPosition(), aerisMarker);
        });

      });

    });


    describe('adding to a map', function() {

      it('should add the leaflet marker to the leaflet map', function() {
        spyOn(leafletMarker, 'addTo');

        aerisMarker.setMap(aerisMap);

        expect(leafletMarker.addTo).toHaveBeenCalledWith(leafletMap);
      });

    });


    describe('removing from a map', function() {

      beforeEach(function() {
        aerisMarker.setMap(aerisMap);
      });


      it('should remove the leaflet marker from the leaflet map', function() {
        spyOn(leafletMap, 'removeLayer');

        aerisMarker.setMap(null);

        expect(leafletMap.removeLayer).toHaveBeenCalledWith(leafletMarker);
      });

    });

  });

});
