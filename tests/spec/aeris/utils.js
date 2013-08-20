define(['aeris/utils'], function(utils) {
  describe('The Aeris Utility Library', function() {
    it('should provide unique ids', function() {
      var uuids = [];

      for (var i = 0; i < 50; i++) {
        var id = utils.uniqueId();
        expect(uuids.indexOf(id)).toEqual(-1);

        uuids.push(id);
      }

      for (var i = 0; i < 50; i++) {
        var id = utils.uniqueId('somePrefix');
        expect(uuids.indexOf(id)).toEqual(-1);

        uuids.push(id);
      }
    });

    it('should convert latLon to degrees', function() {
      var latLon = [45.1234567, -90.1234567];

      var degrees = utils.latLonToDegrees(latLon);
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

    it('should convert degrees to latLon', function() {
      var degrees = [
        [45, 7, 24.4452],
        [-90, 7, 24.4452]
      ];
      var latLon = utils.degreesToLatLon(degrees);
      var precision = Math.pow(10, -6);

      expect(latLon[0]).toBeNear(45.1234567, precision);
      expect(latLon[1]).toBeNear(-90.1234567, precision);
    });
  });
});
