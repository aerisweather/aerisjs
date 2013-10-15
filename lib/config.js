
/**
 * @fileoverview RequireJS configuration for Aeris JS Maps.
 */

/**
 * Maps the strategy path
 * to a specified path within aeris/maps/.
 *
 * @param {string} strategy
 */
require.setStrategy = function(strategy) {
  require.config({
    map: {
      '*': {
        'strategy': 'aeris/maps/' + strategy
      }
    }
  });
};

require.config({
  paths: {
    api: 'aeris/api',
    base: 'aeris/maps/base',
    gmaps: 'aeris/maps/gmaps',
    openlayers: 'aeris/maps/openlayers',
    packages: 'packages',
    geocode: 'aeris/geocode',
    geolocate: 'aeris/geolocate'
  }
});
