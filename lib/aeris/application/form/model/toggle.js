define([
  'ai/util',
  'ai/application/form/model/attribute',
  'ai/errors/validationerror'
], function(_, Attribute, ValidationError) {
  /**
   * Represents a toggle-able form item.
   *
   * @class Toggle
   * @namespace aeris.application.form.model
   * @extends aeris.application.form.model.Attribute
   *
   * @constructor
   * @override
   */
  var Toggle = function(opt_attrs, opt_options) {
    /**
     * @attribute selected
     * @type {Boolean}
     * @default false
     */

    /**
     * @event select
     * @param {aeris.builder.maps.core.model.Toggle} model
     */
    /**
     * @event deselect
     * @param {aeris.builder.maps.core.model.Toggle} model
     */

    var attrs = _.defaults(opt_attrs || {}, {
      selected: false
    });

    Attribute.call(this, attrs, opt_options);

    this.listenTo(this, {
      'change:selected': function(model, value, options) {
        var topic = value ? 'select' : 'deselect';
        this.trigger(topic, model, options);
      }
    });
  };
  _.inherits(Toggle, Attribute);


  /**
   * @override
   * @method validate
   */
  Toggle.prototype.validate = function(attrs) {
    if (!_.isBoolean(attrs.selected)) {
      throw new ValidationError('selected', attrs.selected + ' is not a valid boolean.');
    }
  };


  /**
   * Mark as selected.
   * @method select
   */
  Toggle.prototype.select = function() {
    this.set('selected', true);
  };


  /**
   * Mark as not selected.
   * @method deselect
   */
  Toggle.prototype.deselect = function() {
    this.set('selected', false);
  };


  /**
   * Toggle the selected attribute
   * @method toggle
   */
  Toggle.prototype.toggle = function() {
    this.set('selected', !this.get('selected'));
  };


  /**
   * @return {Boolean}
   * @method isSelected
   */
  Toggle.prototype.isSelected = function() {
    return this.get('selected');
  };


  return Toggle;
});
