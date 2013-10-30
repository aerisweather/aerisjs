define([
  'aeris/util',
  'application/controller/layoutcontroller',
  'hbs!mapbuilder/core/view/toggle.html'
], function(_, LayoutController, toggleView) {
  /**
   * The MapObjectToggleController controls a toggle UI view (eg. a checkbox or radio),
   * to add and remove items from the application state.
   *
   * @class aeris.builder.maps.core.controller.MapObjectToggleController
   * @extends aeris.application.controller.LayoutController
   *
   * @param {Object=} opt_options
   * @param {string} opt_options.template Toggle view UI template.
   * @param {aeris.builder.maps.core.collection.MapObjectStateCollection} opt_options.stateItems
   *
   * @constructor
   */
  var MapObjectToggleController = function(opt_options) {
    var options = _.extend({
      template: toggleView,
      events: {
        'change input': this.updateModel_
      },
      ui: {
        selectBtn: 'input'
      }
    }, opt_options);

    /**
     * @property model
     * @type {aeris.application.form.model.Toggle}
     */

    LayoutController.call(this, options);

    // Bind model to view
    this.listenTo(this.model, 'change', this.render);

    this.on('render', function() {
      //debugger;
    }, this);
  };
  _.inherits(MapObjectToggleController, LayoutController);


  /**
   * Update our model to
   * match UI control values.
   *
   * @private
   */
  MapObjectToggleController.prototype.updateModel_ = function() {
    var isSelected = this.ui.selectBtn.prop('checked');
    this.model.set('selected', isSelected);
  };


  return MapObjectToggleController;
});
