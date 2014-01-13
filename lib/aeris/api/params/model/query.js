define([
  'aeris/util',
  'aeris/model',
  'errors/validationerror'
], function(_, Model, ValidationError) {
  /**
   * Represents a single query property:value
   * definition.
   *
   * @class aeris.api.params.model.Query
   * @extends aeris.Model
   *
   * @constructor
   */
  var Query = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      idAttribute: 'property'
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
     * Valid values are Query.AND, Query.OR.
     *
     * See 'Chaining Queries and Filters':
     *  http://www.hamweather.com/support/documentation/aeris/queries/
     *
     * @attribute operator
     * @type {Query.AND|Query.OR}
     */

    Model.call(this, opt_attrs, options);

    // Validate on ctor.
    this.isValid();
  };
  _.inherits(Query, Model);


  /**
   * @override
   */
  Query.prototype.validate = function(attrs) {
    var validOperators = [Query.AND, Query.OR];

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
   */
  Query.prototype.toString = function() {
    this.isValid();

    return this.get('property') + ':' + this.get('value');
  };


  Query.AND = 'AND';
  Query.OR = 'OR';

  return Query;
});
