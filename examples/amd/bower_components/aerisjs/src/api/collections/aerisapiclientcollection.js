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
   * @param {string=} opt_options.endpoint Aeris API endpoint.
   * @param {Object|Model=} opt_options.params Parameters with which to query the Aeris API.
   * @param {string=} opt_options.server The Aeris API server location.
   *
   * @param {number=} clientLimit Max number of models to retain in the client collection.
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

    /**
     * A request has been made to fetch
     * data from the Aeris API.
     *
     * @event 'request'
     * @param {aeris.api.mixins.AerisApiBehavior} object Data object making the request.
     * @param {aeris.Promise} promise Promise to fetch data. Resolves with raw data.
     * @param {Object} requestOptions
     */

    /**
     * The AerisAPI has responsed to a request,
     * and the data object has updated with fetched data.
     *
     * @event 'sync'
     * @param {aeris.api.mixins.AerisApiBehavior} object Data object which made the request.
     * @param {Object} resp Raw response data from the AerisAPI.
     * @param {Object} requestOptions
     */
  };
  _.inherits(AerisApiClientCollection, SubsetCollection);


  /**
   * @method createSourceCollection_
   * @private
   * @param {Array.<aeris.Model>} opt_models
   * @param {Object=} options Options to pass to the source collection.
   * @param {function():aeris.api.collections.AerisApiCollection} options.SourceCollectionType source collection constructor.
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
   * @param {Object=} opt_ctx Filter context.
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
   * @param {number} limit
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



  /**
   * Returns the params object
   * used to fetch collection data.
   *
   * @return {aeris.api.params.models.Params}
   * @method getParams
   */
  /**
   * Updates the requests params
   * included with API requests.
   *
   * @param {string|Object} key Param name. First argument can also.
   *                    be a key: value hash.
   * @param {*} value Param value.
   * @method setParams
   */
  /**
   * @method setFrom
   * @param {Date} from
   */
  /**
   * @method setTo
   * @param {Date} to
   */
  /**
   * @method setLimit
   * @param {number} limit
   */
  /**
   * @method setBounds
   * @param {aeris.maps.Bounds} bounds
   */
  /**
   * Add a filter to the Aeris API request.
   * Filters will also be applied client-side, if possible.
   *
   * @method addFilter
   * @param {string|Array.<string>|aeris.api.params.models.Filter|aeris.api.params.collections.FilterCollection} filter
   * @param {Object=} opt_options
   * @param {aeris.api.Operator} opt_options.operator
   */
  /**
   * Remove a filter from the Aeris API request.
   * Filters will also be applied client-side, if possible.
   *
   * @method removeFilter
   * @param {string|Array.<string>|aeris.api.params.models.Filter|aeris.api.params.collections.FilterCollection} filter
   * @param {Object=} opt_options
   */
  /**
   * Reset a filter from the Aeris API request.
   * Filters will also be applied client-side, if possible.
   *
   * @method resetFilter
   * @param {string|Array.<string>|aeris.api.params.models.Filter|aeris.api.params.collections.FilterCollection} opt_filter
   * @param {Object=} opt_options
   * @param {aeris.api.Operator} opt_options.operator
   */
  /**
   * Add a query term to Aeris API request.
   *
   * @method addQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>} query
   * @param {Object=} opt_options
   */
  /**
   * Remove a query from the Aeris API request
   *
   * @method removeQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>|string|Array.<string>} query model(s), or property (key).
   * @param {Object=} opt_options
   */
  /**
   * Resets the query for the Aeris API request.
   *
   * @method resetQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>=} opt_query
   * @param {Object=} opt_options
   */
  /**
   * Returns the query for the Aeris API request.
   *
   * @method getQuery
   * @return {aeris.api.params.collections.ChainedQueries}
   */
  /**
   * Fetch data from the Aeris API.
   *
   * @method fetch
   * @override
   * @return {aeris.Promise} Resolves with API response.
   */

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
    };
  }, this);


  return AerisApiClientCollection;
});
