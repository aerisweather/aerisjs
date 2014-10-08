define([
  'aeris/util',
  'aeris/directions/helpers/googledistancecalculator',
  'googlemaps!'
], function(_, GoogleDistanceCalculator, mockGoogleMaps) {
  var root = this;
  var geometry_orig = root.google.maps.geometry;
  var LatLng_orig = root.google.maps.LatLng;

  describe('A GoogleDistanceCalculator', function() {
    var STUB_ORIGIN, STUB_DESTINATION, STUB_DISTANCE;

    function stubGoogleDistanceCalculatorWith(calculatorStub) {

      root.google.maps.geometry = {
        spherical: {
          computeDistanceBetween: calculatorStub
        }
      };
    }

    function stubGoogleLatLngWith(MockLatLng) {
      root.google.maps.LatLng = MockLatLng;
    }

    function restoreGoogle() {
      root.google.maps.LatLng = LatLng_orig;
      root.google.maps.geometry = geometry_orig;
    }


    function createStubbedCalculatorAndReturn(distance) {
      return jasmine.createSpy('computeDistanceBetween').
        andReturn(distance);
    }


    beforeEach(function() {
      STUB_ORIGIN = [12, 34];
      STUB_DESTINATION = [56, 78];
      STUB_DISTANCE = 123.456;

      restoreGoogle();
    });


    afterEach(function() {
      restoreGoogle();
    });


    describe('getDistanceBetween', function() {
      var MockLatLng;
      var STUB_LAT_LNG_ORIGIN, STUB_LAT_LNG_DESTINATION;

      beforeEach(function() {
        STUB_LAT_LNG_ORIGIN = { lat: 12, lng: 34 };
        STUB_LAT_LNG_DESTINATION = { lat: 56, lng: 78 };

        MockLatLng = jasmine.createSpy('LatLng ctor').
          andCallFake(function(lat, lon) {
            var latLon = [lat, lon];
            if (_.isEqual(latLon, STUB_ORIGIN)) {
              return STUB_LAT_LNG_ORIGIN;
            }
            else if (_.isEqual(latLon, STUB_DESTINATION)) {
              return STUB_LAT_LNG_DESTINATION;
            }
            else {
              throw new Error('MockLatLng ctor called with unexpected lat and lon');
            }
          });

        stubGoogleLatLngWith(MockLatLng);
      });


      it('should return results from the google distance calculator', function() {
        var calculatedDistance;
        var stubbedCalculator = createStubbedCalculatorAndReturn(STUB_DISTANCE);
        stubGoogleDistanceCalculatorWith(stubbedCalculator);

        calculatedDistance = GoogleDistanceCalculator.getDistanceBetween(STUB_ORIGIN, STUB_DESTINATION);

        expect(calculatedDistance).toEqual(STUB_DISTANCE);
      });

      it('should call the google distance calculator with google.maps.LatLng objects', function() {
        var stubbedCalculator = createStubbedCalculatorAndReturn(STUB_DISTANCE);
        stubGoogleDistanceCalculatorWith(stubbedCalculator);

        GoogleDistanceCalculator.getDistanceBetween(STUB_ORIGIN, STUB_DESTINATION);

        expect(stubbedCalculator).toHaveBeenCalledWith(STUB_LAT_LNG_ORIGIN, STUB_LAT_LNG_DESTINATION);
      });

      it('should throw a ServiceUnavailableError if the google distance calculator is not defined', function() {
        delete google.maps.geometry;

        expect(function() {
          GoogleDistanceCalculator.getDistanceBetween(STUB_ORIGIN, STUB_DESTINATION);
        }).toThrowType('ServiceUnavailableError');
      });

      describe('if the google distance calculator throws an error', function() {
        var errorThrowingCalculator;
        var STUB_ERROR_MESSAGE;

        beforeEach(function() {
          STUB_ERROR_MESSAGE = 'Stub error message from google calculator.';

          errorThrowingCalculator = jasmine.createSpy('google calculator').
            andCallFake(function() {
              throw new Error(STUB_ERROR_MESSAGE);
            });

          stubGoogleDistanceCalculatorWith(errorThrowingCalculator);
        });


        it('should throw a ServiceUnavailableError', function() {
          expect(function() {
            GoogleDistanceCalculator.getDistanceBetween(STUB_ORIGIN, STUB_DESTINATION);
          }).toThrowType('ServiceUnavailableError');
        });

        it('should include the thrown error message in the ServiceUnavailableError', function() {
          var thrownMessage;

          try {
            GoogleDistanceCalculator.getDistanceBetween(STUB_ORIGIN, STUB_DESTINATION);
          }
          catch (e) {
            thrownMessage = e.message;
          }

          expect(thrownMessage).toContain(STUB_ERROR_MESSAGE);
        });
      });

    });

  });

});
