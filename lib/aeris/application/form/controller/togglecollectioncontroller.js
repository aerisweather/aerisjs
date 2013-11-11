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
   * @extends Marionette.CompositeView
   *
   * @param {Object} options
   * @param {aeris.application.form.collection.ToggleCollection} options.collection
   *        Required.
   * @param {aeris.builder.maps.core.controller.MapObjectToggleController=} options.itemView
   * @constructor
   */
  var ToggleCollectionController = function(options) {
    options = _.defaults(options, {
      itemView: ToggleController,

      // Allows the controller to act as a
      // simple CollectionController
      template: function() { return '<div></div>'; }
    });

    /**
     * @property collection
     * @type {aeris.application.form.collection.ToggleCollection}
     */

    /**
     * @property itemView
     * @type {aeris.application.form.controller.ToggleController}
     */

    Marionette.CompositeView.call(this, options);
  };
  _.inherits(ToggleCollectionController, Marionette.CompositeView);


  return ToggleCollectionController;
});
