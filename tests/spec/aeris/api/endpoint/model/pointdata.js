define([
  'aeris/util',
  'api/endpoint/model/pointdata'
], function(_, PointData) {

  describe('A PointData model', function() {

    describe('constructor', function() {
      it('should validate by default', function() {
        spyOn(PointData.prototype, 'isValid');

        new PointData();

        expect(PointData.prototype.isValid).toHaveBeenCalled();
      });

      it('should optionally not validate', function() {
        spyOn(PointData.prototype, 'isValid');

        new PointData(
          null,
          {
            validate: false
          }
        );

        expect(PointData.prototype.isValid).not.toHaveBeenCalled();
      });
    });

    describe('validation', function() {
      it('should require a latLon', function() {
        var invalidLatLons = [
          undefined,
          null,
          'foo',
          new Date(),
          { 1: 45, 2: -90 },
          [45, -90, 17.3],
          ['a', 'b']
        ];
        var validLatLon = [45, -90];

        _.each(invalidLatLons, function(latLon) {
          expect(function() {
            new PointData({
              latLon: latLon
            });
          }).toThrowType('ValidationError');
        });

        // Shouldn't throw error
        new PointData({
          latLon: validLatLon
        });
      });
    });

  });

});
