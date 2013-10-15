define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/validationerror'
], function(_, BaseModel, ValidationError) {
  /**
   * Represents a single filter applied
   * to a request to the Aeris API.
   *
   * @class aeris.api.param.model.Filter
   * @extends aeris.Model
   *
   * @param {Object=} opt_options
   * @param {Array.<string>} opt_options.validFilters
   *                         A list of valid filter names.
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
     */
    var attrs = _.extend({
      operator: 'AND'
    }, opt_attrs);

    var options = _.extend({
      validFilters: null
    }, opt_options);


    /**
     * A list of valid filter names.
     * @type {Array.<string>}
     *
     * @private
     */
    this.validFilters_ = options.validFilters;

    BaseModel.call(this, attrs, options);

    // Force immediate validation
    this.isValid();
  };
  _.inherits(Filter, BaseModel);


  /**
   * @override
   */
  Filter.prototype.validate = function(attrs) {
    // If validFilters is defined,
    // check that filter name is valid.
    if (this.validFilters_ && this.validFilters_.indexOf(attrs.name) === -1) {
      return new ValidationError('Filter name', 'Must be one of the following' +
        this.validFilters_.toString()
      );
    }

    // Validate operator
    if (['AND', 'OR'].indexOf(attrs.operator) === -1) {
      return new ValidationError('Operator', 'Must be either \'AND\' or \'OR\'');
    }
  };


  return Filter;
});
