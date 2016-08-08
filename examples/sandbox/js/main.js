require([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/radar',
  'aeris/maps/animations/tileanimation'
], function(_, Map, Radar, TileAnimation) {
  var map = new Map('map-canvas');

  radar = new Radar();

  // Create an animation "wrapper" around the satellite layer.
  animation = new TileAnimation(radar, {
    // Set the maximum number of animation "frames"
    // to load. A higher limit will result in a smoother
    // animation, though it will take longer to load.
    limit: 50,
    from: Date.now() - 1000 * 60 * 60 * 6,    // 6 hours ago
    to: Date.now() + 1000 * 60 * 60 * 18      // 18 hours into the future
  });

  radar.setMap(map);

  animation.start();

  animation.on({
    'load:error': function(err) {
      console.log(err.stack);
      throw err;
    }
  });
});

