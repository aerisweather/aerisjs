define([
  'aeris/util',
  'aeris/model',
  'aeris/config',
  'aeris/JSONP',
  'aeris/Promise',
  'aeris/errors/apiresponseerror'
], function(_, Model, config, JSONP, Promise, ApiResponseError) {
  /**
   * A client-side representation of a single response object
   * from the Aeris API.
   *
   * @class aeris.api.endpoint.model.AerisApiModel
   * @extends aeris.Model
   *
   * @constructor
   * @override
  */
  var AerisApiModel = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      endpoint: '',
      jsonp: JSONP,
      server: 'http://api.aerisapi.com/'
    });


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


    /**
     * The locatin of the aeris API server.
     *
     * @type {string}
     * @private
     * @default 'http://api.aerisapi.com'
     */
    this.server_ = options.server;


    /**
     * The JSONP utility for fetching AerisApi data.
     *
     * @type {aeris.JSONP}
     * @private
     */
    this.jsonp_ = options.jsonp || JSONP;


    Model.call(this, opt_attrs, options);
  };
  _.inherits(AerisApiModel, Model);


  /**
   * Fetch model data
   * from the Aeris API.
   *
   * @override
   * @throws {aeris.errors.InvalidArgumentError} If a non-read request is made.
   * @return {aeris.Promise} Resolved with response data.
   */
  AerisApiModel.prototype.sync = function(method, model, opt_options) {
    var url, request;
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

    // Can only fetch data if we have a ID
    // to fetch from
    if (_.isUndefined(this.id)) {
      throw new Error('Unable to fetch data: model does define an id.');
    }

    // Trigger start of request,
    // as specified in Backbone docs,
    // and implemented by original sync method.
    this.trigger('request', this);

    url = this.server_ +
      this.endpoint_ + '/' +
      this.id;

    request = {
      client_id: config.get('apiId'),
      client_secret: config.get('apiSecret')
    };


    if (!request.client_id || !request.client_secret) {
      throw new Error('Unable to fetch data: client id and secret must be defined');
    }


    this.jsonp_.get(url, request, _.bind(function(res) {
      if (!res.success) {
        promise.reject(res);
      }
      else {
        this.trigger('sync', this, res);
        promise.resolve(res);
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
  AerisApiModel.prototype.handleRequestError_ = function(res) {
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
   * See Backbone.Model#parse
   *
   * @override
   */
  AerisApiModel.prototype.parse = function(data) {
    return data.response ? data.response : data;
  };


  return AerisApiModel;
});
