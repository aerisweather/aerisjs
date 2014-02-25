define([
  'aeris/util',
  'aeris/collection',
  'aeris/errors/invalidargumenterror'
], function(_, Collection, InvalidArgumentError) {
  /**
   *
   *
   * @class FilteredCollection
   * @namespace aeris
   * @extends aeris.Collection
   *
   * @constructor
   */
  var FilteredCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      filter: _.bind(_.identity, this)
    });

    /**
     * @property filter_
     * @private
     * @type {function(aeris.Model):Boolean}
    */
    this.filter_ = options.filter;


    /**
     * @property sourceCollection_
     * @private
     * @type {aeris.Collection}
    */
    this.sourceCollection_ = options.source;


    Collection.call(this, opt_models, options);

    this.ensureSourceCollection_();

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
      throw new InvalidArgumentError(this.sourceCollection_ + ' is not' +
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
