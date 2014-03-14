define([
  'aeris/util',
  'aeris/api/mixins/aerisapibehavior',
  'aeris/model',
  'aeris/jsonp'
], function(_, AerisApiBehavior, Model, JSONP) {
  /**
   * A client-side representation of a single response object
   * from the Aeris API.
   *
   * @class AerisApiModel
   * @namespace aeris.api.models
   * @extends aeris.Model
   * @uses aeris.api.mixins.AerisApiBehavior
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
      server: '//api.aerisapi.com'
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
     * The locatin of the aeris API server.
     *
     * @type {string}
     * @private
     * @default 'http://api.aerisapi.com'
     * @property server_
     */
    this.server_ = options.server;


    /**
     * The JSONP utility for fetching AerisApi data.
     *
     * @type {aeris.JSONP}
     * @private
     * @property jsonp_
     */
    this.jsonp_ = options.jsonp || JSONP;


    /**
     * Parameters to include with the batch request.
     *
     * Note that parameters can also be attached
     * to individual endpoints defined in this.endpoints_.
     *
     * @type {aeris.api.params.models.Params|Object}
     *       Will be converted to Params instance, if passed in as a plain object.
     * @protected
     * @property params_
     */
    this.params_ = this.createParams_(options.params);


    Model.call(this, opt_attrs, options);
  };
  _.inherits(AerisApiModel, Model);
  _.extend(AerisApiModel.prototype, AerisApiBehavior);


  /**
   * @return {*|string}
   * @protected
   */
  AerisApiModel.prototype.getEndpointUrl_ = function() {
    var url = AerisApiBehavior.getEndpointUrl_.call(this);

    if (this.id) {
      url += this.id;
    }

    return url;
  };


  /**
   * Tests whether a model is passing
   * an Aeris API filter.
   *
   * @method testFilter
   * @param {string} filter
   * @return {Boolean}
   */
  AerisApiModel.prototype.testFilter = function(filter) {
    return true;
  };


  /**
   * Tests whether a model is passing a set
   * of Aeris API filters.
   *
   * @method testFilterCollection
   * @param {aeris.api.params.collections.FilterCollection} filters
   * @return {Boolean}
   */
  AerisApiModel.prototype.testFilterCollection = function(filters) {
    return filters.reduce(function(isPassingPreviousFilters, filterModel) {
      var isFirstFilter = _.isNull(isPassingPreviousFilters);

      var isPassingThisFilter = this.testFilter(filterModel.id);
      var isPassingBoth = isPassingThisFilter && isPassingPreviousFilters;
      var isPassingEither = isPassingThisFilter || isPassingPreviousFilters;

      if (isFirstFilter) { return isPassingThisFilter; }

      // If operator is 'AND', model must pass the current filter,
      // as the previous filters.
      return filterModel.isAnd() ? isPassingBoth : isPassingEither;
    }, null, this);
  };


  /**
   * @method parse
   */
  AerisApiModel.prototype.parse = function(res) {
    if (res.response) {
      if (_.isArray(res.response)) {
        return res.response[0] || {};
      }
      else {
        return res.response;
      }
    }
    return res;
  };


  return _.expose(AerisApiModel, 'aeris.api.models.AerisApiModel');
});
