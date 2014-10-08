define([
  'aeris/util',
  'aeris/config',
  'aeris/model',
  'aeris/api/params/collections/filtercollection',
  'aeris/api/params/collections/chainedqueries',
  'aeris/errors/validationerror',
  'aeris/helpers/validator/boundsvalidator'
], function(_, aerisConfig, Model, Filters, ChainedQueries, ValidationError, BoundsValidator) {
  /**
   * Represents parameters to be included
   * with a request to the Aeris API.
   *
   * @class Params
   * @namespace aeris.api.params.models
   * @extends aeris.Model
   *
   * @param {Object=} opt_options
   * @param {function():aeris.api.params.collections.FilterCollection=} opt_options.FilterCollectionType Constructor for filter.
   * @param {function():aeris.api.params.collections.ChainedQueries=} opt_options.QueryType Constructor for query attr model.
   *
   * @constructor
   */
  var Params = function(opt_attrs, opt_options) {
    var options = _.defaults(opt_options || {}, {
      FilterCollectionType: Filters,
      QueryType: ChainedQueries,
      validate: true
    });

    var attrs = _.defaults(opt_attrs || {}, {
      /**
       * Location parameter
       *
       * @attribute p
       * @type {string|aeris.maps.LatLon}
       */
      p: null,

      /**
       * @attribute filter
       * @type {aeris.api.params.collections.FilterCollection}
       */
      filter: [],

      /**
       * @attribute query
       * @type {aeris.api.params.collections.ChainedQueries}
       */
      query: [],

      /**
       * @attribute client_id
       * @type {string}
       */
      client_id: aerisConfig.get('apiId'),

      /**
       * @attribute client_secret
       * @type {string}
       */
      client_secret: aerisConfig.get('apiSecret')
    });


    /**
     * @type {function():aeris.api.params.collections.ChainedQuery} Constructor for query attribute object.
     * @private
     * @property QueryType_
     */
    this.QueryType_ = options.QueryType;


    /**
     * @property FilterCollectionType_
     * @private
     * @type {function():aeris.api.params.collections.FilterCollection}
     */
    this.FilterCollectionType_ = options.FilterCollectionType;


    // Process query/filter attrs provided as raw objects
    if (!(attrs.query instanceof this.QueryType_)) {
      attrs.query = new this.QueryType_(attrs.query);
    }
    if (!(attrs.filter instanceof this.FilterCollectionType_)) {
      attrs.filter = new this.FilterCollectionType_(attrs.filter);
    }

    Model.call(this, attrs, options);


    this.proxyEventsForAttr_('query');
    this.proxyEventsForAttr_('filter');

    this.bindToApiKeys_();
  };
  _.inherits(Params, Model);


  /**
   * @method validate
   */
  Params.prototype.validate = function(attrs) {
    var placeError = this.validatePlace_(attrs.p);

    if (placeError) {
      return placeError;
    }

    if (attrs.query && !(attrs.query instanceof this.QueryType_)) {
      return new ValidationError('query', attrs.query + ' is not a valid Query');
    }
  };


  /**
   * Bind client_id/secret params to
   * global apiKey config.
   *
   * @private
   * @method bindToApiKeys_
   */
  Params.prototype.bindToApiKeys_ = function() {
    this.listenTo(aerisConfig, 'change:apiId change:apiSecret', function() {
      this.set({
        client_id: this.get('client_id') || aerisConfig.get('apiId'),
        client_secret: this.get('client_secret') || aerisConfig.get('apiSecret')
      });
    });
  };


  Params.prototype.validatePlace_ = function(p) {
    var NO_ERROR = void 0;
    var isPlaceName = _.isString(p);
    var isZipCode = _.isNumeric(p);
    var isLatLon = _.isArray(p) && _.isNumeric(p[0]);
    var boundsError;

    if (_.isNull(p)) {
      return NO_ERROR;
    }
    if (isPlaceName) {
      return NO_ERROR;
    }
    if (isZipCode) {
      return NO_ERROR;
    }
    if (isLatLon) {
      return NO_ERROR;
    }

    boundsError = this.validateBounds_(p);

    if (boundsError) {
      return boundsError;
    }
  };


  Params.prototype.validateBounds_ = function(bounds) {
    var boundsValidator = new BoundsValidator(bounds);

    if (!boundsValidator.isValid()) {
      return boundsValidator.getLastError();
    }
  };


  /**
   * @method toJSON
   */
  Params.prototype.toJSON = function() {
    var json = Model.prototype.toJSON.apply(this, arguments);


    _.each(json, function(param, paramName) {
      // Clean out null, undefined, and empty arrays
      var isEmptyArray = _.isArray(param) && !param.length;
      if (_.isNull(param) || _.isUndefined(param) || isEmptyArray) {
        delete json[paramName];
        return;
      }

      // Convert dates to UNIX timestamps
      if (param instanceof Date) {
        json[paramName] = Math.ceil(param.getTime() / 1000);
      }
    });

    // Convert filter to comma-separated string
    if (this.get('filter')) {
      json.filter = this.get('filter').toString();
    }

    if (this.get('query')) {
      json.query = this.get('query').toString();
    }

    // Convert place polygon to comma-separated string
    if (_.isArray(this.get('p'))) {
      json.p = this.get('p').join(',');
    }

    return json;
  };


  /**
   * Sets the bound limits within which
   * to search for.
   *
   * If null is passed, will remove the bounds limit
   * parameter altogether.
   *
   * @param {?Array.<Array.<number>>} bounds Array of SW and NE lat/lons.
   * @method setBounds
   */
  Params.prototype.setBounds = function(bounds) {
    if (_.isNull(bounds)) {
      this.unset('p');
      return;
    }

    this.set({
      p: bounds
    }, { validate: true });
  };


  /**
   * Add a filter
   * Delegates to aeris.api.params.collections.FilterCollection#add
   * @method addFilter
   */
  Params.prototype.addFilter = function(filters, opt_options) {
    this.get('filter').add(filters, opt_options);
  };


  /**
   * Remove a filter.
   *
   * Delegates to aeris.api.params.collections.FilterCollection#remove
   * @method removeFilter
   */
  Params.prototype.removeFilter = function(filters, opt_options) {
    this.get('filter').remove(filters, opt_options);
  };

  /**
   * Resets the filters.
   *
   * Delegates to aeris.api.params.collections.FilterCollection#reset
   * @method resetFilter
   */
  Params.prototype.resetFilter = function(filters, opt_options) {
    this.get('filter').reset(filters, opt_options);
  };


  /**
   * Add a query term to Aeris API request.
   *
   * @method addQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>} query
   * @param {Object=} opt_options
   */
  Params.prototype.addQuery = function(query, opt_options) {
    this.get('query').add(query, opt_options);
  };

  /**
   * Remove a query from the Aeris API request
   *
   * @method removeQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>|string|Array.<string>} query model(s), or property (key).
   * @param {Object=} opt_options
   */
  Params.prototype.removeQuery = function(query, opt_options) {
    this.get('query').remove(query, opt_options);
  };

  /**
   * Resets the query for the Aeris API request.
   *
   * @method resetQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>=} opt_query
   * @param {Object=} opt_options
   */
  Params.prototype.resetQuery = function(opt_query, opt_options) {
    this.get('query').reset(opt_query, opt_options);
  };


  /**
   * Returns the query for the Aeris API request.
   *
   * @method getQuery
   * @return {aeris.api.params.collections.ChainedQueries}
   */
  Params.prototype.getQuery = function() {
    return this.get('query');
  };


  /**
   * Proxy events for a nested {aeris.Model|aeris.Collection} object.
   *
   * @method proxyEventsForAttr_
   * @private
   * @param {string} attr Attribute name of the nested object.
   */
  Params.prototype.proxyEventsForAttr_ = function(attr) {
    // Bind to current query model
    if (this.get(attr) && this.get(attr).on) {
      this.listenTo(this.get(attr), 'add remove change reset', function(model, opts) {
        this.trigger('change:' + attr, this, this.get(attr), opts);
        this.trigger('change', this, opts);
      });
    }
  };


  return Params;
});
