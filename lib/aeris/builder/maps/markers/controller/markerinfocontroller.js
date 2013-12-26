define([
  'aeris/util',
  'application/controller/itemcontroller',
  'application/templatehelpers/i18n'
], function(_, ItemController, i18n) {
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
    options = _.defaults(options || {}, {
      templateHelpers: {
        i18n: i18n
      }
    });


    ItemController.call(this, options);
  };
  _.inherits(MarkerInfoController, ItemController);


  return MarkerInfoController;
});
