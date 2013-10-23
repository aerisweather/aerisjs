define([
  'aeris/util',
  'aeris/collection',
  'vendor/marionette',
  'mapbuilder/core/model/toggle',
  'mapbuilder/core/collection/togglecollection',
  'mapbuilder/core/controller/mapobjecttogglecontroller'
], function(_, Collection, Marionette, Toggle, ToggleCollection, MapObjectToggleController) {
  /**
   * Controls a collection of map object {aeris.builder.maps.core.controller.MapObjectToggleController}
   * views.
   *
   * @class aeris.builder.maps.core.controller.MapObjectSelectController
   * @extends Marionette.CollectionView
   *
   * @param {Object} opt_options
   * @param {aeris.builder.maps.core.collection.ToggleCollection} opt_options.collection
   * @param {aeris.builder.maps.core.controller.MapObjectToggleController} opt_options.itemView
   * @constructor
   */
  var MapObjectSelectController = function(opt_options) {
    var options = _.extend({
      // Note that this itemView needs a stateItems param.
      // You can pass in an itemView with that param already set,
      // or you can pass it in with the itemViewOptions.
      itemView: MapObjectToggleController,
      collection: new ToggleCollection()
    }, opt_options);

    /**
     * Describes the toggle controller view.
     *
     * @type {aeris.builder.maps.core.collection.ToggleCollection}
     */
    this.collection;

    /**
     * @type {aeris.builder.maps.core.controller.MapObjectToggleController}
     */
    this.itemView;

    Marionette.CollectionView.call(this, options);
  };
  _.inherits(MapObjectSelectController, Marionette.CollectionView);


  return MapObjectSelectController;
});
