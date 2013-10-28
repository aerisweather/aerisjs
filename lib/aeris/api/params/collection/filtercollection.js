define([
  'aeris/util',
  'aeris/collection',
  'api/params/model/filter'
], function(_, BaseCollection, Filter) {
  /**
   * Represents a set of filters to include in
   * a request to the AerisAPI
   *
   * @class aeris.api.param.collection.FilterCollection
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
      model: Filter,
      validFilters: []
    });


    /**
     * A list of valid filters.
     *
     * @type {Array.<string>}
     *
     * @private
     */
    this.validFilters_ = options.validFilters;


    BaseCollection.call(this, opt_filters, options);
  };
  _.inherits(FilterCollection, BaseCollection);


  /**
   * Prepares the filtercollection to be used
   * as for the `filter` parameters in a Aeris API
   * request query string.
   *
   * @override
   */
  FilterCollection.prototype.toString = function() {
    var str = '';

    this.each(function(filter, n) {
      var operator = ({
        AND: ',',
        OR: ';'
      })[filter.get('operator')];

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
   * Provides an alternate syntax for aeris.Collection#add,
   * which allows adding filters by name.
   *
   * eg.
   *  filters.add('sieve', 'colander', { operator: 'AND' });
   *
   * @param {string|Array.<string>|aeris.api.params.filter.Filter|Array.<aeris.api.params.filter.Filter>} filters
   *        Filter name(s), or Filter model(s).
   * @param {Object=} opt_options
   * @param {string} opt_options.operator This operator will be applied to all filters.
   *
   * @override
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
   *  filters.reset('sieve', 'colander', { operator: 'AND' });
   *
   * @param {string|Array.<string>|aeris.api.params.filter.Filter|Array.<aeris.api.params.filter.Filter>} filters
   *        Filter name(s), or Filter model(s).
   * @param {Object=} opt_options
   * @param {string} opt_options.operator This operator will be applied to all filters.
   *
   * @override
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
   */
  FilterCollection.prototype.addFiltersByName_ = function(filters, options) {
    var addMethod, modelsToAdd = [];

    // Set default options
    options = _.extend({
      operator: 'AND',
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


  /**
   * Returns a list of available filters for the collection's
   * Aeris API endpoint.
   */
  FilterCollection.prototype.getValidFilters = function() {
    // return a safe copy
    return Array.prototype.slice.call(this.validFilters_, 0);
  };


  return FilterCollection;
});
