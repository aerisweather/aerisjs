require.config({
  paths: {
    // Base directory of the aerisjs library.
    aeris: '../../../src',

    // Set the map strategy to use
    'aeris/maps/strategy': '../../../src/maps/leaflet',            // Use Leaflet
    // 'aeris/maps/strategy': '../bower_components/aerisjs/src/maps/gmaps',           // Use Google Maps

    underscore: '../bower_components/underscore/underscore',
    jquery: '../bower_components/jquery/dist/jquery',
    backbone: '../bower_components/backbone/backbone',

    // Required only if using Leaflet
    leaflet: '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet',
    'leaflet-markercluster': '//cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/leaflet.markercluster'

    // Required only if using google maps
    /*googlemaps: '../bower_components/googlemaps-amd/src/googlemaps',
    async: '../bower_components/requirejs-plugins/src/async',
    'gmaps-markerclusterer-plus': '../bower_components/gmaps-markerclusterer-plus/index'*/
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
    // Shim for google maps MarkerClustererPlus
    // Required only if using google maps
    /*'gmaps-markerclusterer-plus': {
      exports: 'MarkerClusterer'
    },*/

    // Shim for Leaflet MarkerCluster
    // Required only if using Leaflet
    'leaflet-markercluster': {
      deps: ['leaflet'],
      exports: 'L.MarkerClusterGroup',
      init: function() {
        return L.MarkerClusterGroup;
      }
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
