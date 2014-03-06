define([
  'aeris/util',
  'aeris/subsetcollection',
  'aeris/api/collections/aerisapicollection'
], function(_, SubsetCollection, AerisApiCollection) {
  /**
   * A subset of an {aeris.api.collections.AerisApiCollection},
   * which may be manipulated on the client side, without effecting
   * models retrieved from the server.
   *
   * For example, a ClientCollection will filter models based
   * on provided filter params, without removing models from the
   * AerisApiCollection. Since we saved previously stored models,
   * the filter can be changed or removed without needed to request
   * new data from the server.
   *
   * @class AerisApiClientCollection
   * @namespace aeris.api.collections
   * @extends aeris.SubsetCollection
   *
   * @constructor
   * @override
   *
   * @param {Array.<aeris.Model>=} opt_models
   *
   * @param {Object=} opt_options
   * @param {string=} opt_options.endpoint Aeris API endpoint
   * @param {Object|Model=} opt_options.params Parameters with which to query the Aeris API
   * @param {string=} opt_options.server The Aeris API server location
   *
   * @param {number=} clientLimit Max number of models to retain in the client collection
   * @param {function(aeris.api.models.AerisApiModel):Boolean} clientFilter Filter to apply to the client collection.
  */
  var AerisApiClientCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      SourceCollectionType: AerisApiCollection,
      clientLimit: null,
      clientFilter: _.constant(true)
    });

    var aerisApiOptions = _.pick(options, [
      'params',
      'endpoint',
      'action',
      'model',
      'server',
      'SourceCollectionType'
    ]);

    var sourceCollection = this.createSourceCollection_(opt_models, aerisApiOptions);

    var subsetCollectionOptions = {
      limit: options.clientLimit,
      filter: options.clientFilter
    };

    SubsetCollection.call(this, sourceCollection, subsetCollectionOptions);


    this.bindClientFilters_();
    this.updateClientFilters_();
  };
  _.inherits(AerisApiClientCollection, SubsetCollection);


  /**
   * @method createSourceCollection_
   * @private
   * @param {Array.<aeris.Model>} opt_models
   * @param {Object=} options Options to pass to the source collection
   * @param {function():aeris.api.collections.AerisApiCollection} options.SourceCollectionType source collection constructor
   */
  AerisApiClientCollection.prototype.createSourceCollection_ = function(opt_models, options) {
    return new options.SourceCollectionType(opt_models, _.pick(options || {}, [
      'params',
      'endpoint',
      'action',
      'model',
      'server'
    ]));
  };


  /**
   * @method bindClientFilters_
   * @private
   */
  AerisApiClientCollection.prototype.bindClientFilters_ = function() {
    this.listenTo(this.getApiFilters_(), {
      'add remove reset change': this.updateClientFilters_
    });
  };


  /**
   * @method updateClientFilters_
   * @private
   */
  AerisApiClientCollection.prototype.updateClientFilters_ = function() {
    if (this.getApiFilters_().length) {
      this.applyClientFilters_(this.getApiFilters_());
    }
    else {
      this.removeClientFilter();
    }
  };


  /**
   * @method applyClientFilters_
   * @private
   * @param {aeris.api.params.collections.FilterCollection} filterCollection
   */
  AerisApiClientCollection.prototype.applyClientFilters_ = function(filterCollection) {
    this.setClientFilter(function(apiModel) {
      return apiModel.testFilterCollection(filterCollection);
    }, this);
  };


  /**
   * Get the filters used to query the AerisAPI
   *
   * @method getApiFilters_
   * @private
   * @return {aeris.api.params.collections.FilterCollection}
   */
  AerisApiClientCollection.prototype.getApiFilters_ = function() {
    return this.sourceCollection_.getParams().get('filter');
  };


  /**
   * Apply a client-side filter to the collection.
   *
   * @method setClientFilter
   * @param {function():Boolean} filter
   * @param {Object=} opt_ctx Filter context
   */
  AerisApiClientCollection.prototype.setClientFilter = function(filter, opt_ctx) {
    SubsetCollection.prototype.setFilter.call(this, filter, opt_ctx);
  };


  /**
   * Remove all client-side filters from the collection.
   *
   * @method removeClientFilter
   */
  AerisApiClientCollection.prototype.removeClientFilter = function() {
    SubsetCollection.prototype.removeFilter.call(this);
  };


  /**
   * Sets a limit on how many
   *
   * @param limit
   */
  AerisApiClientCollection.prototype.setClientLimit = function(limit) {
    SubsetCollection.prototype.setLimit.call(this, limit);
  };


  /**
   * @method removeClientLimit
   */
  AerisApiClientCollection.prototype.removeClientLimit = function() {
    SubsetCollection.prototype.removeLimit.call(this);
  };


  // Proxy AerisApi methods
  var aerisApiProxyMethods = [
    'getParams',
    'setParams',
    'setFrom',
    'setTo',
    'setBounds',
    'addFilter',
    'removeFilter',
    'resetFilter',
    'addQuery',
    'removeQuery',
    'resetQuery',
    'getQuery'
  ];
  _.each(aerisApiProxyMethods, function(methodName) {
    AerisApiClientCollection.prototype[methodName] = function() {
      return this.sourceCollection_[methodName].apply(this.sourceCollection_, arguments);
    }
  }, this);


  return AerisApiClientCollection;
});
