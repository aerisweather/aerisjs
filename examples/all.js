function LayerRepository(aeris) {
  this.aeris = aeris;
  this.layers = {};
}
LayerRepository.prototype.getLayer = function(layer) {
  var layer_ = this.layers[layer];
  if (!layer_) {
    layer_ = this.layers[layer] = new this.aeris.maps.layers[layer]();
  }
  return layer_;
};

function initialize() {
  var req = require.config({
    config: {
      aeris: {
        apiId: 'ezHWL0MiLsxwlN2ik8U4c',
        apiSecret: 'uCDMeSj91lBfIKCmeQkpeZjsAwUUQJHuKesCvqTm'
      }
    }
  });
  req(["aeris/maps/" + NS], function(aeris) {

    var layerRepo = new LayerRepository(aeris);

    var map = new aeris.maps[NS].Map("map-canvas", {
      baseLayer: layerRepo.getLayer(BASE),
      center: [44.98, -93.2636],
      zoom: 4
    });

    // Base layer

    var $baseLayer = $("#base-layer");
    $baseLayer.change(function() {
      var layer = layerRepo.getLayer($baseLayer.val());
      map.layers.setBaseLayer(layer);
    });

    // Radar

    var radar = new aeris.maps.layers.AerisRadar();
    radar.setMap(map);
    radar.autoUpdate();

    var $radarVisibility = $("#radar-visibility");
    $radarVisibility.change(function() {
      radar[$radarVisibility.val()]();
    });

    var $radarOpacity = $("#radar-opacity");
    $radarOpacity.change(function() {
      radar.setOpacity($radarOpacity.val());
    });

    // Animate

    var radarAnim = radar.animate();

    var $animStart = $("#anim-start");
    $animStart.click(function() {
      radarAnim.start();
      return false;
    });

    var $animPause = $("#anim-pause");
    $animPause.click(function() {
      radarAnim.pause();
      return false;
    });

    var $animStop = $("#anim-stop");
    $animStop.click(function() {
      radarAnim.stop();
      return false;
    });

    var $animPrev = $("#anim-prev");
    $animPrev.click(function() {
      radarAnim.previous();
      return false;
    });

    var $animNext = $("#anim-next");
    $animNext.click(function() {
      radarAnim.next();
      return false;
    });
  });
}

