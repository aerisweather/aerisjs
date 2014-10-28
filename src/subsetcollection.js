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
   * @class aeris.SubsetCollection
   * @extends aeris.Collection
   *
   * @constructor
   *
   * @param {aeris.Collection|Array.<aeris.Model>} sourceCollection
   *
   * @param {Object=} opt_options
   * @param {?number=} opt_options.limit
   * @param {?function():Boolean=} opt_options.filter
   *
   * @throws {aeris.errors.InvalidArgumentError} If an invalid sourceCollection is provided.
   */
  var SubsetCollection = function(sourceCollection, opt_options) {
    var options = _.defaults(opt_options || {}, {
      limit: null,
      filter: null
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
     * @type {?function():Boolean}
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
      'reset change sort': this.resetToSourceModel_,

      remove: function(model, sourceCollection, options) {
        var subsetModels;

        if (this.contains(model)) {
          // Remove the corresponding subsetCollection model
          this.remove(model);

          // If we freed up some room by removing that model,
          // and the next available model from the source collection.
          if (this.limit_ && this.isUnderLimit()) {
            subsetModels = this.getFilteredSourceModels_();
            this.add(_.last(subsetModels));
          }
        }
      },

      add: function(model, sourceCollection, options) {
        var wasModelAppended, filteredSourceModels;
        var doesAddedModelPassFilter = _.isNull(this.filter_) || this.filter_(model);

        // Model doesn't pass our filter, so
        // we're just going to pretend this never happened...
        if (!doesAddedModelPassFilter) {
          return;
        }

        // Model was appended to the end of the source collection
        // --> we can append it onto our collection.
        wasModelAppended = _.isUndefined(options.at);
        if (wasModelAppended && this.isUnderLimit()) {
          this.add(model);
        }

        // Model was added in the middle of the sourceCollection
        // so we need to make sure to add it in the right spot
        else {
          filteredSourceModels = this.getFilteredSourceModels_();

          if (_.contains(filteredSourceModels, model)) {
            // Add the model at the correct index
            this.add(model, {
              at: filteredSourceModels.indexOf(model)
            });

            // Remove the model which was pushed over the limit
            if (this.isOverLimit()) {
              this.pop();
            }
          }
        }
      }
    });
  };


  /**
   * @method resetToSourceModel_
   * @private
   */
  SubsetCollection.prototype.resetToSourceModel_ = function() {
    this.set(this.getFilteredSourceModels_());
  };


  /**
   * @method getFilteredSourceModels_
   * @protected
   * @return {Array.<aeris.Model>} Models from the source collection
   *                              which pass subset filtering rules.
   */
  SubsetCollection.prototype.getFilteredSourceModels_ = function() {
    var filteredSourceModels = _.isNull(this.filter_) ?
      this.sourceCollection_.models :
      this.sourceCollection_.filter(this.filter_);

    var limit = _.isNull(this.limit_) ? filteredSourceModels.length : this.limit_;
    var limitedModels = filteredSourceModels.slice(0, limit);
    return limitedModels;
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
   * Set the filter to null to disable filtering.
   *
   * @method setFilter
   * @param {function(aeris.Model):Boolean} filter
   * @param {Object=} opt_ctx Context to set on filter function.
   */
  SubsetCollection.prototype.setFilter = function(filter, opt_ctx) {
    this.filter_ = filter;

    if (opt_ctx && !_.isNull(filter)) {
      this.filter_ = _.bind(this.filter_, opt_ctx);
    }

    this.resetToSourceModel_();
  };


  /**
   * Stops filtering models from the source collection.
   *
   * @method removeFilter
   */
  SubsetCollection.prototype.removeFilter = function() {
    this.setFilter(null);

    this.resetToSourceModel_();
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

    this.resetToSourceModel_();
  };


  /**
   * Stops limiting the number of models from
   * the source collection to set on the SubsetCollection.
   *
   * @method removeLimit
   */
  SubsetCollection.prototype.removeLimit = function() {
    this.limit_ = null;

    this.resetToSourceModel_();
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
   * @method isOverLimit
   * @return {Boolean}
   */
  SubsetCollection.prototype.isOverLimit = function() {
    var isAtLimit = this.length === this.sourceCollection_.length;

    return !this.isUnderLimit() && !isAtLimit;
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


  return SubsetCollection;
});
