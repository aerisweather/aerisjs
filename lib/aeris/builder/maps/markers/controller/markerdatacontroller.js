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


  MarkerDataController.prototype.onRender = function() {
    this.$el.hide();

    // This little magic fixes
    // Marionette's clunky onRender animations.
    _.defer(_.bind(this.transitionIn_, this));
  };


  MarkerDataController.prototype.remove = function() {
    var proto_remove = _.bind(function() {
      ItemController.prototype.remove.call(this);
    }, this);

    this.$el.slideUp(400, proto_remove);
  };


  /**
   * Transition in element.
   * @private
   */
  MarkerDataController.prototype.transitionIn_ = function() {
    this.$el.slideDown();
  };


  return MarkerDataController;
});
