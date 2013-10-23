define([
  'aeris/util',
  'mapbuilder/core/module/mapobjectmodule',
  'polarisbuilder/waypoint/model/state',
  'polarisbuilder/waypoint/controller/waypointcollectioncontroller',
  'polarisbuilder/waypoint/controller/waypointselectcontroller'
], function(_, MapObjectModule, state, WaypointCollectionController, WaypointSelectController) {
  /**
   * @class aeris.builder.polaris.WaypointModule
   * @extends aeris.builder.maps.core.modules.MapObjectModule
   *
   * @constructor
   * @override
   */
  var WaypointModule = function(options) {
    options = _.extend({
      stateItems: state.get('waypoint'),
      configKey: 'waypoint',
      MapObjectCollectionController: WaypointCollectionController,
      MapObjectSelectController: WaypointSelectController,
      labelLookup: {
        'POIMarkers': 'Point of Interest',
        'DealerMarkers': 'Polaris Dealers'
      }
    }, options);

    MapObjectModule.call(this, options);
  };
  _.inherits(WaypointModule, MapObjectModule);


  return WaypointModule;
});
