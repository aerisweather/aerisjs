define([
  'mocks/google/maps/latlng',
  'mocks/google/maps/marker',
  'mocks/google/maps/point',
  'mocks/google/maps/travelmode',
  'mocks/google/maps/directionsservice'
], function() {
  var root = this;

  var mockGoogleMaps = {
    // Mock googlemaps! AMD loader
    load: function(name, parentRequire, onload) {
      onload(mockGoogleMaps);
    },

    LatLng: require('mocks/google/maps/latlng'),
    Marker: require('mocks/google/maps/marker'),
    Point: require('mocks/google/maps/point'),
    TravelMode: require('mocks/google/maps/travelmode'),
    DirectionsService: require('mocks/google/maps/directionsservice'),

    event: {
      addListener: function() {},
      removeListener: function() {}
    },


    Geocoder: function() {
    },

    Polyline: function() {
    },

    Size: function() {
    },

    ImageMapType: function() {
    },

    KmlLayer: function() {
    },

    Map: function() {
    },

    GeocodeService: function() {
    },


    DirectionsStatus: {
      INVALID_REQUEST: 'INVALID_REQUEST',
      MAX_WAYPOINTS_EXCEEDED: 'MAX_WAYPOINTS_EXCEEDED',
      NOT_FOUND: 'NOT_FOUND',
      OK: 'OK',
      OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
      REQUEST_DENIED: 'REQUEST_DENIED',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR',
      ZERO_RESULTS: 'ZERO_RESULTS'
    },

    MapTypeId: {
      HYBRID: 'HYBRID',
      ROADMAP: 'ROADMAP',
      SATELLITE: 'SATELLITE',
      TERRAIN: 'TERRAIN'
    },


    GeocoderStatus: {
      ERROR: 'ERROR',
      INVALID_REQUEST: 'INVALID_REQUEST',
      OK: 'OK',
      OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
      REQUEST_DENIED: 'REQUEST_DENIED',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR',
      ZERO_RESULTS: 'ZERO_RESULTS'
    }
  };

  root.google = {
    maps: mockGoogleMaps
  };

  return mockGoogleMaps;
});
