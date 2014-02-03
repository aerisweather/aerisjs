define([
  'ai/util',
  'ai/model',
  'ai/promise',
  'ai/api/params/model/params',
  'ai/errors/invalidargumenterror',
  'ai/errors/apiresponseerror'
], function(_, Model, Promise,  Params, InvalidArgumentError, ApiResponseError) {
  /**
   * @class AerisApiBehavior
   * @namespace aeris.api.endpoint.mixin
   */
  return {
    /**
     * @protected
     * @param {Object|Model} opt_params
     * @return {aeris.api.params.model.Params}
     */
    createParams_: function(opt_params) {
      return (opt_params instanceof Model) ?
        opt_params : new Params(opt_params, { validate: true });
    },

    /**
     * @return {aeris.Model|aeris.Collection} Params query attribute
     */
    getQuery: function() {
      return this.params_.get('query');
    },

    /**
     * Returns the params object
     * used to fetch collection data.
     *
     * @return {aeris.api.params.model.Params}
     */
    getParams: function() {
      return this.params_;
    },

    /**
     * Updates the query params
     * included with API requests.
     *
     * @param {string|Object} key Param name. First argument can also
     *                    be a key: value hash.
     * @param {*} value Param value.
     */
    setParams: function() {
      // Delegate to AerisApiParams#set
      var args = Array.prototype.slice.call(arguments, 0);
      args.push({ validate: true });

      this.params_.set.apply(this.params_, args);
    },

    /**
     * Add a filter to the query parameters
     *
     * Takes the same arguments as
     * aeris.api.model.AerisApiParams#setFilter
     */
    setFilter: function() {
      this.params_.setFilter.apply(this.params_, arguments);
    },

    /**
     * Remove a filter from the query parameters
     *
     * Takes the same arguments as
     * aeris.api.model.AerisApiParams#unsetFilter
     */
    unsetFilter: function() {
      this.params_.unsetFilter.apply(this.params_, arguments);
    },

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
    sync: function(method, model, opt_options) {
      var data;
      var promise = new Promise();
      var options = _.defaults(opt_options || {}, {
        success: function() {
        },
        error: function() {
        },
        complete: function() {
        }
      });

      // Restrict requests to be read-only
      if (method !== 'read') {
        throw new InvalidArgumentError('Unable to send a ' + method + ' request ' +
          'to the Aeris API. The Aeris API is read-only');
      }

      // Trigger start of request,
      // as specified in Backbone docs,
      // and implemented by original sync method.
      this.trigger('request', this);

      data = this.params_.toJSON();


      this.jsonp_.get(this.getEndpointUrl_(), data, _.bind(function(res) {
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
    },

    /**
     * @protected
     * @return {string}
     */
    getEndpointUrl_: function() {
      return _.compact([
        this.server_,
        this.endpoint_,
        this.action_
      ]).join('/') + '/';
    },

    /**
     * Handle errors returned by the
     * Aeris API.
     *
     * @throws {aeris.errors.APIResponseError}
     *
     * @param {Object} res Response object.
     * @private
     */
    handleRequestError_: function(res) {
      var error = res.error;

      if (!error || !error.code || !error.description) {
        errorMsg = 'Unknown error';
      }
      else {
        errorMsg = error.description + '[' + error.code + ']';
      }

      throw new ApiResponseError('Unable to fetch data from Aeris API: ' + errorMsg);
    },


    /**
     * See Backbone.Collection#parse
     *
     * @override
     */
    parse: function(res) {
      return res.response ? res.response : res;
    }
  }
});