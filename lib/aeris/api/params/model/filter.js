define([
  'ai/util',
  'ai/model',
  'ai/errors/validationerror'
], function(_, BaseModel, ValidationError) {
  /**
   * Represents a single filter applied
   * to a request to the Aeris API.
   *
   * @class Filter
   * @namespace aeris.api.param.model
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
     * Possible values are 'AND', and 'OR'. Defaults to 'AND'.
     *
     * Note that the filter operator will be used
     * before the filter name. Advanced order-of-operations
     * in filter operators is not currently supported.
     *
     * @attribute operator
     * @type {Boolean}
     * @default 'AND'
     */
    var attrs = _.extend({
      operator: Filter.AND
    }, opt_attrs);

    BaseModel.call(this, attrs, opt_options);

    // Validate when added to a collection
    this.listenTo(this, 'add', function() { this.isValid() });
  };
  _.inherits(Filter, BaseModel);


  /**
   * @override
   */
  Filter.prototype.validate = function(attrs) {
    // Validate operator
    if ([Filter.AND, Filter.OR].indexOf(attrs.operator) === -1) {
      return new ValidationError('Operator', 'Must be either \'AND\' or \'OR\'');
    }
  };


  Filter.AND = 'AND';
  Filter.OR = 'OR';


  return _.expose(Filter, 'aeris.api.Filter');
});
