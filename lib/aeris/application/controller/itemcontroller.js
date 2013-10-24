define([
  'aeris/util',
  'vendor/marionette'
], function(_, Marionette) {
  /**
   * An aeris extension of a Marionette.ItemView
   *
   * @class aeris.application.controller.ItemController
   * @extends Marionette.ItemView
   *
   * @constructor
   * @override
   *
   * @param {Object.<string,string>=} opt_options.ui See Marionette.ItemView#ui.
   * @param {Object.<string,string>=} opt_options.events See Marionette.ItemView#events.
   */
  var ItemController = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      ui: {},
      events: {}
    });

    /**
     * See Marionette.ItemView#ui.
     *
     * @type {Object.<string,string>}
     */
    this.ui = options.ui;


    /**
     * See Marionette.ItemView#events.
     *
     * @type {Object.<string,string>}
     */
    this.events = options.events;

    Marionette.ItemView.call(this, options);
  };
  _.inherits(ItemController, Marionette.ItemView);


  return ItemController;
});
