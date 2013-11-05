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
    this.transitionIn_();
  };


  MarkerDataController.prototype.remove = function() {
    this.transitionOut_(400, function() {
      // Wait to actually remove the element
      // until closing transition is complete.
      ItemController.prototype.remove.call(this);
    }, this);
  };


  /**
   * Transition in the view..
   *
   * @param {number} opt_duration Animation duration, in milliseconds.
   * @param {Function=} opt_cb Callback. Invoked when transition is complete.
   * @param {Object=} opt_ctx Context for callback
   *
   * @private
   */
  MarkerDataController.prototype.transitionIn_ = function(opt_duration, opt_cb, opt_ctx) {
    this.$el.hide();

    this.transitionUsing_('slideDown', opt_duration, opt_cb, opt_ctx);

    return this;
  };


  /**
   * @override
   */
  MarkerDataController.prototype.transitionOut_ = function(opt_duration, opt_cb, opt_ctx) {
    this.transitionUsing_('slideUp', opt_duration, opt_cb, opt_ctx);

    return this;
  };


  return MarkerDataController;
});
