define([
  'aeris/util',
  'aeris/model',
  'errors/validationerror'
], function(_, BaseModel, ValidationError) {
  /**
   * A simple model differs from a standard {aeris.Model} in that
   * it only contains a single value.
   *
   * For example:
   *  var model = new SimpleModel('foo');
   *  model.toJSON();   // 'foo'
   *  model.set('bar');
   *  model.toJSON();   // 'bar'
   *
   * This may seem useless in itself, but has more power
   * when incorporated with a {aeris.SimpleCollection}
   *
   * @class aeris.SimpleModel
   * @extends aeris.Model
   *
   * @param {*} opt_value
   * @param {Object} opt_options
   * @constructor
   */
  var SimpleModel = function(opt_value, opt_options) {
    /**
     * @attribute value
     * @type {*}
     */

    var attrs = {};

    if (!_.isUndefined(opt_value)) {
      attrs.value = opt_value;
    }

    BaseModel.call(this, opt_value, opt_options);
  };
  _.inherits(SimpleModel, BaseModel);


  /**
   * @override
   */
  SimpleModel.prototype.validate = function(attrs) {
    var keys = _.keys(attrs);

    if (_.without(keys, 'value').length) {
      return new ValidationError('A PrimitiveModel may only contain a ' +
        'single \'value\' attribute');
    }
  };


  /**
   * @override
   *
   * @param {*} value
   * @param {Object} options
   */
  SimpleModel.prototype.set = function(value, options) {
    BaseModel.prototype.set.call(this, {
      value: value
    }, options);
  };


  /**
   * @return {*} The model value.
   */
  SimpleModel.prototype.getValue = function() {
    return this.get('value');
  };


  return SimpleModel;
});
