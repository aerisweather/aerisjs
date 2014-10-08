define([
  'aeris/util',
  'aeris/maps/strategy/util',
  'leaflet'
], function(_, util, Leaflet) {
  var MockLeafletLatLng = function(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  };

  var MockLeafletBounds = function(sw, ne) {
    this.sw_ = sw;
    this.ne_ = ne;
  };

  MockLeafletBounds.prototype.getSouth = function() {
    return this.sw_.lat;
  };

  MockLeafletBounds.prototype.getWest = function() {
    return this.sw_.lng;
  };

  MockLeafletBounds.prototype.getNorth = function() {
    return this.ne_.lat;
  };

  MockLeafletBounds.prototype.getEast = function() {
    return this.ne_.lng;
  };

  MockLeafletBounds.prototype.getSouthWest = function() {
    return this.sw_;
  };

  MockLeafletBounds.prototype.getNorthEast = function() {
    return this.ne_;
  };

  MockLeafletBounds.prototype.getNorthWest = function() {
    return new MockLeafletLatLng(this.getNorth(), this.getWest());
  };

  MockLeafletBounds.prototype.getSouthEast = function() {
    return new MockLeafletLatLng(this.getSouth(), this.getEast());
  };


  describe('Leaflet util', function() {

    describe('toAerisLatLon', function() {

      it('should convert a {L.LatLng} to a {aeris.maps.LatLon}', function() {
        var LAT = '123', LON = '456';
        var leafletLatLng = new MockLeafletLatLng(LAT, LON);

        expect(util.toAerisLatLon(leafletLatLng)).toEqual([LAT, LON]);

      });

    });

    describe('toAerisBounds', function() {

      it('should convert a {L.LatLngBounds} to a {aeris.maps.Bounds}', function() {
        var s = '987', w = '654';
        var n = '123', e = '456';
        var leafletBounds = new MockLeafletBounds(
          new MockLeafletLatLng(s, w),
          new MockLeafletLatLng(n, e)
        );

        expect(util.toAerisBounds(leafletBounds)).toEqual([
          [s, w],
          [n, e]
        ]);
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
