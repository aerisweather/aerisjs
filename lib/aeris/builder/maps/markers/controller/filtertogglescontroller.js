define([
  'aeris/util',
  'application/form/controller/togglecollectioncontroller'
], function(_, ToggleCollectionController) {
  /**
   *
   * @class aeris.builder.maps.markers.controller.FilterTogglesController
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
