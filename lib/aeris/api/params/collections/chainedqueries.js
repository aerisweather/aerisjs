define([
  'aeris/util',
  'aeris/collection',
  'aeris/api/params/models/query',
  'aeris/api/operator'
], function(_, Collection, Query, Operator) {
  /**
   * A collection of {aeris.api.params.models.Query} objects,
   * which may be chained together with an operator.
   *
   * See 'Chained Queries and Filters':
   *  http://www.hamweather.com/support/documentation/aeris/queries/
   *
   * @class ChainedQueries
   * @namespace aeris.api.params.collections
   * @extends aeris.Collection
   *
   * @constructor
   * @override
  */
  var ChainedQueries = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Query
    });

    Collection.call(this, opt_models, options);
  };
  _.inherits(ChainedQueries, Collection);


  /**
   * Custom toString method,
   * or query-stringification.
   *
   * @override
   * @method toString
   */
  ChainedQueries.prototype.toString = function() {
    var operatorLookup = {};
    operatorLookup[Operator.AND] = ',';
    operatorLookup[Operator.OR] = ';';

    return this.reduce(function(memo, query, i) {
      var operator = operatorLookup[query.get('operator')];

      // Add operator,
      // (just not for the first prop:value pair.
      if (i !== 0) {
        memo = memo + operator;
      }

      return memo + query.toString();
    }, '', this);
  };


  return ChainedQueries;
});
