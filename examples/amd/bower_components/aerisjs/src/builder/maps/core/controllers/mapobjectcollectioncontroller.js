define([
  'aeris/util',
  'marionette',
  'aeris/builder/maps/core/controllers/mapobjecttogglecontroller'
], function(_, Marionette, MapObjectToggleController) {
  /**
   * Controls a set of {aeris.maps.extensions.MapExtensionObject}
   * view objects.
   *
   * @class MapObjectCollectionController
   * @namespace aeris.builder.maps.map.controllers
   * @extends Marionette.CollectionView
   *
   * @param {Object=} opt_options
   * @param {aeris.builder.maps.core.collections.MapObjectToggleCollection} opt_options.collection
   *        State of the map objects collection.
   *
   * @constructor
   */
  var MapObjectCollectionController = function(opt_options) {
    var options = _.extend({
      itemView: MapObjectToggleController
    }, opt_options);


    Marionette.CollectionView.call(this, options);
  };
  _.inherits(MapObjectCollectionController, Marionette.CollectionView);


  return MapObjectCollectionController;
});
