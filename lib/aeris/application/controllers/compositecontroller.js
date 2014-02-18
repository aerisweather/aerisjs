define([
  'aeris/util',
  'marionette',
  'aeris/application/controllers/mixins/viewmixin'
], function(_, Marionette, ViewMixin) {
  /**
   * Aeris wrapper around Marionette.CompositeView
   *
   * @class CompositeController
   * @namespace aeris.application.controllers
   * @extends Marionette.CompositeView
   * @mixes aeris.application.controllers.ViewMixin
   *
   * @constructor
   * @override
  */
  var CompositeController = function(options) {
    /**
     * See Marionette.View#ui.
     *
     * @type {Object.<string,string>}
     * @property ui
     */
    this.ui = _.defaults(options.ui, this.ui);


    /**
     * See Marionette.View#events.
     *
     * @type {Object.<string,string>}
     * @property events
     */
    this.events = _.defaults(options.events, this.events);

    Marionette.CompositeView.call(this, options);
  };
  _.inherits(CompositeController, Marionette.CompositeView);
  _.extend(CompositeController.prototype, ViewMixin);


  return CompositeController;
});
