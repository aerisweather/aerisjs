
/**
 * @fileoverview RequireJS configuration for Aeris JS Maps.
 */

require.config({
  paths: {
    // Base Aeris Interactive library path
    ai: 'aeris',

    // Vendor libs
    almond: '../bower_components/almond/almond',
    backbone: '../bower_components/backbone/backbone',
    markerclusterer: '../bower_components/gmaps-markerclusterer-plus/index',
    Handlebars: '../bower_components/handlebars/handlebars',
    hbars: '../bower_components/hbars/hbars',
    jquery: '../bower_components/jquery/jquery',
    marionette: '../bower_components/marionette/lib/backbone.marionette',
    text: '../bower_components/requirejs-text/text',
    underscore: '../bower_components/underscore/underscore',
    async: '../bower_components/requirejs-plugins/src/async',
    googlemaps: '../bower_components/googlemaps-amd/src/googlemaps',

    // Wire dependency
    'wire/builder/rjs': '../bower_components/wire-rjs-builder/builder'
  },
  packages: [
    // Configure wire packages
    // See https://github.com/pieter-vanderwerff/backbone-require-wire
    // for an example of using ReqJs with Wire
    {
      name: 'wire',
      location: '../bower_components/wire',
      main: 'wire'
    },
    {
      name: 'when',
      location: '../bower_components/when',
      main: 'when'
    },
    {
      name: 'meld',
      location: '../bower_components/meld',
      main: 'meld'
    }
  ],
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      exports: 'Backbone',
      deps: ['underscore', 'jquery']
    },
    'marionette': {
      exports: 'Backbone.Marionette',
      deps: ['underscore', 'backbone']
    },
    'jquery': {
      init: function() {
        return jQuery;
      }
    },

    'vendor/backbone.queryparams': {
      deps: ['underscore', 'backbone'],
      exports: 'Backbone'
    },
    'markerclusterer': {
      exports: 'MarkerClusterer',
      init: function() {
        // Hack for lib not explicity assigned to global scope.
        return MarkerClusterer;
      }
    },
    'Handlebars': {
      exports: 'Handlebars',
      init: function() {
        // Hack for lib not explicity assigned to global scope.
        return Handlebars;
      }
    }
  },
  hbars: {
    extension: '.hbs'
  }
});
