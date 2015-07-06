define([
  'aeris/util',
  'aeris/maps/strategy/util',
  'leaflet'
], function(_, util, Leaflet) {

  describe('Leaflet util', function() {

    beforeEach(function() {
      this.addMatchers({
        toEqualLatLon: function(latLon) {
          this.message = _.constant('Actual: ' + jasmine.pp(this.actual) + '. Expected: ' + jasmine.pp(latLon));

          return _.isEqual(latLon, this.actual);
        }
      });
    });


    describe('toAerisLatLon', function() {

      it('should convert a {L.LatLng} to a {aeris.maps.LatLon}', function() {
        var LAT = 123, LON = 50;
        var leafletLatLng = new Leaflet.LatLng(LAT, LON);

        expect(util.toAerisLatLon(leafletLatLng)).toEqualLatLon([LAT, LON]);
      });


      it('should wrap longitude', function() {
        var LAT = 123, LON = 365;
        var leafletLatLng = new Leaflet.LatLng(LAT, LON);

        expect(util.toAerisLatLon(leafletLatLng)).toEqualLatLon([LAT, 5]);

      });

    });

    describe('toAerisBounds', function() {

      it('should convert a {L.LatLngBounds} to a {aeris.maps.Bounds}', function() {
        var leafletBounds = new Leaflet.LatLngBounds(
          new Leaflet.LatLng(-100, -100),
          new Leaflet.LatLng(100, 100)
        );

        var aerisBounds = util.toAerisBounds(leafletBounds);

        expect(aerisBounds[0]).toEqualLatLon([-100, -100]);
        expect(aerisBounds[1]).toEqualLatLon([100, 100]);
      });

      it('should wrap bounds longitudinally', function() {
        var leafletBounds = new Leaflet.LatLngBounds(
          new Leaflet.LatLng(-100, -460),
          new Leaflet.LatLng(100, 460)
        );

        var aerisBounds = util.toAerisBounds(leafletBounds);
        expect(aerisBounds[0]).toEqualLatLon([-100, -100]);
        expect(aerisBounds[1]).toEqualLatLon([100, 100]);
      });

    });


    describe('toLeafletLatLng', function() {

      it('should convert a {aeris.maps.LatLon} object to a {L.LatLng} object', function() {
        var LAT = 123, LON = 456;
        var latLng = util.toLeafletLatLng([LAT, LON]);

        expect(latLng).toBeInstanceOf(Leaflet.LatLng);
        expect(latLng.lat).toEqual(LAT);
        expect(latLng.lng).toEqual(LON);
      });

    });


    describe('toLeafletBounds', function() {

      it('should convert a {aeris.maps.Bounds} to a {L.LatLngBounds}', function() {
        var s = 123, w = 456;
        var n = 987, e = 654;
        var aerisBounds = [
          [s, w],
          [n, e]
        ];

        var leafletBounds = util.toLeafletBounds(aerisBounds);

        expect(leafletBounds).toBeInstanceOf(Leaflet.LatLngBounds);
        expect(leafletBounds.getSouth()).toEqual(s);
        expect(leafletBounds.getWest()).toEqual(w);
        expect(leafletBounds.getNorth()).toEqual(n);
        expect(leafletBounds.getEast()).toEqual(e);
      });

    });

  });
});
