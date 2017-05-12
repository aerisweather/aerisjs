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
  radar = new AerisTile({ tileType: 'radar', map, zIndex: 200 });
  temps = new AerisTile({ tileType: 'temperatures', map, zIndex: 100, opacity: .5 });
  switchZ = () => {
    const radarZIndex = radar.getZIndex();
    radar.setZIndex(temps.getZIndex());
    temps.setZIndex(radarZIndex);
	};

  /*
  map.on('click', (latLon) => console.log(latLon));

  radar = new AerisTile({
    tileType: 'radar'
  });
  animation = new TileAnimation(radar, {
    from: Date.now() - 3 * HOUR,
    to: Date.now(),
    limit: 10,
    speed: 50
  });

  radar.setMap(map);

  animation.preload();
  animation.start();

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
      /!*if (progress >= 0.2) {
        animation.start();
      }*!/
    }
  });*/
});

var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
/*
Found the bad layer.
  bad layer had a map, and opacity=1
  I tried doing `badLayer.setMap(null); badLayer.setMap(masterLayer.getMap());
    and it showed up.

This also fixed it:
 badLyr.getMap() === masterLayer.getMap()
   true
 masterLayer.getMap() === window.map
   true
 badLyr.setMap(null)
 badLyr.setMap(masterLayer.getMap())

For a bad layer, I notice that lyr.getView().divs_ is empty.
  (unlike for a good layer)
  I wonder if there's an issue with out Custom ImageMapType.
  Unfortunately, I don't know why we implemented it,
    so I don't know if I can swap it out for a standard GMap layer.
  Might be worth trying...

    See 22d2590bb595202b6dc604b69e639ec7e16186e1
       - Create custom G Overlay MapType
       in order to handle z-index changes.
 */