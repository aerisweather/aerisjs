define([
    'ai/util',
    'ai/geocode/geocodeservicestatus',
    'ai/geocode/aerisgeocodeservice'
], function(_, GeocodeServiceStatus, AerisGeocodeService) {

    function getSuccessResponse() {
        return {
            'success': true,
            'error': null,
            'response': {
                'loc': {
                    'lat': 44.97997,
                    'long': -93.26384
                },
                'place': {
                    'name': 'Minneapolis',
                    'state': 'MN',
                    'stateFull': 'Minnesota',
                    'country': 'US',
                    'countryFull': 'United States',
                    'region': 'usnc',
                    'regionFull': 'North Central',
                    'continent': 'nam',
                    'continentFull': 'North America'
                },
                'profile': {
                    'elevM': 253,
                    'elevFT': 830,
                    'pop': 382578,
                    'tz': 'America\/Chicago',
                    'tzname': 'CST',
                    'tzoffset': -21600,
                    'isDST': false
                }
            }
        };
    }

    function getErrorResponse() {
        return {
            'success': false,
            'error': {
                'code': 'invalid_location',
                'description': 'The requested location was not found.'
            },
            'response': []
        };
    }

    describe('The AerisGeocodeService', function() {
        var location, aerisUrl, callSpy, errSpy;

        beforeEach(function() {
            location = 'somewhere';
            aerisUrl = 'http://api.aerisapi.com/places';
        });

        it('should query the Aeris places api', function() {
            callSpy = jasmine.createSpy('callSpy').andCallFake(function() {
                expect(mockJSONP.getRequestedUrl()).toBe(aerisUrl);
            });

            // mock aeris geocode
            aerisService.geocode().done(callSpy);
            mockJSONP.resolveWith(getSuccessResponse());

            expect(callSpy).toHaveBeenCalled();
            expect(callSpy).toHaveBeenCalledWith(getSuccessResponse());
        });

        it('should handle api errors', function() {
            errSpy = jasmine.createSpy('errSpy').andCallFake(function() {
                expect(mockJSONP.getRequestedUrl()).toBe(aerisUrl);
            });

            aerisService.geocode().fail(errSpy);
            mockJSONP.resolveWith(getErrorResponse());

            expect(errSpy).toHaveBeenCalled();
            expect(errSpy).toHaveBeenCalledWith(getErrorResponse());
        });
//
//        it('should return successful api responses', function() {
//            throw new Error('success response');
//        });
    });
});
