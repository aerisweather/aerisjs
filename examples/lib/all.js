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
  require.config({
    config: {
      aeris: {
        apiId: 'ezHWL0MiLsxwlN2ik8U4c',
        apiSecret: 'uCDMeSj91lBfIKCmeQkpeZjsAwUUQJHuKesCvqTm'
      }
    }
  });
  require(["aeris/maps/" + NS], function(aeris) {

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

    var $radarOn = $('#radar-on');
    $radarOn.change(function() {
      if ($radarOn.is(':checked')) {
        radar.setMap(map);
        $radarVisibility.prop('disabled', false);
        $radarOpacity.prop('disabled', false);
      } else {
        radar.setMap(null);
        $radarVisibility.prop('disabled', true);
        $radarOpacity.prop('disabled', true);
      }
    });

    // Satellite

    var satellite = new aeris.maps.layers.AerisSatellite();
    satellite.setMap(map);
    satellite.autoUpdate();

    var $satelliteVisibility = $('#satellite-visibility');
    $satelliteVisibility.change(function() {
      satellite[$satelliteVisibility.val()]();
    });

    var $satelliteOpacity = $('#satellite-opacity');
    $satelliteOpacity.change(function() {
      satellite.setOpacity($satelliteOpacity.val());
    });

    var $satelliteOn = $('#satellite-on');
    $satelliteOn.change(function() {
      if ($satelliteOn.is(':checked')) {
        satellite.setMap(map);
        $satelliteVisibility.prop('disabled', false);
        $satelliteOpacity.prop('disabled', false);
      } else {
        satellite.setMap(null);;
        $satelliteVisibility.prop('disabled', true);
        $satelliteOpacity.prop('disabled', true);
      }
    });

    // Advisories

    var advisories = new aeris.maps.layers.AerisAdvisoriesKML();
    advisories.setMap(map);
    advisories.autoUpdate();

    var $advisoriesVisibility = $('#advisories-visibility');
    $advisoriesVisibility.change(function() {
      advisories[$advisoriesVisibility.val()]();
    });

    var $advisoriesOpacity = $('#advisories-opacity')
    $advisoriesOpacity.change(function() {
      advisories.setOpacity($advisoriesOpacity.val());
    });

    var $advisoriesOn = $('#advisories-on');
    $advisoriesOn.change(function() {
      if ($advisoriesOn.is(':checked')) {
        advisories.setMap(map);
        $advisoriesVisibility.prop('disabled', false);
        $advisoriesOpacity.prop('disabled', false);
      } else {
        advisories.setMap(null);;
        $advisoriesVisibility.prop('disabled', true);
        $advisoriesOpacity.prop('disabled', true);
      }
    });

    // Convective

    var convective = new aeris.maps.layers.AerisConvectiveHazards();
    convective.setMap(map);

    var $convectiveVisibility = $('#convective-visibility');
    $convectiveVisibility.change(function() {
      convective[$convectiveVisibility.val()]();
    });

    var $convectiveOpacity = $('#convective-opacity');
    $convectiveOpacity.change(function() {
      convective.setOpacity($convectiveOpacity.val());
    });

    var $convectiveOn = $('#convective-on');
    $convectiveOn.change(function() {
      if ($convectiveOn.is(':checked')) {
        convective.setMap(map);
        $convectiveVisibility.prop('disabled', false);
        $convectiveOpacity.prop('disabled', false);
      } else {
        convective.setMap(null);
        $convectiveVisibility.prop('disabled', true);
        $convectiveOpacity.prop('disabled', true);
      }
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

