require.config({
  paths: {
    aeris: 'src',

    // Core library dependencies
    underscore: 'bower_components/underscore/underscore',
    backbone: 'bower_components/backbone/backbone',

    // MapBuilder dependencides
    jquery: 'bower_components/jquery/dist/jquery',
    'backbone.babysitter': 'bower_components/backbone.babysitter/lib/amd/backbone.babysitter',
    'backbone.wreqr': 'bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
    marionette: 'bower_components/marionette/lib/core/amd/backbone.marionette',
    Handlebars: 'bower_components/handlebars/handlebars',
    hbars: 'bower_components/hbars/hbars',
    text: 'bower_components/requirejs-text/text',
    'wire/builder/rjs': 'bower_components/wire-rjs-builder/builder',

    // Map strategies
    googlemaps: 'bower_components/googlemaps-amd/src/googlemaps',
    async: 'bower_components/requirejs-plugins/src/async',
    'gmaps-markerclusterer-plus': 'bower_components/gmaps-markerclusterer-plus/index',
    leaflet: '//cdn.leafletjs.com/leaflet-0.7.2/leaflet-src',
    'leaflet-markercluster': 'bower_components/leaflet.markercluster/dist/leaflet.markercluster-src'
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
    'gmaps-markerclusterer-plus': {
      exports: 'MarkerClusterer',
      init: function() {
        // Hack for lib not explicity assigned to global scope.
        return MarkerClusterer;
      }
    },
    'leaflet-markercluster': {
      deps: ['leaflet'],
      exports: 'L.MarkerClusterGroup',
      init: function() {
        return L.MarkerClusterGroup;
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
