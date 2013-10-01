
function initialize() {
  require([
    'base/map',
    'base/infobox',
    'vendor/jquery',
    'base/layers/osm'
  ], function(AerisMap, InfoWindow, $, OSM) {
    window.map = new AerisMap('map-canvas', {
      center: [45, -90],
      zoom: 3,
      baseLayer: new OSM()
    });

    window.infoWindow = new aeris.maps.InfoBox({
      latLon: [45, -90],
      content: '<h2>yo...</h2>'
    });
    infoWindow.setMap(map);

    $('#changeLoc').click(function() {
      window.somewhere || (window.somewhere = [45, -90]);
      window.somewhere = [window.somewhere[0] + 0.25, window.somewhere[1] + 0.25];

      infoWindow.setLocation(window.somewhere);
    });

    $('#changeContent').click(function() {
      var hellos = [
        'hola',
        'heyo',
        'hi guy',
        'ca va?',
        'what\'s up?',
        'yo',
        'go home.'
      ];
      var content = hellos[Math.floor(Math.random() * hellos.length)];

      infoWindow.setContent('<h2>' + content + '</h2>');
    });
  });
}