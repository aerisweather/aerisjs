define([
  'aeris/util',
  'vendor/marionette',
  'application/form/controller/togglecontroller'
], function(_, Marionette, ToggleController) {
  /**
   * Controls a collection of map object {aeris.application.form.controller.ToggleController}
   * views.
   *
   * @class aeris.application.form.controller.ToggleCollectionController
   * @extends Marionette.CollectionView
   *
   * @param {Object} options
   * @param {aeris.application.form.collection.ToggleCollection} options.collection
   *        Required.
   * @param {aeris.builder.maps.core.controller.MapObjectToggleController=} options.itemView
   * @constructor
   */
  var ToggleCollectionController = function(options) {
    options = _.defaults(options, {
      itemView: ToggleController
    });

    /**
     * @property collection
     * @type {aeris.application.form.collection.ToggleCollection}
     */

    /**
     * @property itemView
     * @type {aeris.application.form.controller.ToggleController}
     */

    Marionette.CollectionView.call(this, options);
  };
  _.inherits(ToggleCollectionController, Marionette.CollectionView);


  return ToggleCollectionController;
});
