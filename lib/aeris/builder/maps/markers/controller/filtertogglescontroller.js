define([
  'ai/util',
  'ai/application/form/controller/togglecollectioncontroller'
], function(_, ToggleCollectionController) {
  /**
   *
   * @class FilterTogglesController
   * @namespace aeris.builder.maps.markers.controller
   * @extends aeris.application.form.controller.ToggleCollectionController
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
