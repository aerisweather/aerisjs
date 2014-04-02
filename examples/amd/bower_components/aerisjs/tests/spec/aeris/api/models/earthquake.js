define([
  'aeris/util',
  'aeris/api/models/earthquake'
], function(_, Earthquake) {

  describe('An Earthquake', function() {
    var earthquake;

    beforeEach(function() {
      earthquake = new Earthquake();
    });


    describe('testFilter', function() {

      it('should pass \'shallow\', if the depth is less than 70km', function() {
        earthquake.set('report', {
          depthKM: 69.9
        });

        expect(earthquake.testFilter('shallow')).toEqual(true);
      });

      it('should reject \'shallow\', if the depth is more than 70km', function() {
        earthquake.set('report', {
          depthKM: 70.1
        });

        expect(earthquake.testFilter('shallow')).toEqual(false);
      });

      it('should return true if the filter equals the report type', function() {
        var TYPE_STUB = 'TYPE_STUB';

        earthquake.set('report', {
          type: TYPE_STUB
        });

        expect(earthquake.testFilter(TYPE_STUB)).toEqual(true);
      });

      it('should return false if the filter does not equal report type', function() {
        var TYPE_STUB = 'TYPE_STUB';

        earthquake.set('report', {
          type: TYPE_STUB
        });

        expect(earthquake.testFilter('foo')).toEqual(false);
      });

    });

  });

});
