define([
  'aeris/util',
  'aeris/model',
  'aeris/simplecollection'
], function(_, BaseModel, SimpleCollection) {
  /**
   * Describes the state of the {aeris.builder.maps.Layers} module.
   * Serves as a sort of central event hub, so all controllers
   * can set and respond to changes in event state.
   *
   * Also also use to easily bind our routes to the application state.
   *
   * @class aeris.builder.maps.markers.model.State
   * @extends aeris.Model
   *
   * @constructor
   */
  var WaypointState = function(opt_attrs, opt_options) {
    var attrs = _.extend({
      /**
       * Waypoint which are rendered on the map
       *
       * @attribute waypoint
       * @type {Array.<string>}
       */
      waypoint: new SimpleCollection()
    }, opt_attrs);

    BaseModel.call(this, attrs, opt_options);
  };
  _.inherits(WaypointState, BaseModel);


  return new WaypointState();
});
