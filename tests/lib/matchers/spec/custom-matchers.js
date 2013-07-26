require([
  'jasmine',
  'matchers/custom-matchers'
], function(jasmine) {
  describe('Jasmine Custom Matchers', function() {
    describe('toThrowType', function() {
      var MyError = function() {
        this.name = 'MyError';
        this.message = 'Something awful happened';
      };

      it('should pass with a matching error name', function() {
        expect(function() { throw new MyError() }).toThrowType('MyError');
      });

      it('should pass with a matching error class', function() {
        expect(function() { throw new MyError() }).toThrowType(MyError);
      });

      it('should fail with a mismatched error name', function() {
        expect(function() { throw new MyError() }).not.toThrowType('AnotherError');
      });

      it('should fail with a mismatched error class', function() {
        expect(function() { throw new MyError() }).not.toThrowType(SyntaxError);
      });
    });
  });
});
