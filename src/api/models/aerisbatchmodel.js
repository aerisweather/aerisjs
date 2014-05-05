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
   * @param {Object=} opt_attrs
   * @param {Object=} opt_options
   * @param {Object.<string,aeris.api.models.AerisApiModel>} opt_options.models See addModels documentation.
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
    });
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
    return this.values().filter(function(attr) {
      return attr instanceof AerisApiModel;
    });
  };


  /**
   * @method getEncodedEndpoints_
   * @private
   * @param {Array.<aeris.api.models.AerisApiModel>} apiModels
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
    var params = model.getParams().toJSON();
    var paramsStr = _.map(params, function(val, key) {
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


  return AerisBatchModel;
});
