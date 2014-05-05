require.config({
  paths: {
    aeris: 'src',

    // Aeris.js dependencies
    underscore: 'bower_components/underscore/underscore',
    jquery: 'bower_components/jquery/dist/jquery',
    backbone: 'bower_components/backbone/backbone',
    leaflet: '//cdn.leafletjs.com/leaflet-0.7.2/leaflet-src',
    'leaflet-markercluster': 'bower_components/leaflet.markercluster/dist/leaflet.markercluster-src',
    Handlebars: 'bower_components/handlebars/handlebars',
    hbars: 'bower_components/hbars/hbars',

    'aeris/maps/strategy': 'src/maps/leaflet'
  }
});

function animate(ctor, map) {
  var layerA = new ctor();
  var layerB = new ctor();

  layerA.setMap(map);
  layerB.setMap(map);

  layerA.loadTileTimes().
    done(function(times) {
      var flag = true;
      var i = 0;
      var FRAMES = 20;
      times = times.reverse();
      times = times.slice(0, FRAMES);

      setInterval(function() {
        var layer_showing = flag ? layerA : layerB;
        var layer_leaving = flag ? layerB : layerA;

        layer_showing.setOpacity(1);
        layer_leaving.setOpacity(0);


        if (times[i + 1]) {
          i++;
        }
        else {
          i = 0;
        }
        flag = !flag;

        // Preload next layer
        layer_leaving.set('time', new Date(times[i]));
      }, 250);
    });
}

require([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/radar',
  'aeris/maps/layers/satellite',
  'aeris/maps/layers/temps',
  'aeris/maps/layers/advisories'
], function(_, Map, Radar, Advisories) {
  map = new aeris.maps.Map('map-canvas');
  animate(aeris.maps.layers.Radar, map);
  animate(aeris.maps.layers.Satellite, map);
  animate(aeris.maps.layers.Temps, map);
  animate(aeris.maps.layers.Advisories, map);
});

