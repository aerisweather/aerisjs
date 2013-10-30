define([
  'aeris/util',
  'application/controller/layoutcontroller',
  'hbs!application/form/view/checkbox.html'
], function(_, LayoutController, toggleView) {
  /**
   * A ToggleController is a simple checkbox bound to a
   * Toggle model.
   *
   * @class aeris.application.form.controller.ToggleController
   * @extends aeris.application.controller.LayoutController
   *
   * @param {Object=} options
   * @param {string=} options.template Toggle view UI template.
   * @param {aeris.application.form.model.Toggle} options.model Required.
   *
   * @constructor
   */
  var ToggleController = function(options) {
    options = _.defaults(options, {
      template: toggleView,
      events: {
        'change input': this.updateModel_
      },
      ui: {
        selectBtn: 'input'
      }
    });

    /**
     * @property model
     * @type {aeris.application.form.model.Toggle}
     */

    LayoutController.call(this, options);

    // Bind model to view
    this.listenTo(this.model, 'change', this.render);
  };
  _.inherits(ToggleController, LayoutController);


  /**
   * Update our model to
   * match UI control values.
   *
   * @private
   */
  ToggleController.prototype.updateModel_ = function() {
    var isSelected = this.ui.selectBtn.prop('checked');
    this.model.set('selected', isSelected);
  };


  return ToggleController;
});
