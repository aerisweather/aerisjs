define([
  'aeris/util',
  'aeris/application/controllers/layoutcontroller',
  'hbars!aeris/application/forms/views/checkbox.html',
  'aeris/application/templatehelpers/i18n'
], function(_, LayoutController, toggleView, i18n) {
  /**
   * A ToggleController is a simple checkbox bound to a
   * Toggle model.
   *
   * @class ToggleController
   * @namespace aeris.application.forms.controllers
   * @extends aeris.application.controllers.LayoutController
   *
   * @param {Object=} options
   * @param {string=} options.template Toggle view UI template.
   * @param {aeris.application.forms.models.Toggle} options.model Required.
   * @param {string} options.selectedClass
   * @param {string} options.deselectedClass
   *
   * @constructor
   */
  var ToggleController = function(options) {
    options = _.defaults(options, {
      template: toggleView,
      selectedClass: 'aeris-selected',
      deselectedClass: 'aeris-deselected',
      events: {
        'change input': this.updateModel_
      },
      ui: {
        selectBtn: 'input'
      },
      handlebarsHelpers: {
        i18n: i18n
      }
    });

    /**
     * @property model
     * @type {aeris.application.forms.models.Toggle}
     */


    /**
     * Class to set on the view when
     * the toggle is selected.
     *
     * @type {string}
     * @private
     * @default 'selected'
     * @property selectedClass_
     */
    this.selectedClass_ = options.selectedClass;


    /**
     * Class to set on the view when
     * the toggle is not.
     *
     * @type {string}
     * @private
     * @default 'deselected'
     * @property deselectedClass_
     */
    this.deselectedClass_ = options.deselectedClass;

    LayoutController.call(this, options);

    // Bind model to view
    this.listenTo(this.model, 'change', this.render);

    this.listenTo(this.model, 'change:selected', this.updateSelectedClass_);
    this.updateSelectedClass_();
  };
  _.inherits(ToggleController, LayoutController);


  /**
   * Update our model to
   * match UI control values.
   * @method updateModel_
   */
  ToggleController.prototype.updateModel_ = function() {
    var isSelected = this.ui.selectBtn.prop('checked');
    this.model.set('selected', isSelected);
  };


  /**
   * Toggle the model.
   * @method toggleModel
   */
  ToggleController.prototype.toggleModel = function() {
    this.model.toggle();
  };


  ToggleController.prototype.updateSelectedClass_ = function() {
    var selectedClass = this.model.get('selected') ? this.selectedClass_ : this.deselectedClass_;

    this.$el.removeClass([this.selectedClass_, this.deselectedClass_].join(' '));
    this.$el.addClass(selectedClass);
  };


  return ToggleController;
});
