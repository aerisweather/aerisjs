require([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/aeristile',
  'aeris/maps/animations/tileanimation',
  'aeris/maps/animations/animationsync'
], function (_, Map, AerisTile, TileAnimation, AnimationSync) {
	map = new Map('map-canvas', {
		center: [38.37611542403604, -77.93701171875],
		zoom: 6,
		endDelay: 3000
	});
  /*radar = new AerisTile({ tileType: 'radar', map, zIndex: 200 });
  //temps = new AerisTile({ tileType: 'temperatures', map, zIndex: 100, opacity: .5 });
  switchZ = () => {
    const radarZIndex = radar.getZIndex();
    radar.setZIndex(temps.getZIndex());
    temps.setZIndex(radarZIndex);
	};
  radar.on({
    load: () => console.log('loaded')
  })*/

  baseLayer = new AerisTile({
    tileType: 'flat',
    zIndex: 0,
    map
  });

  lyr = new AerisTile({
    tileType: 'radar',
    opacity: 0.75
  });
  animation = new TileAnimation(lyr, {
    from: Date.now() - 24 * HOUR,
    to: Date.now(),
    limit: 10,
    speed: 500
  });

  lyr.setMap(map);

  //animation.preload();
  //animation.start();

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
    }
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