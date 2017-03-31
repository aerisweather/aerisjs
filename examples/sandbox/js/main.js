require([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/aeristile',
  'aeris/maps/animations/tileanimation',
  'aeris/maps/animations/animationsync'
], function(_, Map, AerisTile, TileAnimation, AnimationSync) {
  var map = new Map('map-canvas', {
    center: [38.37611542403604, -77.93701171875],
    zoom: 6,
    endDelay: 3000
  });
  map.on('click', (latLon) => console.log(latLon));

  radar = new AerisTile({
    tileType: 'flat-dk,satellite,ptype-global-aeris',
    zIndex: 110
  });
  /*sat = new AerisTile({
    tileType: 'satellite',
    zIndex: 100
  });*/

  // Create an animation "wrapper" around the satellite layer.
  /*animation = new TileAnimation(radar, {
    from: Date.now() - 3 * HOUR,
    to: Date.now(),
    limit: 20,
    speed: 100
  });*/
  animation = new AnimationSync([radar], {
    from: Date.now() - 3 * HOUR,
    to: Date.now(),
    limit: 20,
    speed: 100
  });

  radar.setMap(map);
  //sat.setMap(map);

  animation.preload();
  animation.start();

  animation.on({
    'load:error': function(err) {
      console.log(err.stack);
      throw err;
    },
    'load:times': times => {
      //console.log(`Load complete`, timeLayers);
      console.log(times.map(t => new Date(t)))
    },
    'load:progress': function(progress) {
      /*console.log(`Progress: ${progress}`);
      if (progress >= 0.2) {
        animation.start();
      }*/
    }
  });
});

var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
