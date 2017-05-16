require([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/aeristile',
  'aeris/maps/animations/tileanimation',
  'aeris/maps/animations/animationsync'
], function (_, Map, AerisTile, TileAnimation, AnimationSync) {
  map = new Map('map-canvas', {
    center: [45.81348649679973, -94.76806640625],
    zoom: 6,
    endDelay: 3000
  });
  map.on('click', latLon => console.log(latLon));
  /*//radar = new AerisTile({ tileType: 'radar', map, zIndex: 200 });
  temps = new AerisTile({ tileType: 'temperatures', map, zIndex: 100, opacity: .5 });
  switchZ = () => {
    const radarZIndex = radar.getZIndex();
    radar.setZIndex(temps.getZIndex());
    temps.setZIndex(radarZIndex);
  };

  temps.on({
    load: () => console.log('load'),
    'load:reset': () => console.log('load:reset')
  })*/

  baseLayer = new AerisTile({
    tileType: 'flat,admin',
    zIndex: 0,
    map
  });

  lyr = new AerisTile({
    tileType: 'temperatures',
    opacity: 0.75
  });
  animation = new TileAnimation(lyr, {
    from: Date.now() - 24 * HOUR,
    to: Date.now(),
    limit: 4,
    speed: 300
  });

  lyr.setMap(map);

  /*animation.preload();
  animation.start();*/

  animation.on({
    'load:error': function(err) {
      console.log(err.stack);
      throw err;
    },
    'load:times': times => {
      //console.log(`Load complete`, timeLayers);
      //console.log(times.map(t => new Date(t)))
    },
    'load:progress': function(progress) {
      console.log(`Progress: ${progress}`);
    },
    'load:reset': () => console.log('anim load:reset')
  });

  getLayers = () => animation.getTimes().map(t => animation.layersByTime_[t]);
  getLayers().forEach((lyr, i) => {
    lyr.on({
      load: () => console.log(`lyr[${i}] load`),
      'load:reset': () => console.log(`lyr[${i}] load:reset`)
    });
  });
});

var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
/*
 Ideas:
 - Go back to custom ImageMapType, and try to fix
 - Preload only one layer at a time,
 so we're not slamming the map.
 - Forget about 'isLoaded()` animation logic

 - why is it showing tiles that are not really loaded?
 see if we can fix that.

 */