define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/validationerror',
  'aeris/api/operator'
], function(_, BaseModel, ValidationError, Operator) {
  /**
   * Represents a single filter applied
   * to a request to the Aeris API.
   *
   * @class Filter
   * @namespace aeris.api.params.models
   * @extends aeris.Model
   *
   * @param {Object=} opt_options
   * @constructor
   */
  var Filter = function(opt_attrs, opt_options) {
    /**
     * The name of the filter.
     *
     * @attribute name
     */
    /**
     * Operator to use when querying with multiple filters.
     *
     * Note that the filter operator will be used
     * before the filter name. Advanced order-of-operations
     * in filter operators is not currently supported.
     *
     * @attribute operator
     * @type {aeris.api.Operator}
     * @default {aeris.api.Operator.AND}
     */
    var attrs = _.extend({
      operator: Operator.AND
    }, opt_attrs);

    BaseModel.call(this, attrs, opt_options);

    // Validate when added to a collection
    this.listenTo(this, 'add', function() { this.isValid() });
  };
  _.inherits(Filter, BaseModel);


  /**
   * @method validate
   */
  Filter.prototype.validate = function(attrs) {
    // Validate operator
    if ([Operator.AND, Operator.OR].indexOf(attrs.operator) === -1) {
      return new ValidationError('Operator', 'Must be an aeris.api.Operator.');
    }
  };


  return _.expose(Filter, 'aeris.api.params.models.Filter');
});
