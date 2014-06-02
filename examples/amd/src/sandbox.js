require.config({
  paths: {
    // Base directory of the aerisjs library.
    aeris: '../../../src',

    // Set the map strategy to use
    'aeris/maps/strategy': '../bower_components/aerisjs/src/maps/leaflet',            // Use Google Maps
    // 'aeris/maps/strategy': '../bower_components/aerisjs/src/maps/openlayers',    // Use OpenLayers

    underscore: '../bower_components/underscore/underscore',
    jquery: '../bower_components/jquery/dist/jquery',
    backbone: '../bower_components/backbone/backbone',

    googlemaps: '../bower_components/googlemaps-amd/src/googlemaps',
    async: '../bower_components/requirejs-plugins/src/async',

    leaflet: '//cdn.leafletjs.com/leaflet-0.7.2/leaflet-src'
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
    'gmaps-markerclusterer-plus': {
      exports: 'MarkerClusterer'
    }
  }
});

require([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/radar',
  'aeris/maps/layers/satellite',
  'aeris/maps/layers/temps',
  'aeris/maps/layers/advisories',
  './canvaslayer'
], function(_, Map, Radar, Satellite, Temps, Advisories, CanvasLayer) {

  stepFns = [];


  map = new Map('map-canvas');
  radar = new Radar();
  satellite = new Satellite();
  temps = new Temps();
  advisories = new Advisories();

  mapView = map.getView();
  mapView.scrollWheelZoom.disable();

  canvasLayers = [];

  var canvasLayer = new CanvasLayer(advisories);
  canvasLayer.addTo(mapView);
  canvasLayer.setZIndex(999);

  canvasLayer.on('click:color', function(evt) {
    var color = evt.color;
    console.log(color);
    canvasLayer.filterByColor(color);
  });

  //animateLayer(advisories, 99997, 0.85);

  function animateLayer(layer, zIndex, opacity) {
    var canvasLayer = new CanvasLayer(layer);
    canvasLayer.addTo(mapView);
    canvasLayer.setZIndex(zIndex);
    canvasLayer.setOpacity(opacity);

    layer.loadTileTimes().
      done(function(allTimes) {
        var i = 0;
        var times = allTimes.reverse();
        times = times.slice(0, 20);

        stepFns.push(function() {
          var time = times[i];

          layer.set('time', new Date(time));

          if (times[i + 1]) {
            i++;
          }
          else {
            i = 0;
          }
        });

      });

    canvasLayers.push(canvasLayer);
  }


  // Log progress
  var lastProgress = 0;
  /*window.setInterval(function() {
    var prog = (
      advisories.getProgress()
    ) / 4;

    if (prog.toFixed(2) !== lastProgress.toFixed(2)) {
      console.log(prog.toFixed(2));
      lastProgress = prog;
    }
  }, 100);*/

  start = function() {
    window.int = window.setInterval(next, 250);
  };

  next = function() {
    stepFns.forEach(function(fn) {
      fn();
    });
  };

  stop = function() {
    window.clearInterval(int);
  };

});




/**
 * Utility for performance testing.
 */
(function(exports) {
  exports.currentTime = 0;
  exports.callCount = 0;
  exports.times = [];

  exports.startTime = function() {
    exports.currentTime = performance.now();
  };

  exports.endTime = function() {
    exports.times.push(performance.now() - currentTime);
    exports.callCount++;
  };

  exports.resetTime = function() {
    var times_pp = times.map(function(t) {
      return parseFloat(t.toFixed(1));
    });
    console.log(
      'Time: ', getTotalTime().toFixed(0),
      'Count:', callCount
    );
    console.dir(times_pp);
    exports.times.length = 0;
    exports.callCount = 0;
  };

  exports.getTotalTime = function() {
    return exports.times.reduce(function(total, time) {
      return total + time;
    }, 0);
  };
})(window);