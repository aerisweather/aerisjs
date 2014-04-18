define([
  'aeris/util',
  'marionette',
  'aeris/application/forms/controllers/togglebuttoncontroller',
  'aeris/application/forms/collections/radiocollection'
], function(_, Marionette, ToggleButtonController, RadioCollection) {
  /**
   * Controls a view where only one item can be selected
   * at a time (eg. a radio input)
   *
   * @class RadioController
   * @namespace aeris.application.form
   * @extends Marionette.CollectionView
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_options
   *
   * @param {Marionette.View} opt_options.itemView
   *        Defaults to aeris.application.forms.controllers.ToggleButtonController .
   */
  var RadioController = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      itemView: ToggleButtonController,
      collection: new RadioCollection()
    });

    /**
     * @property collection
     * @type {aeris.application.forms.collections.RadioCollection}
     */

    Marionette.CollectionView.call(this, options);
  };
  _.inherits(RadioController, Marionette.CollectionView);


  return RadioController;
});
