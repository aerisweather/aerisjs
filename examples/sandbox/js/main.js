require([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/aeristile',
  'aeris/maps/animations/tileanimation',
  'aeris/maps/animations/animationsync'
], function (_, Map, AerisTile, TileAnimation, AnimationSync) {
  map = new Map('map-canvas', {
    center: [34.05265942137599, -85.78125],
    zoom: 6,
    endDelay: 3000
  });
  map.on('click', latLon => console.log(latLon));
  //radar = new AerisTile({ tileType: 'radar', map, zIndex: 200 });
  /*temps = new AerisTile({ tileType: 'temperatures', map, zIndex: 100, opacity: .5 });
  switchZ = () => {
    const radarZIndex = radar.getZIndex();
    radar.setZIndex(temps.getZIndex());
    temps.setZIndex(radarZIndex);
  };

  temps.on({
    load: () => console.log('load'),
    'load:reset': () => console.log('load:reset')
  })
  window.renderInfo = () => {}*/

  /*baseLayer = new AerisTile({
    tileType: 'flat,admin',
    zIndex: 0,
    map
  });*/

  radar = new AerisTile({
    tileType: 'radar',
    opacity: 1,
    zIndex: 20,
    map
  });
  temps = new AerisTile({
    tileType: 'temperatures',
    opacity: 0.8,
    zIndex: 10,
    map
  });
  animation = new AnimationSync([temps, radar], {
    from: Date.now() - 24 * HOUR,
    to: Date.now(),
    limit: 10,
    speed: 300
  });
/*
  /!*animation.preload();
  animation.start();*!/

  animation.on({
    'change:time': () => renderInfo(),
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
      renderInfo();
    },
    'load:reset': () => {
      console.log('anim load:reset');
      renderInfo();
    }
  });

  getLayers = () => animation.getTimes().map(t => animation.layersByTime_[t]);
  getLayers().forEach((lyr, i) => {
    radar.on({
      load: () => console.log(`lyr[${i}] load`),
      'load:reset': () => console.log(`lyr[${i}] load:reset`)
    });
  });

  listLoaded = () => getLayers().map(l => l.isLoaded());

  function renderInfo () {
    return;
    try {
      var framesCount = animation.getTimes().length;
      const info = `
      ${animation.getLayerIndex_() + 1} / ${framesCount}
      <br>
      ${getLayers().filter(l => l.isLoaded()).length} / ${framesCount} loaded
      <br>
      ${(animation.getLoadProgress() * 100).toFixed(0)}% loaded
      <br>
      ${getLayers().map(renderLyrInfo).join('<br>')}
    `;
      $('#info').html(info)
    }
    catch (err) {
      console.warn(`Failed to render info: ${err.message}`);
    }
  }

  function renderLyrInfo(lyr) {
    const imgStatus = _.values(radar.getView().imageStatus_);
    return `
      [${animation.getLayerIndex_(radar)}] 
      ${imgStatus.filter(Boolean).length} / ${imgStatus.length}
    `;
  }

  renderInfo();
  window.renderInfo = renderInfo;*/
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