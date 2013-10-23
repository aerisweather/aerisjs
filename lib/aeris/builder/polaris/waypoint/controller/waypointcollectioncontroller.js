define([
  'aeris/util',
  'mapbuilder/core/controller/mapobjectcollectioncontroller',
  'polarisbuilder/waypoint/model/state'
], function(_, MapObjectCollectionController, state) {
  /**
   * @class aeris.builder.maps.waypoint.controller.WaypointCollectionController
   * @extends aeris.builder.maps.core.controller.MapObjectCollectionController
   *
   * @constructor
   */
  var WaypointCollectionController = function(opt_options) {
    var options = _.extend({
      itemViewOptions: {
        mapObjectNS: 'aeris.polaris.maps'
      },
      collection: state.get('waypoint')
    }, opt_options);


    MapObjectCollectionController.call(this, options);
  };
  _.inherits(WaypointCollectionController, MapObjectCollectionController);


  return WaypointCollectionController;
});
