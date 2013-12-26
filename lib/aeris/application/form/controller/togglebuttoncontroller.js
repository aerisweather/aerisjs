define([
  'aeris/util',
  'application/controller/itemcontroller',
  'application/form/model/toggle',
  'hbars!application/form/view/button.html'
], function(_, ItemView, Toggle, view) {
  /**
   * A ToggleButtonController:
   * - Has either an on or an off state
   * - Updates the 'btn' ui element with 'selected' and 'desselected' classes
   * - Binds to a {aeris.application.form.model.Toggle} model
   *
   * Think -- "a checkbox"
   *
   * @class aeris.application.form.controller.ToggleButtonController
   * @extends aeris.application.controller.ItemController
   *
   * @constructor
   * @override
   */
  var ToggleButtonController = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      selectedClass: 'aeris-selected',
      deselectedClass: 'aeris-deselected',
      model: new Toggle(),
      template: view,
      ui: {
        btn: 'a'
      },
      events: {
        'click a': function(evt) {
          this.model.toggle();

          evt.preventDefault();
          return false;
        }
      },
      tagName: 'span'
    });

    /**
     * @property model
     * @type {aeris.application.form.model.Toggle}
     */

    /**
     * The class to apply to the elements
     * when it is marked as selected.
     *
     * @type {string}
     * @private
     */
    this.selectedClass_ = options.selectedClass;

    /**
     * The class to apply to the elements
     * when it is marked as deselected.
     *
     * @type {string}
     * @private
     */
    this.deselectedClass_ = options.deselectedClass;


    ItemView.call(this, options);


    this.listenTo(this.model, {
      'change:selected': this.updateUI_
    });

    this.listenTo(this, {
      // Update the UI when we render
      render: this.updateUI_
    });
  };
  _.inherits(ToggleButtonController, ItemView);


  /**
   * Update the UI to match the model's selected state.
   * @private
   */
  ToggleButtonController.prototype.updateUI_ = function() {
    var isSelected = this.model.get('selected');

    if (isSelected) {
      this.ui.btn.addClass(this.selectedClass_);
      this.ui.btn.removeClass(this.deselectedClass_);
    }
    else {
      this.ui.btn.addClass(this.deselectedClass_);
      this.ui.btn.removeClass(this.selectedClass_);
    }
  };


  return ToggleButtonController;
});
