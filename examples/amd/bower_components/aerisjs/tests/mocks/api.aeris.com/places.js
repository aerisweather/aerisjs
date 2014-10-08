define(function() {
  return function PlacesResponse() {
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
  };
});
