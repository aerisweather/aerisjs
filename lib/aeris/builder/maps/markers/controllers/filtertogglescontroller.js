define([
  'ai/util',
  'ai/application/form/controllers/togglecollectioncontroller'
], function(_, ToggleCollectionController) {
  /**
   *
   * @class FilterTogglesController
   * @namespace aeris.builder.maps.markers.controllers
   * @extends aeris.application.form.controllers.ToggleCollectionController
   *
   * @constructor
   * @override
   */
  var FilterTogglesController = function() {
    ToggleCollectionController.apply(this, arguments);
  };
  _.inherits(FilterTogglesController, ToggleCollectionController);


  return FilterTogglesController;
});
