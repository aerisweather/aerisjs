define(['leaflet'], function(L) {
  if (!L) {
    throw new Error('Aeris.js requires Leaflet. See http://leafletjs.com/examples/quick-start.html.');
  }
  if (!L.mapbox) {
    throw new Error('Aeris.js requires MapBox.js in order to use aeris.maps.layers.MapBox layers. ' +
      'See https://www.mapbox.com/mapbox.js.');
  }

  return L.mapbox;
});

