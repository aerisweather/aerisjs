define([
  'aeris/util',
  'sinon',
  'aeris/maps/strategy/map'
], function(_, sinon, GMap) {
  function getStubbedMapView() {
    var map = sinon.createStubInstance(google.maps.Map);

    return _.extend(map, {
      mapTypes: {
        set: jasmine.createSpy('mapTypes#set'),
        get: jasmine.createSpy('mapTypes#get')
      },
      overlayMapTypes: {
        push: jasmine.createSpy('mapView.overlayMapTypes#push')
      },
      setMapTypeId: jasmine.createSpy('map#setMapTypeId'),
      mapTypeId: 'PREV_MAP_TYPE_ID'
    });
  }

  /**
   * A stubbed {aeris.maps.gmaps.Map}
   *
   * @param {Object=} opt_options
   * @param {google.maps.Map=} opt_options.view
   *        A mock google map to associate with the Aeris Map.
   * @constructor
   */
  var GMap = function(opt_options) {
    var options = _.extend({
      view: getStubbedMapView()
    }, opt_options);

    var map = sinon.createStubInstance(GMap);


    map.getView = jasmine.createSpy('mapView').andReturn(options.view);

    return map;
  };

  return GMap;
});
