define([
  'aeris/util',
  'aeris/collection',
  'aeris/api/params/models/filter',
  'aeris/api/operator'
], function(_, BaseCollection, Filter, Operator) {
  /**
   * Represents a set of filters to include in
   * a request to the AerisAPI
   *
   * @class FilterCollection
   * @namespace aeris.api.params.collections
   * @extends aeris.Collection
   *
   * @constructor
   *
   * @param {Array.<string>} opt_options.validFilters
   *                         A list of valid filters.
   *
   */
  var FilterCollection = function(opt_filters, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Filter
    });


    BaseCollection.call(this, opt_filters, options);
  };
  _.inherits(FilterCollection, BaseCollection);


  /**
   * Prepares the filtercollection to be used
   * as for the `filter` parameters in a Aeris API
   * request query string.
   *
   * @override
   * @method toString
   */
  FilterCollection.prototype.toString = function() {
    var str = '';

    this.each(function(filter, n) {
      var operator = this.operatorToString_(filter.get('operator'));

      // First filter doesn't use operator
      if (n === 0) {
        str += filter.get('name');
        return;
      }

      str += operator + filter.get('name');
    }, this);

    return str;
  };


  /**
   * Encodes an {aeris.api.Operator} to be used in an AerisApi
   * query request. See http://www.hamweather.com/support/documentation/aeris/queries/.
   *
   * @method operatorToString_
   * @param {aeris.api.Operator} operator
   * @return {string}
   * @private
   */
  FilterCollection.prototype.operatorToString_ = function(operator) {
    var operatorMap = {};
    operatorMap[Operator.AND] = ',';
    operatorMap[Operator.OR] = ';';

    return operatorMap[operator];
  };


  /**
   * Provides an alternate syntax for aeris.Collection#add,
   * which allows adding filters by name.
   *
   * eg.
   *  filters.add('sieve', 'colander', { operator: aeris.api.Operator.OR });
   *
   * @param {string|Array.<string>|aeris.api.params.filter.Filter|Array.<aeris.api.params.filter.Filter>} filters
   *        Filter name(s), or Filter model(s).
   * @param {Object=} opt_options
   * @param {aeris.api.Operator} opt_options.operator
   *
   * @override
   * @method add
   */
  FilterCollection.prototype.add = function(filters, opt_options) {
    var options = opt_options || {};
    options.reset = false;

    this.addFiltersByName_(filters, options);
  };

  /**
   * Provides an alternate syntax for aeris.Collection#reset,
   * which allows adding filters by name.
   *
   * eg.
   *  filters.reset('sieve', 'colander', { operator: aeris.api.Operator.AND });
   *
   * @param {string|Array.<string>|aeris.api.params.filter.Filter|Array.<aeris.api.params.filter.Filter>} filters
   *        Filter name(s), or Filter model(s).
   * @param {Object=} opt_options
   * @param {string} opt_options.operator This operator will be applied to all filters.
   *
   * @override
   * @method reset
   */
  FilterCollection.prototype.reset = function(filters, opt_options) {
    var options = opt_options || {};
    options.reset = true;

    this.addFiltersByName_(filters, options);
  };


  /**
   * Adds a filter or array of filters by name,
   * or delegates to aeris.Collection#add or aeris.Collection#reset
   *
   * @param {string|Array.<string>|aeris.api.params.filter.Filter|Array.<aeris.api.params.filter.Filter>} filters
   *
   * @param {Object} options
   * @param {string=} options.operator This operator will be applied to all filters.
   * @param {Boolean} options.reset If true, will use aeris.Collection#reset to add the models.
   * @private
   * @method addFiltersByName_
   */
  FilterCollection.prototype.addFiltersByName_ = function(filters, options) {
    var addMethod, modelsToAdd = [];

    // Set default options
    options = _.extend({
      operator: Operator.AND,
      reset: false
    }, options);

    // Use either 'add' or 'reset' method
    addMethod = options.reset ? 'reset' : 'add';

    // Normalize filters param as array
    _.isArray(filters) || _.isUndefined(filters) || (filters = [filters]);

    // Standard parameters --> delegate to parent Collection#add
    if (!filters || !_.isString(filters[0])) {
      return BaseCollection.prototype[addMethod].call(this, filters);
    }


    // Create filter models
    _.each(filters, function(filterName) {
      modelsToAdd.push({
        name: filterName,
        operator: options.operator
      });
    }, this);

    // Call the parent method (add or reset) with the generated models.
    return BaseCollection.prototype[addMethod].call(this, modelsToAdd, options);
  };


  /**
   * Allows to remove filters by name, in addition
   * to standard aeris.Collection#remove syntax.
   *
   * @param {string|Array.<string>|aeris.api.params.filter.Filter|Array.<aeris.api.params.filter.Filter>} filters
   *        Filter name(s), or Filter model(s).
   * @method remove
   */
  FilterCollection.prototype.remove = function(filters, opt_options) {
    var modelsToRemove = [];

    // Normalize filters as array
    _.isArray(filters) || (filters = [filters]);

    // Standard parameters --> delegate to parent Collection#remove
    if (!_.isString(filters[0])) {
      return BaseCollection.prototype.remove.apply(this, arguments);
    }

    // Find models with matching filter names
    _.each(filters, function(filterName) {
      var matches = this.where({
        name: filterName
      });
      modelsToRemove = modelsToRemove.concat(matches);
    }, this);

    return BaseCollection.prototype.remove.call(this, modelsToRemove, opt_options);
  };


  return FilterCollection;
});
