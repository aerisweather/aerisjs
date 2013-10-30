define([
  'aeris/util',
  'vendor/marionette',
  'mapbuilder/core/controller/mapobjecttogglecontroller'
], function(_, Marionette, MapObjectToggleController) {
  /**
   * Controls a collection of map object {aeris.builder.maps.core.controller.MapObjectToggleController}
   * views.
   *
   * @class aeris.builder.maps.core.controller.MapObjectSelectController
   * @extends Marionette.CollectionView
   *
   * @param {Object} options
   * @param {aeris.application.form.collection.ToggleCollection} options.collection
   *        Required.
   * @param {aeris.builder.maps.core.controller.MapObjectToggleController=} options.itemView
   * @constructor
   */
  var MapObjectSelectController = function(options) {
    options = _.defaults(options, {
      // Note that this itemView needs a stateItems param.
      // You can pass in an itemView with that param already set,
      // or you can pass it in with the itemViewOptions.
      itemView: MapObjectToggleController
    });

    /**
     * Describes the toggle controller view.
     *
     * @property collection
     * @type {aeris.application.form.collection.ToggleCollection}
     */

    /**
     * @property itemView
     * @type {aeris.builder.maps.core.controller.MapObjectToggleController}
     */

    Marionette.CollectionView.call(this, options);
  };
  _.inherits(MapObjectSelectController, Marionette.CollectionView);


  return MapObjectSelectController;
});
