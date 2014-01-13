define([
  'aeris/util',
  'vendor/marionette',
  'application/controller/mixin/viewmixin'
], function(_, Marionette, ViewMixin) {
  /**
   * Aeris wrapper around Marionette.CompositeView
   *
   * @class aeris.application.controller.CompositeController
   * @extends Marionette.CompositeView
   * @mixes aeris.application.controller.ViewMixin
   *
   * @constructor
   * @override
  */
  var CompositeController = function(options) {
    /**
     * See Marionette.View#ui.
     *
     * @type {Object.<string,string>}
     */
    this.ui = _.defaults(options.ui, this.ui);


    /**
     * See Marionette.View#events.
     *
     * @type {Object.<string,string>}
     */
    this.events = _.defaults(options.events, this.events);

    Marionette.CompositeView.call(this, options);
  };
  _.inherits(CompositeController, Marionette.CompositeView);
  _.extend(CompositeController.prototype, ViewMixin);


  return CompositeController;
});
