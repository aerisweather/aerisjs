define([
  'aeris/util',
  'aeris/config',
  'aeris/model',
  'api/params/collection/filtercollection',
  'api/params/collection/chainedquery',
  'aeris/errors/validationerror'
], function(_, config, Model, Filters, ChainedQuery, ValidationError) {
  /**
   * Represents parameters to be included
   * with a request to the Aeris API.
   *
   * @class aeris.api.model.Params
   * @extends aeris.Model
   *
   * @param {Object=} opt_options
   * @param {aeris.api.params.collection.FilterCollection=} opt_options.filter Constructor for filter.
   * @param {Function=} opt_options.QueryType Constructor for query attr model.
   *
   * @constructor
   */
  var Params = function(opt_attrs, opt_options) {
    var attrs;
    var options = _.extend({
      filter: Filters,
      QueryType: ChainedQuery
    }, opt_options);

    // Default parameters
    options.defaults = _.defaults(options.defaults || {}, {
      p: ':auto'
    });


    /**
     * @type {Function} Constructor for query attribute object.
     * @private
     */
    this.QueryType_ = options.QueryType;


    attrs = _.extend({
      /**
       * @attribute filter
       * @type {aeris.api.params.collection.FilterCollection}
       */
      filter: new options.filter(),

      /**
       * @attribute client_id
       * @type {string}
       */
      client_id: config.get('apiId'),

      /**
       * @attribute client_secret
       * @type {string}
       */
      client_secret: config.get('apiSecret'),

      /**
       * Note the the Params constructor will
       * process a simple array into a ChainedQuery
       * object.
       *
       * @attribute query
       * @type {aeris.api.params.collection.ChainedQuery}
       */
      query: []
    }, opt_attrs);

    if (!(attrs.query instanceof this.QueryType_)) {
      attrs.query = new this.QueryType_(attrs.query);
    }

    Model.call(this, attrs, options);


    // Immediate validation
    this.isValid();


    // Proxy filter events
    this.listenTo(this.get('filter'), {
      'all': function() {
        this.trigger('change', this);
        this.trigger('change:filter', this, this.get('filter'));
      }
    });

    // Set up query change events
    this.listenTo(this, 'change:query', function() {
      var oldQuery = this.previous('query');

      // Unbind events to old query model
      if (oldQuery && oldQuery.off) {
        this.stopListening(oldQuery);
        this.proxyQueryEvents_();
      }
    });
    this.proxyQueryEvents_();
  };
  _.inherits(Params, Model);


  /**
   * @override
   */
  Params.prototype.validate = function(attrs) {
    if (attrs.to && !(attrs.to instanceof Date)) {
      return new ValidationError('\'to\' parameter must be a Date object');
    }
    if (attrs.from && !(attrs.from instanceof Date)) {
      return new ValidationError('\'from\' parameter must be a Date object');
    }

    if (attrs.query && !(attrs.query instanceof this.QueryType_)) {
      return new ValidationError('query', attrs.query + ' is not a valid Query');
    }
  };


  /**
   * @override
   */
  Params.prototype.toJSON = function() {
    var json = Model.prototype.toJSON.apply(this, arguments);

    // Convert dates to UNIX timestamps
    _.each(json, function(param, paramName) {
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
   */
  Params.prototype.setBounds = function(bounds) {
    if (!bounds) {
      this.unset('p');
    }
    var polygon = _.boundsToPolygon(bounds);
    this.set({
      p: polygon
    }, { validate: true });
  };


  /**
   * Add a filter
   * Delegates to aeris.api.params.collection.FilterCollection#add
   */
  Params.prototype.addFilter = function(filters, opt_options) {
    this.get('filter').add.apply(this.get('filter'), arguments);
  };


  /**
   * Remove a filter.
   *
   * Delegates to aeris.api.params.collection.FilterCollection#remove
   */
  Params.prototype.removeFilter = function(filters, opt_options) {
    this.get('filter').remove.apply(this.get('filter'), arguments);
  };

  /**
   * Resets the filters.
   *
   * Delegates to aeris.api.params.collection.FilterCollection#reset
   */
  Params.prototype.resetFilter = function(filters, opt_options) {
    // Call filter's `reset` method.
    this.get('filter').reset.apply(this.get('filter'), arguments);
  };


  /**
   * Proxy change events
   * from our query attribute.
   *
   * @private
   */
  Params.prototype.proxyQueryEvents_ = function() {
    // Bind to current query model
    if (this.get('query') && this.get('query').on) {
      this.listenTo(this.get('query'), 'add remove change reset', function(query, opts) {
        this.trigger('change:query', this, this.get('query'), opts);
        this.trigger('change', this, opts);
      });
    }
  };


  return Params;
});
