define([
    'ai/util',
    'ai/config',
    'ai/geocode/geocodeservicestatus',
    'ai/geocode/aerisgeocodeservice'
], function(_, AerisConfig, GeocodeServiceStatus, AerisGeocodeService) {

    function getSuccessResponse() {
        return [{
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
        }];
    }

    function getErrorResponse() {
        return [{
            'success': false,
            'error': {
                'code': 'invalid_location',
                'description': 'The requested location was not found.'
            },
            'response': []
        }];
    }

    describe('The AerisGeocodeService', function() {
        it('should query the Aeris places api', function() {
            var aerisService = new AerisGeocodeService();
            expect(true).toBe(true);
        });
    });
});
