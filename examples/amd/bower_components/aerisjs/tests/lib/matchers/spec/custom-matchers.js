require([
  'aeris/util',
  'testUtils',
  'jasmine',
  'matchers/custom-matchers'
], function(_, testUtils, jasmine) {
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


    describe('toBeNearPath', function() {
      // Adjust all coordinates in a path by delta
      function getAdjustedPath(path, delta) {
        delta = Math.random() >= 0.5 ? delta : delta * -1;

        return _.map(path, function(latLng) {
          return _.map(latLng, function(coord) {
            return coord + delta;
          });
        });
      }

      function getPath() {
        return [
          testUtils.getRandomLatLon(),
          testUtils.getRandomLatLon(),
          testUtils.getRandomLatLon()
        ];
      }

      it('should pass with the same path', function() {
        var expectedPath = getPath();
        expect(expectedPath).toBeNearPath(expectedPath);
      });

      it('should pass with nearby path', function() {
        var expectedPath = getPath();
        var actualPath = getAdjustedPath(expectedPath, 0.0001);
        expect(expectedPath).toBeNearPath(actualPath);
      });

      it('should pass with nearby path, within a specified range', function() {
        var expectedPath = getPath();
        var actualPath = getAdjustedPath(expectedPath, 1);
        expect(expectedPath).toBeNearPath(actualPath, 2);
      });

      it('should fail with a different path', function() {
        var expectedPath = getPath();
        var actualPath = getAdjustedPath(expectedPath, 5);
        expect(expectedPath).not.toBeNearPath(actualPath);
      });

      it('should fail if not within a specified range', function() {
        var expectedPath = getPath();
        var actualPath = getAdjustedPath(expectedPath, 0.01);
        expect(expectedPath).not.toBeNearPath(actualPath, 0.0001);
      });
    });


    describe('toHaveBeenCalledWithSomeOf', function() {
      var spy;

      beforeEach(function() {
        spy = jasmine.createSpy('spy');
      });

      it('should pass when any arguments match', function() {
        spy('foo', 'bar');
        expect(spy).toHaveBeenCalledWithSomeOf('foo');
        expect(spy).toHaveBeenCalledWithSomeOf('bar');
      });

      it('should pass when all arguments match', function() {
        spy('foo', 'bar');
        expect(spy).toHaveBeenCalledWithSomeOf('foo', 'bar');
      });

      it('should fail when not all arguments match', function() {
        spy('foo', 'bar');
        expect(spy).not.toHaveBeenCalledWithSomeOf('foo', 'bar', 'waz');
        expect(spy).not.toHaveBeenCalledWithSomeOf('foo', 'waz', 'bar');
        expect(spy).not.toHaveBeenCalledWithSomeOf('yo', 'jo');
        expect(spy).not.toHaveBeenCalledWithSomeOf('bar', 'waz', 'foo');
      });

    });

  });
});
