define([
  'aeris/util',
  'aeris/util/latlonutil'
], function(_, latLonUtil) {
  describe('latLonUtil', function() {

    describe('should convert latLon to degrees', function() {

      it('latLonToDegrees', function() {
        var latLon = [45.1234567, -90.1234567];

        var degrees = latLonUtil.latLonToDegrees(latLon);
        var latDeg = degrees[0][0];
        var latMin = degrees[0][1];
        var latSec = degrees[0][2];
        var lonDeg = degrees[1][0];
        var lonMin = degrees[1][1];
        var lonSec = degrees[1][2];

        expect(latDeg).toEqual(45);
        expect(latMin).toEqual(7);
        expect(latSec).toBeNear(24.4452, 0.0025);

        expect(lonDeg).toEqual(-90);
        expect(lonMin).toEqual(7);
        expect(lonSec).toBeNear(24.4452, 0.0025);
      });

      it('zeros', function() {
        var latLon = [0, 0];
        expect(latLonUtil.latLonToDegrees(latLon)).toEqual([
          [0, 0, 0],
          [0, 0, 0]
        ]);
      });
    });

    describe('degreesToLatLon', function() {
      it('standard use case', function() {
        var degrees = [
          [45, 7, 24.4452],
          [-90, 7, 24.4452]
        ];
        var latLon = latLonUtil.degreesToLatLon(degrees);
        var precision = Math.pow(10, -6);

        expect(latLon[0]).toBeNear(45.1234567, precision);
        expect(latLon[1]).toBeNear(-90.1234567, precision);
      });

      it('zeros', function() {
        var degrees = [
          [0, 0, 0],
          [0, 0, 0]
        ];
        expect(latLonUtil.degreesToLatLon(degrees)).toEqual([0, 0]);
      });
    });

  });

});
