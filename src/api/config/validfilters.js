define(
  /**
   * A list of valid point data endpoint filters
   * to be used when querying the Aeris API.
   *
   * @class validFilters
   * @namespace aeris.api.config
   * @static
   *
   * As {Object.<string,Array.<string>>}
   *       As:
   *          {
   *            'endpoint': [
   *              'filterA',
   *              'filterB',
   *              ...
   *            ],
   *            ...
   *          }
   */
  {
    earthquakes: [
      'mini',
      'minor',
      'light',
      'moderate',
      'strong',
      'major',
      'great',
      'shallow'
    ],

    fires: [
      'large',
      'critical',
      'modis'
    ],

    // Missing documentation for lighting.
    lightning: undefined,

    stormreports: [
      'avalanche',
      'blizzard',
      'flood',
      'fog',
      'ice',
      'hail',
      'lightning',
      'rain',
      'snow',
      'tides',
      'tornado',
      'wind'
    ]
  }
);
