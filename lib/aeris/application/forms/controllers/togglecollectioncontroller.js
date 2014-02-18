define([
  'aeris/util',
  'marionette',
  'aeris/application/forms/controllers/togglecontroller'
], function(_, Marionette, ToggleController) {
  /**
   * Controls a collection of map object {aeris.application.forms.controllers.ToggleController}
   * views.
   *
   * @class ToggleCollectionController
   * @namespace aeris.application.forms.controllers
   * @extends Marionette.CompositeView
   *
   * @param {Object} options
   * @param {aeris.application.forms.collections.ToggleCollection} options.collection
   *        Required.
   * @param {aeris.builder.maps.core.controllers.MapObjectToggleController=} options.itemView
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
     * @type {aeris.application.forms.collections.ToggleCollection}
     */

    /**
     * @property itemView
     * @type {aeris.application.forms.controllers.ToggleController}
     */

    Marionette.CompositeView.call(this, options);
  };
  _.inherits(ToggleCollectionController, Marionette.CompositeView);


  return ToggleCollectionController;
});
