require.config({
  paths: {
    aeris: 'src',

    // Core library dependencies
    underscore: 'bower_components/underscore/underscore',
    backbone: 'bower_components/backbone/backbone',

    // Note that jQuery can be stubbed out.
    // jQuery is required by Backbone.View,
    // which is never used by Aeris.js
    jquery: 'bower_components/jquery/dist/jquery',

    // Map strategies
    googlemaps: 'bower_components/googlemaps-amd/src/googlemaps',
    async: 'bower_components/requirejs-plugins/src/async',
    'gmaps-markerclusterer-plus': 'bower_components/gmaps-markerclusterer-plus/index',
    leaflet: '//cdn.leafletjs.com/leaflet-0.7.2/leaflet-src',
    'leaflet-markercluster': 'bower_components/leaflet.markercluster/dist/leaflet.markercluster-src'
  },
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
    }
  }
});
