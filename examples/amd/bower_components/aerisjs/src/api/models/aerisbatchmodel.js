define([
  'aeris/util',
  'aeris/api/models/aerisapimodel',
  'aeris/errors/apiresponseerror'
], function(_, AerisApiModel, ApiResponseError) {
  /**
   * Represents data from multiple Aeris API endpoints
   * combined into a single model.
   *
   * Note that AerisBatchModel does not currently support
   * per-model actions or queries.
   *
   * @class AerisBatchModel
   * @namespace aeris.api.models
   * @extends aeris.api.models.AerisApiModel
   *
   * @constructor
   * @override
   *
   * @param {Object=} opt_attrs Set models as attribute values to enable batch requests.
   * @param {Object=} opt_options
   *
   * @param {aeris.api.params.Params} opt_options.params
   */
  var AerisBatchModel = function(opt_attrs, opt_options) {
    /**
     * A list of nested models, in the order of the last
     * API requests.
     *
     * @property modelsInOrder_
     * @type {Array.<aeris.api.models.AerisApiModel>}
     * @private
     */
    this.modelsInOrder_ = [];

    AerisApiModel.call(this, opt_attrs, opt_options);
  };
  _.inherits(AerisBatchModel, AerisApiModel);


  /**
   * @method getEndpointUrl_
   * @protected
   * @return {string}
   */
  AerisBatchModel.prototype.getEndpointUrl_ = function() {
    return _.compact([
      this.server_,
      'batch',
      this.id
    ]).join('/');
  };


  /**
   * @method serializeParams_
   * @protected
   * @param {aeris.api.params.models.Params} params
   * @return {Object}
   */
  AerisBatchModel.prototype.serializeParams_ = function(params) {
    // Save models in order,
    // so that we can parse the response based
    // on the order of the `responses` array
    // (because javascript does not necessarily maintain order in objects)
    this.modelsInOrder_ = this.getNestedModels_();

    return _.extend(params.toJSON(), {
      requests: this.getEncodedEndpoints_(this.modelsInOrder_)
    }, this.getApiKeyParams_());
  };


  /**
   * Return component models, which
   * are attributes of the batch model.
   *
   * @method getNestedModels_
   * @private
   * @return {Array.<aeris.api.models.AerisApiModel>}
   */
  AerisBatchModel.prototype.getNestedModels_ = function() {
    return this.values().filter(this.isModel_.bind(this));
  };


  /**
   * @method isModel_
   * @private
   * @param {Object} obj
   * @return {Boolean}
   */
  AerisBatchModel.prototype.isModel_ = function(obj) {
    return obj instanceof AerisApiModel;
  };


  /**
   * @method getEncodedEndpoints_
   * @private
   * @param {Array.<aeris.api.models.AerisApiModel>} apiModels
   * @return {string}
   */
  AerisBatchModel.prototype.getEncodedEndpoints_ = function(apiModels) {
    var requests = apiModels.map(function(model) {
      var endpoint = '/' + model.getEndpoint();

      return [
        endpoint,
        this.encodeModelParams_(model)
      ].join(encodeURIComponent('?'));
    }, this);

    return requests.join(',');
  };


  /**
   * @method encodeModelParams_
   * @private
   * @param {aeris.api.models.AerisApiModel} model
   * @return {string} Encoded model params.
   */
  AerisBatchModel.prototype.encodeModelParams_ = function(model) {
    var paramsStr;
    var params = model.getParams().toJSON();

    this.removeApiKeysFromParams_(params);

    paramsStr = _.map(params, function(val, key) {
      return key + '=' + val;
    }).join('&');

    return this.encodeParamsString_(paramsStr);
  };


  /**
   * @method encodeParamsString_
   * @private
   */
  AerisBatchModel.prototype.encodeParamsString_ = function(string) {
    // Aeris API only needs ? and & encoded.
    return string.
      replace('?', '%3F').
      replace('&', '%26');
  };


  /**
   * It is likely that each model contains idential
   * client_id/client_secret params. This will result in the
   * params being serialized into the query string for every model.
   *
   * For batch queries with many model, this could potentially
   * exceed the url limit.
   *
   * @method removeApiKeysFromParams_
   * @private
   * @param {Object} serializedParams
   */
  AerisBatchModel.prototype.removeApiKeysFromParams_ = function(serializedParams) {
    delete serializedParams.client_id;
    delete serializedParams.client_secret;
  };


  /**
   * Find the Aeris client_id and client_secret params
   * by searching through component models.
   *
   * @method getApiKeyParams_
   * @private
   * @return {Object}
   */
  AerisBatchModel.prototype.getApiKeyParams_ = function() {
    var apiKeyParams = {};

    this.modelsInOrder_.some(function(model) {
      apiKeyParams = model.getParams().pick('client_id', 'client_secret');

      // Stop looping once we've found the params.
      return apiKeyParams.client_id && apiKeyParams.client_secret;
    }, this);

    return apiKeyParams;
  };


  /**
   * @method isSuccessResponse_
   * @param {Object} res
   * @protected
   * @return {Boolean}
   */
  AerisBatchModel.prototype.isSuccessResponse_ = function(res) {
    var isBatchSuccess = !!res && res.success;
    if (!isBatchSuccess) {
      return false;
    }

    return res.response.responses.every(function(r) {
      return !!r && r.success;
    });
  };


  /**
   * @method createErrorFromResponse_
   * @protected
   * @param {Object} res
   * @return {Error}
   */
  AerisBatchModel.prototype.createErrorFromResponse_ = function(res) {
    var isTopLevelError = !!res.error;

    if (isTopLevelError) {
      return AerisApiModel.prototype.createErrorFromResponse_.call(this, res);
    }

    return res.response.responses.reduce(function(lastError, response) {
      var error;

      if (lastError || !response.error) {
        return lastError;
      }

      error = AerisApiModel.prototype.createErrorFromResponse_.call(this, response);

      // Temporary fix for Aeris API bug:
      // -- incorrect code for 'invalid_location' error when
      //    using batch requests.
      if (response.error.description === 'The requested location was not found.') {
        error.code = 'invalid_location';
      }

      return error;
    }, void 0);
  };


  /**
   * Sets batch response data onto nested models
   *
   * @override
   * @method parse
   * @param {Object} raw Raw response data.
   * @return {Object}
   */
  AerisBatchModel.prototype.parse = function(raw) {
    try {
      var responses = raw.response.responses;

      this.modelsInOrder_.forEach(function(model, index) {
        this.updateModelWithResponseData_(model, responses[index]);
      }, this);
    }
    catch (e) {
      throw new ApiResponseError('Unable to parse batch response data: ' +
        e.message);
    }

    return this.attributes;
  };


  /**
   * @method updateModelWithResponseData_
   * @private
   * @param {aeris.api.models.AerisApiModel} model
   * @param {Object} data Response data
   */
  AerisBatchModel.prototype.updateModelWithResponseData_ = function(model, data) {
    var modelAttrs = model.parse(data);
    model.set(modelAttrs);
  };


  /**
   * @method toJSON
   * @return {Object}
   */
  AerisBatchModel.prototype.toJSON = function() {
    var json = AerisApiModel.prototype.toJSON.call(this);

    // toJSON'ify nested models
    _.each(json, function(val, key) {
      if (val instanceof AerisApiModel) {
        json[key] = val.toJSON();
      }
    });

    return json;
  };


  /**
   * Clear data from each model.
   *
   * @override
   */
  AerisBatchModel.prototype.clear = function() {
    this.keys().forEach(function(attr) {
      var value = this.get(attr);

      // Clear our all nested models
      if (this.isModel_(value)) {
        value.clear();
      }

      // Remove regular attributes
      else {
        this.unset(attr);
      }
    }, this);
  };


  return AerisBatchModel;
});
