define([
  'aeris/util',
  'aeris/helpers/validator/pathvalidator',
  'aeris/helpers/validator/errors/pathvalidationerror'
], function(_, PathValidator, PathValidationError) {


  describe('A PathValidator', function() {
    var pathValidator = new PathValidator();

    describe('isValid', function() {

      it('should require an array', function() {
        var notAnArray = {};
        pathValidator.setPath(notAnArray);

        expect(pathValidator.isValid()).toEqual(false);
      });

      it('should accept an empty array', function() {
        pathValidator.setPath([]);

        expect(pathValidator.isValid()).toEqual(true);
      });

      it('should require an array of latLons', function() {
        var invalidPathValues = [
          ['foo', 'bar'],
          [12, 34, 56],
          [[12, 34, 56]],
          [['foo', 'bar']]
        ];

        _.each(invalidPathValues, function(path) {
          pathValidator.setPath(path);
          expect(pathValidator.isValid()).toEqual(false);
        });
      });

    });


    describe('getLastError', function() {

      it('should return a PathValidationError', function() {
        pathValidator.setPath('foo');

        pathValidator.isValid();

        expect(pathValidator.getLastError()).toBeInstanceOf(PathValidationError);
      });

    });

  });

});
