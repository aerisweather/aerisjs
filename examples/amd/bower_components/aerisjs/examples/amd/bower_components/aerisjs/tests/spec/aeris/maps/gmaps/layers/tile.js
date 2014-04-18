define([
  'aeris/util',
  'mocks/layer',
  'aeris/maps/strategy/layers/tile'
], function(_, MockLayer, TileStrategy) {
  var google_orig = window.google;


  function testFactory(opt_options) {
    var options = _.extend({
      layer: new MockLayer(),
      MapType: MockMapType
    }, opt_options);

    var view = new options.MapType();
    var viewOptions;

    spyOn(options, 'MapType').andCallFake(function(opts) {
      viewOptions = opts;
      return view;
    });

    var strategy = new TileStrategy(options.layer, { MapType: options.MapType });

    return {
      layer: options.layer,
      strategy: strategy,
      view: view,
      MapType: options.MapType,
      viewOptions: viewOptions
    };
  }


  function getStubbedAerisMap(opt_options) {
    var options = _.extend({
      view: getStubbedMapView()
    }, opt_options);

    var map = jasmine.createSpyObj('aerisMap', ['getView']);

    map.getView.andReturn(options.view);

    return map;
  }

  function MockMapType() {
    return jasmine.createSpyObj('ImageMapType', [
      'setZIndex',
      'setOpacity',
      'setMap'
    ]);
  }


  function getStubbedMapView() {
    return {
      mapTypes: {
        set: jasmine.createSpy('mapView.mapTypes#set'),
        get: jasmine.createSpy('mapView.mapTypes#get')
      },
      overlayMapTypes: {
        push: jasmine.createSpy('mapView.overlayMapTypes#push')
      },
      setMapTypeId: jasmine.createSpy('map#setMapTypeId')
    };
  }

  beforeEach(function() {
    spyOn(google.maps, 'Size');
  });


  afterEach(function() {
    window.google = google_orig;
  });

  describe('A Google TileStrategy', function() {
    it('should work', function() {
      expect(true).toEqual(true);
    });
    describe('getView', function() {
      it('should return a google ImageMapType instance', function() {
        var test = testFactory();

        expect(test.MapType).toHaveBeenCalled();
      });

      describe('ImageMapType options', function() {
        var mapTypeOptions;

        it('should provide a tile size of 256 x 256', function() {
          var sizeObj = { foo: 'bar' };
          var test;

          google.maps.Size.andCallFake(function() {
            return sizeObj;
          });

          test = testFactory();

          expect(google.maps.Size).toHaveBeenCalledWith(256, 256);
          expect(test.viewOptions.tileSize).toEqual(sizeObj);
        });

        it('should provide the layer\'s minZoom, maxZoom, and name', function() {
          var test = testFactory();
          expect(test.viewOptions.minZoom).toEqual(test.layer.get('minZoom'));
          expect(test.viewOptions.maxZoom).toEqual(test.layer.get('maxZoom'));
          expect(test.viewOptions.name).toEqual(test.layer.get('name'));
        });

        describe('getTileUrl', function() {
          it('should return a parsed tile url', function() {
            var url = '{d}.server.com/{z}/{x}/{y}/{t}.png';
            var coord = { x: 7, y: 11 };
            var zoom = 15;
            var layer = new MockLayer({
              url: url,
              subdomains: ['sd']
            });
            var test = testFactory({
              layer: layer
            });

            expect(test.viewOptions.getTileUrl(coord, zoom)).
              toEqual(
                layer.get('subdomains')[0] + '.server.com/15/' +
                coord.x + '/' + coord.y + '/' +
                '{t}.png'
              );
          });
        });
      });
    });

    describe('setMap', function() {
      it('should register the map type with google', function() {
        var test = testFactory();
        var map = getStubbedAerisMap();
        var mapView = map.getView();

        test.strategy.setMap(map);

        // mock google.maps.MapTypeRegistry#set
        mapView.mapTypes.set.andCallFake(function(mapTypeId, mapType) {
          expect(mapTypeId).toEqual(test.layer.get('name'));
          expect(mapType).toBeInstanceOf(google.maps.ImageMapType);
        });

        expect(mapView.mapTypes.set).toHaveBeenCalled();
      });

      describe('as baseLayer', function() {
        it('set the map type on the map by id', function() {
          var test = testFactory();
          var map = getStubbedAerisMap();
          var mapView = map.getView();

          test.strategy.setMap(map, { baseLayer: true });

          expect(mapView.setMapTypeId).toHaveBeenCalledWith(test.layer.get('name'));
        });
      });


    });
  });

});
