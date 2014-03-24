require.config({
  paths: {
    aeris: 'src',

    // Vendor libs
    almond: 'bower_components/almond/almond',
    backbone: 'bower_components/backbone/backbone',
    markerclusterer: 'bower_components/gmaps-markerclusterer-plus/index',
    Handlebars: 'bower_components/handlebars/handlebars',
    hbars: 'bower_components/hbars/hbars',
    jquery: 'bower_components/jquery/dist/jquery',
    'backbone.babysitter': 'bower_components/backbone.babysitter/lib/amd/backbone.babysitter',
    'backbone.wreqr': 'bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
    marionette: 'bower_components/marionette/lib/core/amd/backbone.marionette',
    text: 'bower_components/requirejs-text/text',
    underscore: 'bower_components/underscore/underscore',
    async: 'bower_components/requirejs-plugins/src/async',
    googlemaps: 'bower_components/googlemaps-amd/src/googlemaps',
    leaflet: '//cdn.leafletjs.com/leaflet-0.7.2/leaflet',

    // Wire dependency
    'wire/builder/rjs': 'bower_components/wire-rjs-builder/builder'
  },
  packages: [
    // Configure wire packages
    // See https://github.com/pieter-vanderwerff/backbone-require-wire
    // for an example of using ReqJs with Wire
    {
      name: 'wire',
      location: 'bower_components/wire',
      main: 'wire'
    },
    {
      name: 'when',
      location: 'bower_components/when',
      main: 'when'
    },
    {
      name: 'meld',
      location: 'bower_components/meld',
      main: 'meld'
    }
  ],
  shim: {
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
