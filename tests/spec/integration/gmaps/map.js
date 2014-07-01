define([
  'aeris/maps/map',
  'googlemaps!',
  'tests/spec/integration/helpers/mapcanvas',
  'tests/lib/flag',
  'aeris/util/gmaps'
], function(AerisMap, gmaps, MapCanvas, Flag, mapUtil) {

  describe('Maps with Google Maps', function() {
    var aerisMap, googleMap;
    var mapCanvas, tilesLoaded;

    beforeEach(function() {
      mapCanvas = new MapCanvas();
    });


    beforeEach(function() {
      aerisMap = new AerisMap(mapCanvas.id);
      googleMap = aerisMap.getView();
    });


    describe('when an Aeris map is created', function() {

      it('should create a google.maps.Map', function() {
        expect(googleMap).toBeInstanceOf(gmaps.Map);
      });

      describe('the Google map', function() {

        it('should have the Aeris map\'s center', function() {
          var googleMapCenter = mapUtil.latLngToArray(googleMap.getCenter());
          expect(googleMapCenter[0]).toBeNear(aerisMap.getCenter()[0], 0.01);
          expect(googleMapCenter[1]).toBeNear(aerisMap.getCenter()[1], 0.01);
        });

        it('should have the Aeris map\'s zoom', function() {
          expect(googleMap.getZoom()).toEqual(aerisMap.getZoom());
        });

        it('should use the provided scrollZoom option', function() {
          var mapCanvas = new MapCanvas();
          spyOn(gmaps, 'Map').andReturn(googleMap);
          gmaps.Map.getOptions = function() {
            return gmaps.Map.mostRecentCall.args[1];
          };

          new AerisMap(mapCanvas, {
            scrollZoom: false
          });
          expect(gmaps.Map.getOptions().scrollwheel).toEqual(false);

          new AerisMap(mapCanvas, {
            scrollZoom: true
          });
          expect(gmaps.Map.getOptions().scrollwheel).toEqual(true);
        });

      });

      it('should accept a view object', function() {
        var mapView = new google.maps.Map(mapCanvas);
        var aerisMap = new AerisMap(mapView);

        expect(aerisMap.getView()).toEqual(mapView);
      });

    });


  });

});
