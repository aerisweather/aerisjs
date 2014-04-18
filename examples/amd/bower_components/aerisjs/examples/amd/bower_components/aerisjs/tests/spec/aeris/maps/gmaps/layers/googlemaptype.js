define([
  'aeris/util',
  'aeris/maps/strategy/layers/googlemaptype'
], function(_, GoogleMapTypeStrategy) {
  var google_orig = window.google;

  function getStubbedMap(opt_options) {
    var options = _.extend({
      view: getStubbedMapView()
    }, opt_options);

    var map = jasmine.createSpyObj('aerisMap', [
      'getView'
    ]);

    map.getView.andReturn(options.view);

    return map;
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
      setMapTypeId: jasmine.createSpy('map#setMapTypeId'),
      mapTypeId: 'PREV_MAP_TYPE_ID'
    };
  }

  function getStubbedMapTypeView() {
    return {};
  }

  function testFactory(opt_options) {
    var options = _.extend({
      mapTypeId: 'MAP_TYPE_ID',
      view: getStubbedMapTypeView()
    }, opt_options);
    var layer = {
      mapTypeId: options.mapTypeId,
      on: jasmine.createSpy('on'),
      get: jasmine.createSpy('get'),
      hasMap: jasmine.createSpy('hasMap').andReturn(false)
    };
    var strategy = new GoogleMapTypeStrategy(layer);

    // Stub out mapTypeId array.
    google.maps.mapTypeId = [];

    // Stub out created view
    spyOn(strategy, 'getView').andReturn(options.view);

    return {
      layer: layer,
      strategy: strategy,
      view: options.view
    };
  }


  afterEach(function() {
    // Reset google to it's original splendor
    window.google = google_orig;
  });


  describe('A Google GoogleMapTypeStrategy', function() {
    describe('getView', function() {


      it('should require a map', function() {
        var test = testFactory();

        test.strategy.getView.andCallThrough();

        expect(function() {
          test.strategy.getView();
        }).toThrow();
      });

      it('should throw an error if no MapType view is available', function() {
        var cannedView = null;
        var map = getStubbedMap();
        var test = testFactory();

        test.strategy.getView.andCallThrough();

        map.getView().mapTypes.get.andReturn(cannedView);

        test.strategy.setMap(map);

        expect(function() {
          test.strategy.getView();
        }).toThrow();
      });

      it('should return a view from the map\'s registry', function() {
        var cannedView = { foo: 'bar' };
        var map = getStubbedMap();
        var test = testFactory();

        test.strategy.getView.andCallThrough();

        map.getView().mapTypes.get.andReturn(cannedView);

        test.strategy.setMap(map);
        expect(test.strategy.getView()).toEqual(cannedView);
      });
    });

    describe('setMap', function() {
      it('should only allow setting as a base layer', function() {
        var test = testFactory();
        var map = getStubbedMap();

        expect(function() {
          test.strategy.setMap(map, { baseLayer: false });
        }).toThrowType('InvalidArgumentError');
      });
    });

  });
});
