define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/validationerror'
], function(_, Model, ValidationError) {
  /**
   * Represents a single item on a form.
   * Has a value and a label.
   *
   * @class aeris.application.form.model.Attribute
   * @extends aeris.Model
   *
   * @constructor
   * @override
   */
  var Attribute = function(opt_attrs, opt_options) {
    /**
     * @attribute value
     * @type {*}
     */
    /**
     * @attribute label
     * @type {string}
     */
    Model.call(this, opt_attrs, opt_options);
  };
  _.inherits(Attribute, Model);


  /**
   * @override
   */
  Attribute.prototype.validate = function(attrs) {
    if (!_.isUndefined(attrs.value)) {
      return new ValidationError('value', 'value must be defined');
    }
    if (attrs.label && !_.isString(attrs.label)) {
      return new ValidationError('label', 'label must be string');
    }
  };


  return Attribute;
});
