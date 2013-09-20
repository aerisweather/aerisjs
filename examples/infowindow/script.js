
function initialize() {
  require([
    'strategy/map',
    'base/infobox',
    'vendor/jquery',
    'base/layers/osm'
  ], function(AerisMap, InfoWindow, $, OSM) {
    window.map = new AerisMap('map-canvas', {
      center: [45, -90],
      zoom: 3,
      baseLayer: new OSM()
    });

    window.infoWindow = new aeris.maps.InfoBox(
      [45, -90],
      '<h2>yo...</h2>'
    );
    infoWindow.setMap(map);

    $('#changeLoc').click(function() {
      window.somewhere || (window.somewhere = [45, -90]);
      window.somewhere = [window.somewhere[0] + 0.25, window.somewhere[1] + 0.25];

      infoWindow.setLocation(window.somewhere);
    });
  });
}