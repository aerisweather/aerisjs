define([
  'aeris/util',
  'aeris/collection',
  'api/params/model/query'
], function(_, Collection, Query) {
  /**
   * A collection of {aeris.api.params.model.Query} objects,
   * which may be chained together with an operator.
   *
   * See 'Chained Queries and Filters':
   *  http://www.hamweather.com/support/documentation/aeris/queries/
   *
   * @class aeris.api.params.collection.ChainedQuery
   * @extends aeris.Collection
   *
   * @constructor
   * @override
  */
  var ChainedQuery = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Query
    });

    Collection.call(this, opt_models, options);
  };
  _.inherits(ChainedQuery, Collection);


  /**
   * Custom toString method,
   * or query-stringification.
   *
   * @override
   */
  ChainedQuery.prototype.toString = function() {
    var operatorLookup = {};
    operatorLookup[Query.AND] = ',';
    operatorLookup[Query.OR] = ';';

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


  return ChainedQuery;
});
