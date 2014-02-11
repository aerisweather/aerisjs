define([
  'ai/util',
  'marionette',
  'ai/application/forms/collections/togglecollection',
  'ai/application/menus/controllers/menuitemcontroller'
], function(_, Marionette, ToggleCollection, MenuItemController) {
  /**
   * A MenuController
   * - Controls a set of menu items
   * - Menu items can be toggled on or off
   * - Menu items have sub-menu items
   * - Sub-menu items display only when the menu item is toggled on
   * - Sub-menu items can be toggled on or off
   *
   * Think -- "a drop-down menu"
   *
   * @class MenuController
   * @namespace aeris.application.menus.controllers
   * @extends Marionette.CollectionView
   */
  var MenuController = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      itemView: MenuItemController
    });

    /**
     * Accepts a collection in the form of:
     *  {ToggleCollection}
     *    model: {Toggle}
     *      (attr) childCollection: {ToggleCollection}   <-- ad inifinitum
     *
     * @property collection
     * @type {aeris.application.forms.collections.ToggleCollection}
     */

    Marionette.CollectionView.call(this, options);
  };
  _.inherits(MenuController, Marionette.CollectionView);

  return MenuController;
});
