
/**
 * @fileoverview RequireJS configuration for Aeris JS Maps.
 */

require.config({
  paths: {
    api: 'aeris/api',
    base: 'aeris/maps/base',
    gmaps: 'aeris/maps/gmaps',
    packages: 'aeris/maps/packages',
    openlayers: 'aeris/maps/openlayers',
    geocode: 'aeris/geocode',
    geolocate: 'aeris/geolocate',
    application: 'aeris/application',
    mapbuilder: 'aeris/builder/maps',
    routebuilder: 'aeris/builder/routes',
    'polaris/routeplanner': 'polaris/builder/routeplanner'
  },
  map: {
    // Support Marionette AMD wrapper
    '*': {
      'vendor/marionette': 'vendor/marionette-amd',

      // Support custom wire AMD loader plugin
      'wire': 'vendor/wireloader'
    },
    'vendor/marionette-amd': {
      'vendor/marionette': 'vendor/marionette'
    },
    'vendor': {
      'vendor/marionette': 'vendor/marionette'
    },
    'vendor/hbs': {
      // Support hbs! plugin reqs
      'Handlebars': 'vendor/handlebars',
      'underscore': 'vendor/underscore',
      'json2': 'vendor/json2',
      'i18nprecompile': 'vendor/i18nprecompile'
    },
    'vendor/i18nprecompile': {
      'Handlebars': 'vendor/handlebars',
      'underscore': 'vendor/underscore',
      'json2': 'vendor/json2'
    },

    'vendor/wireloader': {
      'wire': 'vendor/wire/wire'
    }
  },
  packages: [
    // Configure wire packages
    // See https://github.com/pieter-vanderwerff/backbone-require-wire
    // for an example of using ReqJs with Wire
    {
      name: 'wire',
      location: 'vendor/wire',
      main: 'wire'
    },
    {
      name: 'when',
      location: 'vendor/when',
      main: 'when'
    },
    {
      name: 'meld',
      location: 'vendor/meld',
      main: 'meld'
    },
    {
      name: 'hbs',
      location: 'vendor/hbs'
    }
  ],
  shim: {
    'vendor/backbone.queryparams': {
      deps: ['vendor/underscore', 'vendor/backbone'],
      exports: 'Backbone'
    },
    'vendor/jquery/jquery.event.drag': {
      deps: ['vendor/jquery'],
      exports: ['jQuery']
    }
  }
});
