define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/validationerror'
], function(_, Model, ValidationError) {
  /**
   * Represents a single item on a form.
   * Has a value and a label.
   *
   * @class Attribute
   * @namespace aeris.application.forms.models
   * @extends aeris.Model
   *
   * @constructor
   * @override
   */
  var Attribute = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      idAttribute: 'value'
    });

    /**
     * @attribute value
     * @type {*}
     */
    /**
     * @attribute label
     * @type {string}
     */

    Model.call(this, opt_attrs, options);
  };
  _.inherits(Attribute, Model);


  /**
   * @method normalize_
   */
  Attribute.prototype.normalize_ = function(attrs) {
    // Set label to value,
    // if  no label is set
    if (attrs.value && !this.get('label')) {
      attrs.label = attrs.value;
    }

    return attrs;
  };


  return Attribute;
});
