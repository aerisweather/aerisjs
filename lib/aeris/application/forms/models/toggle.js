define([
  'ai/util',
  'ai/application/forms/models/attribute',
  'ai/errors/validationerror'
], function(_, Attribute, ValidationError) {
  /**
   * Represents a toggle-able form item.
   *
   * @class Toggle
   * @namespace aeris.application.forms.models
   * @extends aeris.application.forms.models.Attribute
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
     * @param {aeris.builder.maps.core.models.Toggle} model
     */
    /**
     * @event deselect
     * @param {aeris.builder.maps.core.models.Toggle} model
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
