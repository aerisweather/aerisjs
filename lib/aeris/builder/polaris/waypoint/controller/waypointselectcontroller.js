define([
  'aeris/util',
  'aeris/collection',
  'mapbuilder/core/controller/mapobjectselectcontroller',
  'polarisbuilder/waypoint/model/state'
], function(_, Collection, MapObjectSelectController, state) {
  /**
   * Controls a collection of Waypoint toggle control views.
   *
   * @class aeris.builder.maps.waypoint.controller.WaypointSelectController
   * @extends aeris.builder.maps.core.controller.MapObjectSelectController
   *
   * @constructor
   * @override
   */
  var WaypointSelectController = function(opt_options) {
    var options = _.extend({
      itemViewOptions: {
        stateItems: state.get('waypoint')
      }
    }, opt_options);

    MapObjectSelectController.call(this, options);
  };
  _.inherits(WaypointSelectController, MapObjectSelectController);


  return WaypointSelectController;
});
