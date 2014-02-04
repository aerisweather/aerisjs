define([
  'ai/util',
  'ai/collection',
  'ai/api/endpoint/mixin/aerisapibehavior',
  'ai/jsonp'
], function(_, Collection, AerisApiBehavior, JSONP) {
  /**
   * A data collection which creates {aeris.Model} objects
   * from Aeris API response data.
   *
   * See http://www.hamweather.com/support/documentation/aeris/
   * for Aeris API documentation.
   *
   * @class AerisApiCollection
   * @namespace aeris.api.collection
   * @extends aeris.Collection
   * @mixes aeris.api.endpoint.mixin.AerisApiBehavior
   *
   *
   * @constructor
   * @param {Object=} opt_models
   *
   * @param {Object=} opt_options
   * @param {Array.<AerisAPIEndpoint>=} opt_options.endpoints
   * @param {Object=} opt_options.params
   * @param {aeris.JSONP=} opt_options.JSONP object used for fetching batch data.
   */
  var AerisApiCollection = function(opt_models, opt_options) {
    var options = _.extend({
      endpoint: '',
      action: '',
      params: {},
      server: 'http://api.aerisapi.com'
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
     * @property endpoint_
     */
    this.endpoint_ = options.endpoint;


    /**
     * Aeris API Action
     *
     * See http://www.hamweather.com/support/documentation/aeris/actions/
     *
     * @type {string}
     * @private
     * @property action_
     */
    this.action_ = options.action;


    /**
     * Location of the Aeris API server.
     *
     * @type {string}
     * @private
     * @property server_
     */
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
     * @property params_
     */
    this.params_ = this.createParams_(options.params);


    /**
     * @type {aeris.JSONP}
     * @private
     * @property jsonp_
     */
    this.jsonp_ = options.jsonp || JSONP;


    Collection.call(this, opt_models, options);
  };
  _.inherits(AerisApiCollection, Collection);
  _.extend(AerisApiCollection.prototype, AerisApiBehavior);


  return _.expose(AerisApiCollection, 'aeris.api.AerisApiCollection');
});
