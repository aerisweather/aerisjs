define([
  'aeris/util',
  'aeris/model',
  'aeris/errors/validationerror',
  'aeris/api/operator'
], function(_, Model, ValidationError, Operator) {
  /**
   * Represents a single query property:value
   * definition.
   *
   * @class Query
   * @namespace aeris.api.params.models
   * @extends aeris.Model
   *
   * @constructor
   */
  var Query = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      idAttribute: 'property',
      defaults: {}
    });

    _.defaults(options.defaults, {
      operator: Operator.AND
    });

    /**
     * @attribute property
     * @type {string}
     */
    /**
     * @attribute value
     * @type {*}
     */
    /**
     * The operator to use when
     * appending this query pair onto
     * a chained query.
     *
     * See 'Chaining Queries and Filters':
     *  http://www.hamweather.com/support/documentation/aeris/queries/
     *
     * @attribute operator
     * @type {aeris.api.Operator}
     */

    Model.call(this, opt_attrs, options);

    // Validate on ctor.
    this.isValid();
  };
  _.inherits(Query, Model);


  /**
   * @method validate
   */
  Query.prototype.validate = function(attrs) {
    var validOperators = [Operator.AND, Operator.OR];

    if (!_.isString(attrs.property)) {
      return new ValidationError('property', attrs.property + ' is not a valid query property');
    }
    if (!attrs.value) {
      return new ValidationError('value', 'Value is not defined.');
    }
    if (_.indexOf(validOperators, attrs.operator) === -1) {
      return new ValidationError('operator', attrs.operator + ' is not a valid query operator. ' +
        'Valid operators include: \'' + validOperators.join('\', \'') + '\'.');
    }
  };


  /**
   * Custom toString,
   * for converting to query string.
   *
   * @override
   * @return {string}
   * @method toString
   */
  Query.prototype.toString = function() {
    this.isValid();

    return this.get('property') + ':' + this.get('value');
  };


  return Query;
});
