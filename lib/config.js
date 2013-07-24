
/**
 * @fileoverview RequireJS configuration for Aeris JS Maps.
 */

require.config({
  paths: {
    base: 'aeris/maps/base',
    gmaps: 'aeris/maps/gmaps',
    openlayers: 'aeris/maps/openlayers',
    packages: 'packages',

    // Vendor libraries
    'vendor/underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min'
  },

  shim: {
    'vendor/underscore': {
      exports: '_'
    }
  }
});
