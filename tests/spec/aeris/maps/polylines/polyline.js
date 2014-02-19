define([
  'aeris/util',
  'aeris/maps/polylines/polyline'
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

      describe('should reject non-objects:', function() {

        it('string', function() {
          var setWithStrings = _.partial(setPolylineStyles, 'STRING_STUB_A', 'STRING_STUB_B');
          expect(function() {
            setWithStrings();
          }).toThrowType('InvalidArgumentError');
        });

        it('array', function() {
          var ARRAY_STUB = ['ARRAY_STUB_A', 'ARRAY_STUB_B'];
          var setWithArray = _.partial(setPolylineStyles, ARRAY_STUB);
          expect(function() {
            setWithArray();
          }).toThrowType('InvalidArgumentError');
        });

        it('undefined', function() {
          var setWithUndef = _.partial(setPolylineStyles, undefined);
          expect(function() {
            setWithUndef();
          }).toThrowType('InvalidArgumentError');
        });

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
