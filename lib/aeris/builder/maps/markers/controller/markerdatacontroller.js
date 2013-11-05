define([
  'aeris/util',
  'application/controller/itemcontroller'
], function(_, ItemController) {
  /**
   * Controls the marker details view.
   *
   * @class aeris.builder.maps.markers.controller.MarkerDataController
   * @extends aeris.application.controller.ItemController
   *
   * @constructor
   * @override
   *
   * @param {string|Function} options.template Required.
   */
  var MarkerDataController = function(options) {
    /**
     * @property model
     * @type {aeris.api.PointData}
     */


    ItemController.call(this, options);
  };
  _.inherits(MarkerDataController, ItemController);


  return MarkerDataController;
});
