define([
  'aeris/util',
  'aeris/maps/map',
  'googlemaps!',
  'tests/spec/integration/helpers/mapcanvas',
  'tests/lib/flag',
  'aeris/util/gmaps'
], function(_, AerisMap, gmaps, MapCanvas, Flag, mapUtil) {

  describe('Maps with Google Maps', function() {
    var aerisMap, googleMap;
    var mapCanvas;

    google.maps.Map.prototype.jasmineToString = _.constant('GoogleMap');

    beforeEach(function() {
      mapCanvas = new MapCanvas();
    });


    describe('when an Aeris map is created', function() {


      beforeEach(function() {
        aerisMap = new AerisMap(mapCanvas.id);
        googleMap = aerisMap.getView();
      });

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

    });


    describe('when an Aeris map is created with a google.maps.Map instance', function() {

      it('should use the google.maps.Map object as the map view', function() {
        var mapView = new google.maps.Map(mapCanvas, {
          center: { lat: 12, lng: 34 },
          zoom: 14
        });
        var aerisMap = new AerisMap(mapView);

        expect(aerisMap.getView()).toEqual(mapView);
      });

      it('should update the Aeris map with the google map attributes', function() {
        var mapView = new google.maps.Map(mapCanvas, {
          center: { lat: 12, lng: 34 },
          zoom: 14,
          scrollwheel: false
        });
        var aerisMap = new AerisMap(mapView);

        expect(aerisMap.getCenter()).toEqual([12, 34]);
        expect(aerisMap.getZoom()).toEqual(14);
        expect(aerisMap.get('scrollZoom')).toEqual(false);
      });

      // This is a failing test, and a known issue
      xit('should update the Aeris map\'s element', function() {
        var mapView = new google.maps.Map(mapCanvas, {
          center: { lat: 12, lng: 34 },
          zoom: 14,
          scrollwheel: false
        });
        var aerisMap = new AerisMap(mapView);

        expect(aerisMap.getElement()).toEqual(mapCanvas);
      });

    });

  });

});
