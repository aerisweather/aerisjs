define([
  'aeris/util',
  'base/polylines/polyline'
], function(_, Polyline) {

  describe('A Polyline', function() {

    describe('setStyles', function() {
      var polyline;
      var setPolylineStyles;

      beforeEach(function() {
        polyline = new Polyline();

        // Stub out validation
        spyOn(polyline, 'validate');

        setPolylineStyles = _.bind(polyline.setStyles, polyline);
      });

      it('should set style attributes', function() {
        polyline.setStyles({
          strokeColor: 'blue',
          strokeWeight: 17,
          strokeOpacity: 0.8
        });

        expect(polyline.get('strokeColor')).toEqual('blue');
        expect(polyline.get('strokeWeight')).toEqual(17);
        expect(polyline.get('strokeOpacity')).toEqual(0.8);
      });

      it('should reject non-objects', function() {
        var setWithStrings = _.partial(setPolylineStyles, 'strokeColor', 'green');
        var setWithArray = _.partial(setPolylineStyles, ['strokeColor', 'green']);
        var setWithUndef = _.partial(setPolylineStyles, undefined);

        expect(setWithStrings).toThrowType('InvalidArgumentError');
        expect(setWithArray).toThrowType('InvalidArgumentError');
        expect(setWithUndef).toThrowType('InvalidArgumentError');
      });

      it('should reject non-style attributes', function() {
        var setUnauthorizedStyles = _.partial(setPolylineStyles, {
          path: []
        });
        var setInvalidStyles = _.partial(setPolylineStyles, {
          foo: 'bar'
        });

        expect(setUnauthorizedStyles).toThrowType('InvalidArgumentError');
        expect(setInvalidStyles).toThrowType('InvalidArgumentError');
      });

      it('should validate the styles', function() {
        var hatesBlueErrorMsg = 'NO NO NO!!! I hate blue!';

        var setStrokeColorToBlue = _.partial(setPolylineStyles, {
          strokeColor: 'blue'
        });

        polyline.validate.andCallFake(function(attrs) {
          if (attrs.strokeColor == 'blue') {
            return new Error(hatesBlueErrorMsg);
          }
        });

        expect(setStrokeColorToBlue).toThrow(hatesBlueErrorMsg);
      });

    });

  });

});
