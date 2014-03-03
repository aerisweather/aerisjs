define([
  'aeris/util',
  'aeris/collection',
  'aeris/errors/invalidargumenterror'
], function(_, Collection, InvalidArgumentError) {
  /**
   * A FilteredCollection acts as a subset of some
   * 'source' collection. It is bound to the models in it's
   * source collection, though only models which pass a
   * defined filter will be set on the FilteredCollection.
   *
   * @class FilteredCollection
   * @namespace aeris
   * @extends aeris.Collection
   *
   * @constructor
   * @override
   *
   * @param {Array.<aeris.Model>=} opt_models
   *
   * @param {Object=} opt_options
   * @param {function():Boolean} opt_options.filter The filter to use when binding to the source collection.
   */
  var FilteredCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      filter: function() { return true; }
    });


    /**
     * @property sourceCollection_
     * @private
     * @type {aeris.Collection}
    */
    this.sourceCollection_ = options.source;


    Collection.call(this, opt_models, options);


    this.ensureSourceCollection_();

    this.setFilter(options.filter);

    this.updateModelsFromSource_();
    this.bindToSourceCollection_();
  };
  _.inherits(FilteredCollection, Collection);


  /**
   * Filters the collection, using models from the
   * source collection.
   *
   * Filter will continue to be used when keeping the
   * FilteredCollection in sync with its source collection.
   *
   * @method setFilter
   * @param {function(aeris.Model):Boolean} filter
   * @param {Object=} opt_ctx Context for filter function.
  */
  FilteredCollection.prototype.setFilter = function(filter, opt_ctx) {
    var ctx = opt_ctx || this;

    this.filter_ = _.bind(filter, ctx);

    this.updateModelsFromSource_();
  };


  /**
   * @method ensureSourceCollection_
   * @private
   * @throws {aeris.errors.InvalidArgumentError}
  */
  FilteredCollection.prototype.ensureSourceCollection_ = function() {
    if (!(this.sourceCollection_ instanceof Collection)) {
      throw new InvalidArgumentError(this.sourceCollection_ + ' is not ' +
        'a valid source for a FilteredCollection');
    }
  };


  /**
   * @method bindToSourceCollection_
   * @private
  */
  FilteredCollection.prototype.bindToSourceCollection_ = function() {
    this.listenTo(this.sourceCollection_, {
      'add remove reset': this.updateModelsFromSource_
    });
  };


  /**
   * @method updateModelsFromSource_
   * @private
  */
  FilteredCollection.prototype.updateModelsFromSource_ = function() {
    var filteredModels = this.sourceCollection_.filter(this.filter_);

    this.set(filteredModels);
  };


  return FilteredCollection;
});
