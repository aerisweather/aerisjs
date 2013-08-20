
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
    'vendor/underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
    'vendor/backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
    'vendor/handlebars': '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min',
    'vendor/jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',

    // RequireJS Plugins:
    text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text'
  },

  shim: {
    'vendor/underscore': {
      exports: '_'
    },
    'vendor/backbone': {
      deps: ['vendor/underscore'],
      exports: 'Backbone'
    },
    'vendor/handlebars': {
      exports: 'Handlebars'
    }
  }
});
