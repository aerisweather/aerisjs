define([
  'aeris/util',
  'application/form/model/toggle'
], function(_, Toggle) {
  /**
   * Acts as a combined toggle for a set of child toggles.
   * Selecting/deselected a ComboToggle will cause all child
   * toggles to be selected/deselected.
   *
   * Useful for delegating control over several child Toggle models
   * to a master ComboToggle model.
   *
   * Example:
   *  var lights = new Toggle();
   *  var camera = new Toggle();
   *  var action = new ComboToggle({
   *    childToggles: [lights, camera]
   *  });
   *
   *  action.select();    // lights and camera are selected
   *  action.deselect();  // lights and camera are deselected
   *
   *
   * @class aeris.application.form.model.ComboToggle
   * @extends aeris.application.form.model.Toggle
   *
   * @constructor
   * @override
   *
   * @param {string=} opt_options.childTogglesAttribute
   */
  var ComboToggle = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      childTogglesAttribute: 'childToggles'
    });


    /**
     * The name of the combo toggle.
     *
     * @attribute value
     * @type {string}
     */
    /**
     * Array of toggles to be controlled
     * by the ComboToggle.
     *
     * @attribute childToggles
     * @type {Array.<string>}
     */


    /**
     * The attribute which references
     * the toggles to be controlled by the
     * ComboToggle.
     *
     * @type {string}
     * @default 'childToggles'
     * @private
     */
    this.childTogglesAttribute_ = options.childTogglesAttribute;


    Toggle.call(this, opt_attrs, options);


    // Bind ComboToggle to child Toggles
    this.listenTo(this, {
      select: this.selectAll,
      deselect: this.deselectAll
    });
  };
  _.inherits(ComboToggle, Toggle);


  /**
   * Select all child toggles.
   */
  ComboToggle.prototype.selectAll = function() {
    this.invokeAll_('select');
  };


  /**
   * Deselect all child toggles.
   */
  ComboToggle.prototype.deselectAll = function() {
    this.invokeAll_('deselect');
  };


  /**
   * Toggle all child toggles.
   */
  ComboToggle.prototype.toggleAll = function() {
    this.invokeAll_('toggle')
  };


  /**
   * Invoke a method on all
   * child toggles.
   *
   * @param {string} method
   * @private
   */
  ComboToggle.prototype.invokeAll_ = function(method) {
    var childToggles = this.get(this.childTogglesAttribute_);
    _(childToggles).invoke(method);
  };


  return ComboToggle;
});
