define([
  'aeris/util',
  'vendor/marionette',
  'hbars!application/menu/view/menuitem.html'
], function(_, Marionette, menuItemView) {
  /**
   * A MenuItemController
   * - Binds to a {aeris.application.form.model.Toggle} model
   * - The sub-menu corresponds to the Toggle model's childCollection attribute
   * - The sub-menu is a MenuController
   *
   * @class aeris.application.menu.controller.MenuItemController
   * @extends Marionette.CompositeView
   *
   * @constructor
   * @override
   *
   * @param {string} opt_options.childCollectionAttribute
   */
  var MenuItemController = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      className: 'aeris-menuItem',
      template: menuItemView,
      itemViewContainer: '.aeris-subMenu'
    });

    /**
     * @property model
     * @type {aeris.application.form.model.RecursiveToggle}
     */

    /**
     * MenutItemController creates a recursive view structure.
     *
     * That is, for every model in it's collection, it
     * renders a new instance of itself.
     *
     * @property itemView
     * @type {aeris.application.menu.controller.MenuItemController}
     */


    /**
     * The attribute of the model which defines
     *                  its child collection.
     *                  Defaults to 'childCollection'.
     *
     * @type {string}
     * @default 'childCollection'
     * @private
     */
    this.childCollectionAttribute_ = options.childCollectionAttribute_;


    Marionette.CompositeView.call(this, options);
  };
  _.inherits(MenuItemController, Marionette.CompositeView);


  /**
   * @override
   */
  MenuItemController.prototype.initialize = function() {
    // Define our collection as a child collection
    // of the model.
    this.collection = this.model.getChildCollection();
  };


  return MenuItemController;
});
