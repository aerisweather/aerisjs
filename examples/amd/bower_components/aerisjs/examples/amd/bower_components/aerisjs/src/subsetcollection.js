define([
  'aeris/util',
  'aeris/collection',
  'aeris/promise',
  'aeris/errors/invalidargumenterror'
], function(_, Collection, Promise, InvalidArgumentError) {
  /**
   * A collection which acts as a subset of another (source) collection.
   *
   * A SubsetCollection defines rules for filtering models
   * from a source collection. The SubsetCollection will sync to all
   * changes in the source collection. If filtered rules are changed on the
   * SubsetCollection, it will be updated with models from the soure collection
   * accordingly
   *
   * @class SubsetCollection
   * @namespace aeris
   * @extends aeris.Collection
   *
   * @constructor
   *
   * @param {aeris.Collection|Array.<aeris.Model>} sourceCollection
   *
   * @param {Object=} opt_options
   * @param {number=} opt_options.limit
   * @param {function():Boolean} opt_options.filter
   *
   * @throws {aeris.errors.InvalidArgumentError} If an invalid sourceCollection is provided.
  */
  var SubsetCollection = function(sourceCollection, opt_options) {
    var options = _.defaults(opt_options || {}, {
      limit: null,
      filter: SubsetCollection.NON_FILTER_
    });

    /**
     * @type {aeris.Collection}
     * @protected
     */
    this.sourceCollection_ = this.normalizeSourceCollection_(sourceCollection);


    /**
     * @property limit_
     * @protected
     * @type {?number} If null, no limit is enforced.
    */
    this.limit_ = options.limit;


    /**
     * @property filter_
     * @private
     * @type {function():Boolean}
    */
    this.filter_ = options.filter;


    Collection.call(this, this.getFilteredSourceModels_(), options);

    this.bindToSourceCollection_();
    this.proxyRequestEvents_();
  };
  _.inherits(SubsetCollection, Collection);


  /**
   * @method normalizeSourceCollection_
   * @private
   */
  SubsetCollection.prototype.normalizeSourceCollection_ = function(sourceCollection) {
    if (sourceCollection instanceof Collection) {
      return sourceCollection;
    }
    if (_.isArray(sourceCollection)) {
      return new Collection(sourceCollection);
    }

    throw new InvalidArgumentError(sourceCollection + ' is not a valid source collection');
  };


  /**
   * @method proxyRequestEvents_
   * @private
   */
  SubsetCollection.prototype.proxyRequestEvents_ = function() {
    this.listenTo(this.sourceCollection_, {
      request: function(collection, promiseToSync) {
        this.trigger('request', collection, promiseToSync);
      },
      sync: function(collection, resp) {
        this.trigger('sync', collection, resp);
      },
      error: function(collection, resp) {
        this.trigger('error', collection, resp);
      }
    });
  };


  /**
   * @method bindToSourceCollection_
   * @private
   */
  SubsetCollection.prototype.bindToSourceCollection_ = function() {
    this.listenTo(this.sourceCollection_, {
      'add remove reset change sort': this.syncToSourceModel_
    });
  };


  /**
   * @method syncToSourceModel_
   * @private
   */
  SubsetCollection.prototype.syncToSourceModel_ = function() {
    this.set(this.getFilteredSourceModels_());
  };


  /**
   * @method getFilteredSourceModels_
   * @protected
   * @return {Array.<aeris.Model>} Models from the source collection
   *                              which pass subset filtering rules.
   */
  SubsetCollection.prototype.getFilteredSourceModels_ = function() {
    var filteredSourceModels = this.sourceCollection_.filter(this.filter_);
    var limit = _.isNull(this.limit_) ? filteredSourceModels.length : this.limit_;

    return filteredSourceModels.slice(0, limit);
  };


  /**
   * @method getSourceCollection
   * @return {aeris.Collection}
   */
  SubsetCollection.prototype.getSourceCollection = function() {
    return this.sourceCollection_;
  };


  /**
   * Sets a filter to be used when syncing the
   * SubsetCollection to it's source collection.
   *
   * The filter receives a source collection models
   * as an argument.
   * If the filter returns true, the model will be added
   * to the SubsetCollection.
   *
   * @method setFilter
   * @param {function(aeris.Model):Boolean} filter
   * @param {Object=} opt_ctx Context to set on filter function.
   */
  SubsetCollection.prototype.setFilter = function(filter, opt_ctx) {
    this.filter_ = filter;

    if (opt_ctx) {
      this.filter_ = _.bind(this.filter_, opt_ctx);
    }

    this.syncToSourceModel_();
  };


  /**
   * Stops filtering models from the source collection.
   *
   * @method removeFilter
   */
  SubsetCollection.prototype.removeFilter = function() {
    this.filter_ = SubsetCollection.NON_FILTER_;

    this.syncToSourceModel_();
  };


  /**
   * Limits the number of models from the source collection
   * to set on the SubsetCollection.
   *
   * @method setLimit
   * @param {number} limit
   */
  SubsetCollection.prototype.setLimit = function(limit) {
    this.limit_ = limit;

    this.syncToSourceModel_();
  };


  /**
   * Stops limiting the number of models from
   * the source collection to set on the SubsetCollection.
   *
   * @method removeLimit
   */
  SubsetCollection.prototype.removeLimit = function() {
    this.limit_ = null;

    this.syncToSourceModel_();
  };


  /**
   * Does the collection have fewer models
   * than the specified limit?
   *
   * If no limit is set, this will always
   * return true.
   *
   * @method isUnderLimit
   * @return {Boolean}
   */
  SubsetCollection.prototype.isUnderLimit = function() {
    return _.isNull(this.limit_) || this.length < this.limit_;
  };


  /**
   * Fetches data from the underlying source collection.
   *
   * @method fetch
   * @param {Object=} opt_options
   * @return {aeris.Promise}
   */
  SubsetCollection.prototype.fetch = function(opt_options) {
    return this.sourceCollection_.fetch(opt_options);
  };


  /**
   * Filter which does not reject any
   * models.
   *
   * @method
   * @private
   * @static
   */
  SubsetCollection.NON_FILTER_ = _.constant(true);

  return SubsetCollection;
});
