

function bindUIEvents() {
  $locateBtn.click(function() {
    showLoading();
    gls.getCurrentPosition()
      .always(hideLoading)
      .done(setMarkerAt)
      .fail(handleError);
  });

  $disableSelect.change(function() {
    if ($disableSelect.prop('checked')) {
      gls = new GLS({
        navigator: 'IE8 FTW'
      });
    }
    else {
      gls = new GLS({
        navigator: navigator_orig
      });
    }
  });

  $watchSelect.change(function() {
    if ($watchSelect.prop('checked')) {
      gls.watchPosition(setMarkerAt, handleError);
    }
    else {
      gls.clearWatch();
    }
  });
}

function handleError(error) {
  console.log('Something went horribly wrong', error);
}

function showLoading() {
  $loading.fadeIn(150);
}

function hideLoading() {
  $loading.delay(800).fadeOut(150);
}

function setMarkerAt(position) {
  console.log('Position: ', position);
  if (window.infoBox) {
    infoBox.setMap(null);
  }
  window.infoBox = new InfoBox({
    latLon: position.latLon,
    content: 'You are here.'
  });
  infoBox.setMap(map);
}


function initialize() {
  require.setStrategy('gmaps')
  require([
    'base/map',
    'base/layers/googleroadmap',
    'base/infobox',
    'vendor/jquery',
    'gls' // Mapped to a specific gls implementation in example file
  ], function(AerisMap, GoogleRoadMap, InfoBox, $, GLS) {
    window.map = new AerisMap('map-canvas', {
      baseLayer: new GoogleRoadMap(),
      zoom: 4,
      center: [45, -90]
    });
    window.GLS = GLS;
    window.gls = new GLS();
    window.InfoBox = InfoBox;
    window.navigator_orig = window.navigator;

    window.$ = $;
    window.$loading = $('#flash-message');
    window.$locateBtn = $('#locate');
    window.$disableSelect = $('#disableGLS');
    window.$watchSelect = $('#watch');

    bindUIEvents();
  });
}
