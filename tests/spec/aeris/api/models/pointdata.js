define([
  'aeris/util',
  'aeris/api/models/pointdata'
], function(_, PointData) {

  describe('A PointData model', function() {

    describe('constructor', function() {
      it('should validate by default', function() {
        spyOn(PointData.prototype, 'isValid');

        new PointData();

        expect(PointData.prototype.isValid).toHaveBeenCalled();
      });

    });

  });

});
