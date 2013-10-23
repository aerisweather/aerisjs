
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
    mapbuilder: 'aeris/builder/maps',
    routebuilder: 'aeris/builder/routes',
    'polaris/routeplanner': 'polaris/builder/routeplanner'
  },
  map: {
    // Support Marionette AMD wrapper
    '*': {
      'vendor/marionette': 'vendor/marionette-amd'
    },
    'vendor/marionette-amd': {
      'vendor/marionette': 'vendor/marionette'
    },
    'vendor': {
      'vendor/marionette': 'vendor/marionette'
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
    }
  ],
  shim: {
    'vendor/backbone.queryparams': {
      deps: ['vendor/underscore', 'vendor/backbone'],
      exports: 'Backbone'
    }
  }
});
