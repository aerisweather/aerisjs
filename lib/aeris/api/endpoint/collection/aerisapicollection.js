define([
  'aeris/util',
  'aeris/collection',
  'aeris/model',
  'api/params/model/params',
  'aeris/promise',
  'aeris/jsonp',
  'aeris/errors/invalidargumenterror',
  'aeris/errors/apiresponseerror',
  'aeris/aerisapi'
], function(_, BaseCollection, Model, ApiParams, Promise, JSONP, InvalidArgumentError, ApiResponseError) {
  /**
   * A data collection which creates {aeris.Model} objects
   * from Aeris API response data.
   *
   * See http://www.hamweather.com/support/documentation/aeris/
   * for Aeris API documentation.
   *
   * @class aeris.api.collection.AerisApiCollection
   * @extends aeris.Collection
   *
   *
   * @constructor
   * @param {Object=} opt_models
   *
   * @param {Object=} opt_options
   * @param {Array.<AerisAPIEndpoint>=} opt_options.endpoints
   * @param {Object=} opt_options.params
   * @param {aeris.AerisApi=} AerisApi object used for fetching batch data.
   */
  var AerisApiCollection = function(opt_models, opt_options) {
    var options = _.extend({
      endpoint: '',
      action: '',
      params: {},
      server: 'http://api.aerisapi.com/'
    }, opt_options);


    /**
     * Aeris API Endpoints from which
     * to request data.
     *
     * See http://www.hamweather.com/support/documentation/aeris/endpoints/
     * for available endpoints, actions, and parameters.
     *
     * @type {string}
     * @private
     */
    this.endpoint_ = options.endpoint;

    this.action_ = options.action;


    this.server_ = options.server;


    /**
     * Parameters to include with the batch request.
     *
     * Note that parameters can also be attached
     * to individual endpoints defined in this.endpoints_.
     *
     * @type {aeris.api.params.model.Params|Object}
     *       Will be converted to Params instance, if passed in as a plain object.
     * @protected
     */
    this.params_ = (options.params instanceof ApiParams) ?
                   options.params :
                   new ApiParams(options.params, { validate: true });


    /**
     * The api for fetching AerisApi batch data.
     * Must define a fetchBatch method.
     *
     * Option provided for dependency injection.
     *
     * @type {aeris.AerisAPI}
     * @private
     */
    this.jsonp_ = options.jsonp || JSONP;


    BaseCollection.call(this, opt_models, options);
  };
  _.inherits(AerisApiCollection, BaseCollection);


  /**
   * Returns the params object
   * used to fetch collection data.
   *
   * @return {aeris.api.params.model.Params}
   */
  AerisApiCollection.prototype.getParams = function() {
    return this.params_;
  };


  /**
   * Updates the query params
   * included with API requests.
   *
   * Note that changes to the collection's query parameters
   * will trigger the collection to fetch new data from the API.
   *
   * @param {string|Object} key Param name. First argument can also
   *                    be a key: value hash.
   * @param {*} value Param value.
   */
  AerisApiCollection.prototype.setParams = function(key, value) {
    // Delegate to AerisApiParams#set
    var args = Array.prototype.slice.call(arguments, 0);
    args.push({ validate: true });

    this.params_.set.apply(this.params_, args);
  };


  /**
   * Add a filter to the query parameters
   *
   * Takes the same arguments as
   * aeris.api.model.AerisApiParams#setFilter
   */
  AerisApiCollection.prototype.setFilter = function() {
    this.params_.setFilter.apply(this.params_, arguments);
  };


  /**
   * Remove a filter from the query parameters
   *
   * Takes the same arguments as
   * aeris.api.model.AerisApiParams#unsetFilter
   */
  AerisApiCollection.prototype.unsetFilter = function() {
    this.params_.unsetFilter.apply(this.params_, arguments);
  };


  /**
   * Overrides Backbone.sync
   * to introduce logic for fetching
   * data from the Aeris API
   *
   * Note that the AerisAPI is read-only.
   *
   * @throws {aeris.errors.InvalidArgumentError} If a non-read request is made.
   * @return {aeris.Promise} Resolves with response data.
   *
   * @override
   */
  AerisApiCollection.prototype.sync = function(method, model, opt_options) {
    var url, data;
    var promise = new Promise();
    var options = _.extend({
      success: function() {},
      error: function() {},
      complete: function() {}
    }, opt_options);

    // Restrict requests to be read-only
    if (method !== 'read') {
      throw new InvalidArgumentError('Unable to send a ' + method + ' request ' +
        'to the Aeris API. The Aeris API is read-only');
    }

    // Trigger start of request,
    // as specified in Backbone docs,
    // and implemented by original sync method.
    this.trigger('request', this);

    url = this.server_ +
      this.endpoint_ + '/' +
      this.action_ + '/';

    data = this.params_.toJSON();


    this.jsonp_.get(url, data, _.bind(function(res) {
      if (!res.success) {
        promise.reject(res);
      }
      else {
        promise.resolve(res);
        this.trigger('sync', this, res);
      }
    }, this));


    return promise.
      done(options.success).
      fail(options.error).
      always(options.complete).
      fail(this.handleRequestError_, this);
  };


  /**
   * Handle errors returned by the
   * Aeris API.
   *
   * @throws {aeris.errors.APIResponseError}
   *
   * @param {Object} res Response object.
   * @private
   */
  AerisApiCollection.prototype.handleRequestError_ = function(res) {
    var error = res.error;

    if (!error || !error.code || !error.description) {
      errorMsg = 'Unknown error';
    }
    else {
      errorMsg = error.description + '[' + error.code + ']';
    }

    throw new ApiResponseError('Unable to fetch data from Aeris API: ' + errorMsg);
  };


  /**
   * See Backbone.Collection#parse
   *
   * @override
   */
  AerisApiCollection.prototype.parse = function(res) {
    return res.response;
  };


  return AerisApiCollection;
});
