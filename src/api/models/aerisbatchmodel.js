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
   * @param {Array.<aeris.api.models.AerisApiModel>} opt_options.models Models to add to the batch.
   * @param {aeris.api.params.Params} opt_options.params
   */
  var AerisBatchModel = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      models: []
    });

    this.models_ = [];

    AerisApiModel.call(this, opt_attrs, options);

    options.models.forEach(function(model) {
      this.addModel(model);
    }, this);
  };
  _.inherits(AerisBatchModel, AerisApiModel);


  /**
   * @method addModel
   * @param {aeris.api.models.AerisApiModel} model
   */
  AerisBatchModel.prototype.addModel = function(model) {
    this.models_.push(model);
  };


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
    var requests = this.models_.map(function(model) {
      return '/' + model.getEndpoint();
    });

    return _.extend(params.toJSON(), {
      requests: requests.join(',')
    });
  };


  /**
   * Parses data from all batch responses into a
   * single attributes object.
   *
   * If indivual model responses share attributes,
   * attributes will take precendence based on the order
   * in which each model was added (later takes precedence).
   *
   * @override
   * @method parse
   * @param {Object} raw Raw response data.
   * @return {Object}
   */
  AerisBatchModel.prototype.parse = function(raw) {
    var attrs;

    try {
      var responses = raw.response.responses;

      attrs = this.models_.reduce(function(attrs, model, index) {
        return _.extend(attrs, model.parse(responses[index]));
      }, {});
    }
    catch (e) {
      throw new ApiResponseError('Unable to parse batch response data: ' +
        e.message);
    }

    return attrs;
  };


  return AerisBatchModel;
});
