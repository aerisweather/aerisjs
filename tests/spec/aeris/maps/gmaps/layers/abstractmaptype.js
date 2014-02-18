define([
  'aeris/util',
  'sinon',
  'mocks/layer',
  'aeris/maps/strategy/layers/abstractmaptype'
], function(_, sinon, MockLayer, AbstractStrategy) {

  var google_orig = window.google;


  function testFactory(opt_options) {
    var options = _.extend({
      layer: getStubbedLayer(),
      map: getStubbedAerisMap()
    }, opt_options);

    var ConcreteStrategy = function(layer) {
      AbstractStrategy.apply(this, arguments);
    };
    _.inherits(ConcreteStrategy, AbstractStrategy);

    ConcreteStrategy.prototype.getView = jasmine.createSpy('getView').
      andReturn(getStubbedMapType({
        name: options.layer.get('name')
      }));
    return {
      layer: options.layer,
      strategy: new ConcreteStrategy(options.layer),
      map: options.map,
      mapView: options.map.getView()
    };
  }

  function getStubbedMapType(opt_options) {
    var options = _.extend({
      name: 'some map type name'
    }, opt_options);
    var type = sinon.createStubInstance(google.maps.ImageMapType);

    type.name = options.name;

    return type;
  }


  function getStubbedLayer(opt_options) {
    var layer = new MockLayer({
      attrs: {
        name: 'LayerName',
        mapTypeId: 'LAYER_ID'
      }
    });

    return layer;
  }


  function getStubbedAerisMap(opt_options) {
    var options = _.extend({
      view: getStubbedMapView()
    }, opt_options);

    var map = jasmine.createSpyObj('aerisMap', ['getView']);

    map.getView.andReturn(options.view);

    return map;
  }


  function getStubbedMapView() {
    return {
      mapTypes: {
        set: jasmine.createSpy('mapTypes#set'),
        get: jasmine.createSpy('mapTypes#get')
      },
      overlayMapTypes: {
        push: jasmine.createSpy('mapView.overlayMapTypes#push'),
        indexOf: jasmine.createSpy('mapTypes#indexOf'),
        removeAt: jasmine.createSpy('mapTypes#removeat'),
        getArray: jasmine.createSpy('mapTypes#getArray')
      },
      setMapTypeId: jasmine.createSpy('map#setMapTypeId'),
      mapTypeId: 'PREV_MAP_TYPE_ID'
    };
  }


  describe('A Google AbstractMapType Strategy', function() {

    describe('setMap', function() {

      it('should register the map type', function() {
        var test = testFactory();

        test.strategy.setMap(test.map);

        expect(test.mapView.mapTypes.set).toHaveBeenCalledWith(
          test.layer.get('mapTypeId'),
          test.strategy.getView()
        );
      });

      it('should remove an existing map before setting a new one', function() {
        var test = testFactory();
        var oldMap = getStubbedAerisMap();
        var newMap = getStubbedAerisMap();

        spyOn(test.strategy, 'remove');

        test.strategy.setMap(oldMap);
        expect(test.strategy.remove).not.toHaveBeenCalled();

        test.strategy.setMap(newMap);
        expect(test.strategy.remove).toHaveBeenCalled();
      });

      describe('as a base layer', function() {
        it('should set the map\'s mapTypeId', function() {
          var test = testFactory();

          test.strategy.setMap(test.map, { baseLayer: true });

          expect(test.mapView.setMapTypeId).toHaveBeenCalledWith(test.layer.get('mapTypeId'));
        });
      });

      describe('as an overlay layer', function() {
        it('should add an overlayMapType to the map', function() {
          var test = testFactory();

          test.strategy.setMap(test.map, { baseLayer: false });

          expect(test.mapView.mapTypes.set).toHaveBeenCalledWith(
            test.layer.get('mapTypeId'), test.strategy.getView()
          );
        });
      });

    });

    describe('remove', function() {

      describe('as a base layer', function() {
        it('should revert to the previous base layer', function() {
          var test = testFactory();

          test.strategy.setMap(test.map, { baseLayer: true });
          test.strategy.remove();

          expect(test.map.getView().setMapTypeId).toHaveBeenCalledWith('PREV_MAP_TYPE_ID');
        });
      });

      describe('as an overlay layer', function() {
        it('should remove the overlay from the map', function() {
          var test = testFactory();
          var index = 7;

          test.strategy.setMap(test.map, { baseLayer: false });

          test.mapView.overlayMapTypes.getArray.andReturn([
            {
              name: 'foo'
            },
            {
              name: test.layer.get('name')
            },
            {
              name: 'bar'
            }
          ]);

          test.strategy.remove();
          expect(test.mapView.overlayMapTypes.removeAt).toHaveBeenCalledWith(1);
        });
      });

    });

  });
}, function(e) {
  _.defer(function() {
    throw e;
  });
});
