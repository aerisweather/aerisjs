define([
  'ai/util',
  'ai/api/endpoint/mixin/aerisapibehavior',
  'ai/model',
  'ai/jsonp',
], function(_, AerisApiBehavior, Model, JSONP) {
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
      action: '',
      params: {},
      jsonp: JSONP,
      server: 'http://api.aerisapi.com'
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
     * Aeris API Action
     *
     * See http://www.hamweather.com/support/documentation/aeris/actions/
     *
     * @type {string}
     * @private
     */
    this.action_ = options.action;


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
    this.params_ = this.createParams_(options.params);


    Model.call(this, opt_attrs, options);
  };
  _.inherits(AerisApiModel, Model);
  _.extend(AerisApiModel.prototype, AerisApiBehavior);


  AerisApiModel.prototype.getEndpointUrl_ = function() {
    var url = AerisApiBehavior.getEndpointUrl_.call(this);

    if (this.id) {
      url += this.id
    }

    return url;
  };


  return _.expose(AerisApiModel, 'aeris.api.AerisApiModel');
});
