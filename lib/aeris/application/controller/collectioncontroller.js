define([
  'ai/util',
  'marionette',
  'ai/application/controller/itemcontroller'
], function(_, Marionette, ItemController) {
  var CollectionView = Marionette.CollectionView;
  /**
   * Renders a for bound to a {aeris.Collection}, using a specified
   * {aeris.application.controller.ItemController}
   *
   * See Marionette.CollectionView documentation.
   *
   * @class CollectionController
   * @namespace aeris.application.controller
   * @extends Marionette.CollectionView
   * @implements aeris.application.controller.ControllerInterface
   *
   * @constructor
   */
  var CollectionController = function(options) {
    _.defaults(options, {
      itemView: ItemController
    });

    CollectionView.call(this, options);
  };
  _.inherits(CollectionController, CollectionView);


  return CollectionController;
});
