define([
  'aeris/util',
  'aeris/maps/map',
  'tests/lib/spyonobject',
  'tests/lib/flag',
  'tests/spec/integration/helpers/mapcanvas',
  'aeris/maps/strategy/util',
  'mocks/leaflet/events/event',
  'leaflet'
], function(_, Map, spyOnObject, Flag, MapCanvas, mapUtil, LeafletEvent, Leaflet) {

  var TestFactory = function(opt_mapOptions) {
    var mapCanvas = new MapCanvas();
    var aerisMap = new Map(mapCanvas.id, opt_mapOptions);
    var leafletMap = aerisMap.getView();

    return {
      mapCanvas: mapCanvas,
      aerisMap: aerisMap,
      leafletMap: leafletMap
    };
  };

  describe('Maps with Leaflet', function() {
    var leafletMap, aerisMap;
    var mapCanvas;

    L.Map.prototype.jasmineToString = _.constant('LeafletMap');

    function createTestObjects(opt_mapOptions) {
      var test;

      test = TestFactory(opt_mapOptions);

      mapCanvas = test.mapCanvas;
      aerisMap = test.aerisMap;
      leafletMap = test.leafletMap;
    }

    function fireMapEvent(topic, data) {
      leafletMap.fireEvent(topic, new LeafletEvent(data));
    }

    beforeEach(createTestObjects);


    describe('when an Aeris map is created', function() {

      it('should create a Leaflet map', function() {
        expect(leafletMap).toBeInstanceOf(Leaflet.Map);
      });

      it('should create a Leaflet map with the specified map canvas element', function() {
        expect(mapCanvas.childElementCount).toBeGreaterThan(0);
      });

      it('should create a Leaflet map with the specified scrollZoom option ', function() {
        createTestObjects({
          scrollZoom: true
        });
        expect(leafletMap.options.scrollWheelZoom).toEqual(true);

        createTestObjects({
          scrollZoom: false
        });
        expect(leafletMap.options.scrollWheelZoom).toEqual(false);
      });

      describe('the created Leaflet map', function() {

        describe('should have the correct properties:', function() {

          it('center', function() {
            expect(leafletMap.getCenter().lat).
              toBeNear(aerisMap.getCenter()[0], 0.05);

            expect(leafletMap.getCenter().lng).
              toBeNear(aerisMap.getCenter()[1], 0.05);
          });

          it('zoom', function() {
            expect(leafletMap.getZoom()).toEqual(aerisMap.getZoom());
          });

        });

      });

      describe('The source Aeris map', function() {

        it('should be updated with the Leaflet map bounds', function() {
          expect(aerisMap.getBounds()).toEqual([
            mapUtil.toAerisLatLon(leafletMap.getBounds().getSouthWest()),
            mapUtil.toAerisLatLon(leafletMap.getBounds().getNorthEast())
          ]);
        });

      });

    });

    describe('when an Aeris map is created with a L.Map object', function() {

      it('should accept a Leaflet map as the element', function() {
        var mapCanvas = new MapCanvas();
        var leafletMap = new Leaflet.Map(mapCanvas, {
          center: new L.LatLng(12, 34),
          zoom: 14
        });
        var aerisMap = new Map(leafletMap);

        expect(aerisMap.getView()).toEqual(leafletMap);
      });

      it('should update the Aeris map with the Leaflet map attributes', function() {
        var mapCanvas = new MapCanvas();
        var leafletMap = new L.Map(mapCanvas, {
          center: new L.LatLng(12, 34),
          zoom: 14,
          scrollWheelZoom: false
        });
        var aerisMap = new Map(leafletMap);

        expect(aerisMap.getCenter()).toEqual([12, 34]);
        expect(aerisMap.getZoom()).toEqual(14);
        expect(aerisMap.get('scrollZoom')).toEqual(false);
      });

    });


    describe('Map events', function() {

      describe('click', function() {
        var onClick;
        var LAT = 12, LON = 34;

        beforeEach(function() {
          onClick = jasmine.createSpy('onClick');
          aerisMap.on('click', onClick);
        });

        it('should proxy L.Map#click event', function() {
          fireMapEvent('click', {
            latlng: new Leaflet.LatLng(LAT, LON)
          });

          expect(onClick).toHaveBeenCalled();
        });

        it('should provide an aeris.maps.LatLon object of the click location', function() {
          fireMapEvent('click', {
            latlng: new Leaflet.LatLng(LAT, LON)
          });

          expect(onClick).toHaveBeenCalledWith([LAT, LON]);
        });

      });


      describe('dblClick', function() {
        var onDblClick;
        var LAT = 12, LON = 34;

        beforeEach(function() {
          onDblClick = jasmine.createSpy('onDblClick');
          aerisMap.on('dblclick', onDblClick);
        });

        it('should proxy L.Map#dblclick event', function() {
          fireMapEvent('dblclick', {
            latlng: new Leaflet.LatLng(LAT, LON)
          });

          expect(onDblClick).toHaveBeenCalled();
        });

        it('should provide an aeris.maps.LatLon object of the click location', function() {
          fireMapEvent('dblclick', {
            latlng: new Leaflet.LatLng(LAT, LON)
          });

          expect(onDblClick).toHaveBeenCalledWith([LAT, LON]);
        });

      });

      describe('load', function() {
        var onLoad;

        beforeEach(function() {
          onLoad = jasmine.createSpy('onLoad');
          aerisMap.on('load', onLoad);
        });


        it('should proxy the L.Map#load event', function() {
          leafletMap.fireEvent('load');

          expect(onLoad).toHaveBeenCalled();
        });

      });

    });


    describe('data binding', function() {
      // Note: we were having some issues with leaking scope
      // on these test assets. We're going to re-initialize them here
      // as a quick fix to this problem.
      // The root problem is probably related to some asyncronous behavior
      // which is affecting the state of the map.
      var aerisMap, leafletMap, mapCanvas;

      beforeEach(function() {
        mapCanvas = new MapCanvas();
        aerisMap = new Map(mapCanvas.id);
        leafletMap = aerisMap.getView();

        function isNearLatLon(latLonA, latLonB, tolerance) {
          var diffLat = Math.abs(latLonA[0] - latLonB[0]);
          var diffLon = Math.abs(latLonA[1] - latLonB[1]);

          return diffLat < tolerance && diffLon < tolerance;
        }

        function isNearBounds(boundsA, boundsB, tolerance) {
          return isNearLatLon(boundsA[0], boundsB[0], tolerance) &&
            isNearLatLon(boundsA[1], boundsB[1], tolerance);
        }

        this.addMatchers({
          toHaveSameCenter: function(leafletMap) {
            var aerisMap = this.actual;
            var leafletCenter = mapUtil.toAerisLatLon(leafletMap.getCenter());

            this.message = function() {
              return 'Leaflet map center is ' + jasmine.pp(leafletCenter) +
                ' but aeris center is ' + jasmine.pp(aerisMap.getCenter());
            };

            return isNearLatLon(aerisMap.getCenter(), leafletCenter, 0.1);
          },
          toHaveSameBounds: function(leafletMap) {
            var aerisMap = this.actual;
            var leafletBounds = mapUtil.toAerisBounds(leafletMap.getBounds());

            this.message = function() {
              return 'Leaflet map bounds are ' + jasmine.pp(leafletBounds) +
                ' but Aeris map bounds is are' + jasmine.pp(aerisMap.getBounds());
            };

            return isNearBounds(aerisMap.getBounds(), leafletBounds, 0.1);
          },
          toHaveSameZoom: function(leafletMap) {
            var aerisMap = this.actual;

            this.message = function() {
              return 'Leaflet map zoom is ' + leafletMap.getZoom() +
                ' but Aeris map zoom is ' + aerisMap.getZoom();
            };

            return aerisMap.getZoom() === leafletMap.getZoom();
          }
        });
      });

      afterEach(function() {
        mapCanvas.remove();
      });


      describe('should update an Aeris map attribute from a Leaflet map action \n ([Leaflet map action] --> [Aeris map attribute])', function() {

        describe('L:[Leaflet map action] --> A:[Aeris map attribute]', function() {

          // Reset test objects to fix some scope leakage
          // issues we're having
          beforeEach(createTestObjects);


          it('L:zoom --> A:center', function() {
            leafletMap.setZoom(2);
            expect(aerisMap).toHaveSameCenter(leafletMap);

            leafletMap.setZoom(7);
            expect(aerisMap).toHaveSameCenter(leafletMap);

            leafletMap.zoomIn();
            expect(aerisMap).toHaveSameCenter(leafletMap);

            leafletMap.zoomOut();
            expect(aerisMap).toHaveSameCenter(leafletMap);
          });

          it('L:pan --> A:center', function() {
            leafletMap.panTo(new Leaflet.LatLng(12, 34));
            expect(aerisMap).toHaveSameCenter(leafletMap);

            leafletMap.panTo(new Leaflet.LatLng(56, 78));
            expect(aerisMap).toHaveSameCenter(leafletMap);
          });

          it('L:zoom --> A:bounds', function() {
            leafletMap.setZoom(2);
            expect(aerisMap).toHaveSameBounds(leafletMap);

            leafletMap.setZoom(7);
            expect(aerisMap).toHaveSameBounds(leafletMap);

            leafletMap.zoomIn();
            expect(aerisMap).toHaveSameBounds(leafletMap);

            leafletMap.zoomOut();
            expect(aerisMap).toHaveSameBounds(leafletMap);
          });

          it('L:pan --> A:bounds', function() {
            leafletMap.panTo(new Leaflet.LatLng(12, 34));
            expect(aerisMap).toHaveSameBounds(leafletMap);

            leafletMap.panTo(new Leaflet.LatLng(56, 78));
            expect(aerisMap).toHaveSameBounds(leafletMap);
          });

          it('L:zoom --> A:zoom', function() {
            leafletMap.setZoom(2);
            expect(aerisMap).toHaveSameZoom(leafletMap);

            leafletMap.setZoom(7);
            expect(aerisMap).toHaveSameZoom(leafletMap);

            leafletMap.zoomIn();
            expect(aerisMap).toHaveSameZoom(leafletMap);

            leafletMap.zoomOut();
            expect(aerisMap).toHaveSameZoom(leafletMap);
          });

          it('L:setView --> A:zoom & A:center & A:bounds', function() {
            leafletMap.setView(new Leaflet.LatLng(51, 15), 6);
            expect(aerisMap).toHaveSameZoom(leafletMap);
            expect(aerisMap).toHaveSameCenter(leafletMap);
            expect(aerisMap).toHaveSameCenter(leafletMap);

            leafletMap.setView(new Leaflet.LatLng(15, 51), 12);
            expect(aerisMap).toHaveSameZoom(leafletMap);
            expect(aerisMap).toHaveSameCenter(leafletMap);
            expect(aerisMap).toHaveSameCenter(leafletMap);
          });

        });

      });

      describe('should act on a Leaflet map when an Aeris map attribute changes', function() {

        describe('A:[Aeris map attribute] --> L:[Leaflet map attribute]', function() {

          it('A:center --> L:center & L:bounds', function() {
            aerisMap.setCenter([12, 34]);
            expect(aerisMap).toHaveSameCenter(leafletMap);
            expect(aerisMap).toHaveSameBounds(leafletMap);

            aerisMap.setCenter([56, 78]);
            expect(aerisMap).toHaveSameCenter(leafletMap);
            expect(aerisMap).toHaveSameBounds(leafletMap);
          });

          it('A:zoom --> L:zoom & L:center & L:bounds', function() {
            aerisMap.setZoom(11);
            expect(aerisMap).toHaveSameZoom(leafletMap);
            expect(aerisMap).toHaveSameCenter(leafletMap);
            expect(aerisMap).toHaveSameBounds(leafletMap);

            aerisMap.setZoom(7);
            expect(aerisMap).toHaveSameZoom(leafletMap);
            expect(aerisMap).toHaveSameCenter(leafletMap);
            expect(aerisMap).toHaveSameBounds(leafletMap);
          });

        });

      });

    });


    it('should fit bounds on the Leaflet map when the Aeris.maps.Map#fitToBounds is called', function() {
      var aerisBounds = [
        [12, 34],
        [56, 78]
      ];

      spyOn(leafletMap, 'fitBounds').andCallThrough();

      aerisMap.fitToBounds(aerisBounds);

      expect(leafletMap.fitBounds).toHaveBeenCalledWith(mapUtil.toLeafletBounds(aerisBounds));
    });


    it('should reset the map size when the canvas element is added to the DOM', function() {
      var timeoutFlag = new Flag();
      var mapCanvas = new MapCanvas();

      // Reset fixutres using mapCanvas removed from the DOM
      mapCanvas.remove();
      aerisMap = new Map(mapCanvas);
      leafletMap = aerisMap.getView();

      spyOn(leafletMap, 'invalidateSize');

      document.body.appendChild(mapCanvas);

      window.setTimeout(timeoutFlag.set, 500);
      waitsFor(timeoutFlag.check, 500);
      runs(function() {
        expect(leafletMap.invalidateSize).toHaveBeenCalled();
        mapCanvas.remove();
      });
    });

  });

});
