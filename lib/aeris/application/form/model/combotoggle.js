define([
  'aeris/util',
  'application/form/model/toggle',
  'aeris/collection',
  'aeris/errors/validationerror'
], function(_, Toggle, Collection, ValidationError) {
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

    var attrs = opt_attrs || {};


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
     * @type {Array.<aeris.application.form.model.Toggle>}
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

    attrs[this.childTogglesAttribute_] || (attrs[this.childTogglesAttribute_] = [])


    Toggle.call(this, attrs, options);


    // Bind ComboToggle to child Toggles
    this.listenTo(this, {
      select: this.selectAll,
      deselect: this.deselectAll
    });
  };
  _.inherits(ComboToggle, Toggle);


  /**
   * @override
   */
  ComboToggle.prototype.validate = function(attrs) {
    if (attrs[this.childTogglesAttribute_] && !this.isValidToggles(attrs[this.childTogglesAttribute_])) {
      return new ValidationError(this.childTogglesAttribute, 'Child toggles attribute' +
        'must be an array of Toggle models');
    }
  };


  /**
   * Validates an array of Toggle models.
   *
   * @param {*} toggles
   * @return {Boolean}
   */
  ComboToggle.prototype.isValidToggles = function(toggles) {
    var isValid = true;

    if (!_.isArray(toggles)) { return false; }

    _.each(toggles, function(toggle) {
      if (!(toggle instanceof Toggle)) {
        isValid = false;
      }
    }, this);

    return isValid;
  };


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
    _(this.getChildToggles()).invoke(method);
  };


  ComboToggle.prototype.getChildToggles = function() {
    return this.get(this.childTogglesAttribute_);
  };


  /**
   * Add a set of toggles to the combo toggle,
   * to be controlled as child toggles.
   *
   * @param {Array.<Toggle>|aeris.application.form.collection.ToggleCollection} toggles
   */
  ComboToggle.prototype.addToggles = function(toggles) {
    var uniqueToggles;

    // Normalize ToggleCollection as array
    toggles = (toggles instanceof Collection) ? toggles.models : toggles;

    uniqueToggles = _.difference(toggles, this.getChildToggles());

    this.set(this.childTogglesAttribute_, this.getChildToggles().concat(uniqueToggles));
  };


  return ComboToggle;
});
