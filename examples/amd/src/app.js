require.config({
  paths: {
    // Base directory of the aerisjs library.
    aeris: '../bower_components/aerisjs/src',

    // Set the map strategy to use
    'aeris/maps/strategy': '../bower_components/aerisjs/src/maps/gmaps',            // Use Google Maps
    // 'aeris/maps/strategy': '../bower_components/aerisjs/src/maps/openlayers',    // Use OpenLayers

    underscore: '../bower_components/underscore/underscore',
    jquery: '../bower_components/jquery/jquery',
    backbone: '../bower_components/backbone/backbone',

    googlemaps: '../bower_components/googlemaps-amd/src/googlemaps',
    async: '../bower_components/requirejs-plugins/src/async',

    markerclusterer: '../bower_components/gmaps-markerclusterer-plus/index'
  },

  config: {
    // This configuration gets
    // set onto aeris.config
    'aeris/config': {
      apiId: apiKeys.aeris.id,
      apiSecret: apiKeys.aeris.secret
    }
  },

  shim: {
    backbone: {
      exports: 'Backbone',
      deps: ['underscore', 'jquery']
    },
    markerclusterer: {
      exports: 'MarkerClusterer'
    }
  }
});

require([
  // aeris.maps.Map
  'aeris/maps/map',

  // aeris.maps.layers.Radar
  'aeris/maps/layers/radar',

  // aeris.maps.markercollections.StormReportMarkerse
  'aeris/maps/markercollections/stormreportmarkers'
], function(Map, Radar, StormReportMarkers) {
  var map = new Map('map-canvas');
  var radar = new Radar();
  var stormReportMarkers = new StormReportMarkers();

  radar.setMap(map);
  stormReportMarkers.setMap(map);

  $('#loading').show();
  stormReportMarkers.fetchData().
    done(function() {
      $('#loading').hide();
    });
});