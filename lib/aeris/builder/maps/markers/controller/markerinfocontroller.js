define([
  'aeris/util',
  'application/controller/itemcontroller'
], function(_, ItemController) {
  /**
   * Controls the marker details view.
   *
   * @class aeris.builder.maps.markers.controller.MarkerInfoController
   * @extends aeris.application.controller.ItemController
   *
   * @constructor
   * @override
   *
   * @param {string|Function} options.template Required.
   */
  var MarkerInfoController = function(options) {
    /**
     * @property model
     * @type {aeris.api.PointData}
     */


    ItemController.call(this, options);
  };
  _.inherits(MarkerInfoController, ItemController);


  return MarkerInfoController;
});
