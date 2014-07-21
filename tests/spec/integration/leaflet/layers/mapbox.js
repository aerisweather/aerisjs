define([
  'aeris/util',
  'aeris/maps/map',
  'aeris/maps/layers/mapbox',
  'leaflet',
  'tests/spec/integration/helpers/mapcanvas',
  'mapbox'
], function(_, Map, MapBoxLayer, Leaflet, MapCanvas, MapBox) {

  describe('MapBox layer integration using Leaflet', function() {

    beforeEach(function() {
      this.addMatchers({
        toHaveLayerCount: function(expectedCount) {
          var map = this.actual;
          var actualCount = 0;

          map.jasmineToString = map.jasmineToString || _.constant('Map');

          try {
            // L.Map does not provide direct access to
            // layers, but we can use the eachLayer iterator
            // for the same effect.
            map.getView().eachLayer(function() {
              actualCount++;
            });
          }
          catch (err) {
            this.message = _.constant(
              'Expected map {not?} to have {count}  layers, but ' +
                'an error was thrown while trying to count them: {err}'.
                  replace('{not?}', this.isNot ? 'not' : '').
                  replace('{count}', expectedCount).
                  replace('{err}', err.toString())
            );
          }

          return expectedCount === actualCount;
        },

        toHaveLayer: function(layer) {
          var map = this.actual;

          map.jasmineToString = map.jasmineToString || _.constant('Map');
          layer.jasmineToString = layer.jasmineToString || _.constant(layer.get('mapBoxId') || 'Layer');

          if (!map.getView() || !map.getView().hasLayer) {
            throw new Error('Invalid map view.');
          }

          return map.getView().hasLayer(layer.getView());
        }
      });
    });


    describe('creating a MapBox layer', function() {

      it('should create a Leaflet.mapbox.TileLayer object, using the provided mapBoxId', function() {
        var STUB_MAPBOX_ID = 'STUB_MAPBOX_ID';
        spyOn(Leaflet.mapbox, 'TileLayer');

        new MapBoxLayer({
          mapBoxId: 'my_mapbox_map_id'
        });
        expect(Leaflet.mapbox.TileLayer).toHaveBeenCalledWith('my_mapbox_map_id');
      });

    });

    describe('using a MapBox layer as the base map layer', function() {
      var map, mapBoxLayer;

      beforeEach(function() {
        mapBoxLayer = new MapBoxLayer({
          mapBoxId: 'examples.bike-lanes'
        });

        map = new Map(new MapCanvas(), {
          baseLayer: mapBoxLayer
        });
      });


      it('should add the MapBox layer to the map', function() {
        mapBoxLayer.setMap(map);

        expect(map).toHaveLayer(mapBoxLayer);
      });

      it('should not add any other layers to the map', function() {
        mapBoxLayer.setMap(map);

        expect(map).toHaveLayerCount(1);
      });

      it('should be able to change the base layer', function() {
        var differentBaseLayer = new MapBoxLayer({
          mapBoxId: 'examples.map-i86nkdio'
        });
        map.setBaseLayer(differentBaseLayer);

        expect(map).toHaveLayer(differentBaseLayer);
        expect(map).not.toHaveLayer(mapBoxLayer);
      });

    });

  });

});
