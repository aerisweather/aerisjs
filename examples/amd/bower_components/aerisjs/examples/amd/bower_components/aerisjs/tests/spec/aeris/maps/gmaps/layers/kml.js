define([
  'aeris/util',
  'sinon',
  'mocks/layer',
  'aeris/maps/strategy/layers/kml',
  'mocks/gmap'
], function(_, sinon, MockLayer, KMLStrategy, MockMap) {

  function testFactory(opt_options) {
    var options = _.extend({
      layer: getStubbedLayer(),
      layerView: getStubbedLayerView(),
      stubView: true
    }, opt_options);
    var strategy = new KMLStrategy(options.layer);

    if (options.stubView) {
      spyOn(strategy, 'getView').andReturn(options.layerView);
    }

    return {
      layer: options.layer,
      strategy: strategy,
      map: new MockMap()
    };
  }

  function getStubbedLayerView() {
    return jasmine.createSpyObj('KmlLayerView', [
      'setMap'
    ]);
  }


  function getStubbedLayer(opt_options) {
    var layer = new MockLayer({
      attrs: {
        url: 'someUrl.com'
      }
    });

    return layer;
  }


  describe('A Google KML Strategy', function() {

    beforeEach(function() {
      spyOn(google.maps, 'KmlLayer');
    });

    describe('getView', function() {
      it('should return a google KmlLayer', function() {
        var test = testFactory({ stubView: false });

        expect(test.strategy.getView()).toBeInstanceOf(google.maps.KmlLayer);
      });

      describe('layer options', function() {
        var options;

        beforeEach(function() {
          google.maps.KmlLayer.andCallFake(function(opts) {
            options = opts;
          });
        });

        afterEach(function() {
          options = null;
        });

        it('should provide a url', function() {
          var url = 'someUrl.com';
          var layer = getStubbedLayer({ url: url });
          testFactory({ layer: layer, stubView: false });

          expect(options.url).toMatch(url);
        });

        it('should preserve the viewport', function() {
          testFactory({ stubView: false });

          expect(options.preserveViewport).toEqual(true);
        });
      });
    });

    describe('setMap', function() {
      it('should set the layer\'s view on the map', function() {
        var test = testFactory();

        test.strategy.setMap(test.map);

        expect(test.strategy.getView().setMap).
          toHaveBeenCalledWith(test.map.getView());
      });
    });

    describe('remove', function() {
      it('should set the view\'s map to null', function() {
        var test = testFactory();

        test.strategy.setMap(test.map);
        test.strategy.remove();

        expect(test.strategy.getView().setMap).
          toHaveBeenCalledWith(null);
      });
    });

  });

});
