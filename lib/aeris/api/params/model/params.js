define([
  'aeris/util',
  'aeris/config',
  'aeris/model',
  'api/params/collection/filtercollection',
  'aeris/errors/validationerror'
], function(_, config, BaseModel, Filters, ValidationError) {
  /**
   * Represents parameters to be included
   * with a request to the Aeris API.
   *
   * @class aeris.api.model.Params
   * @extends aeris.Model
   *
   * @param {Object=} opt_options
   * @param {aeris.api.params.collection.FilterCollection=} opt_options.filter Constructor for filter.
   *
   * @constructor
   */
  var Params = function(opt_attrs, opt_options) {
    var attrs;
    var options = _.extend({
      filter: Filters
    }, opt_options);

    // Default parameters
    options.defaults = _.defaults(options.defaults || {}, {
      p: ':auto'
    });

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
      client_secret: config.get('apiSecret')
    }, opt_attrs);

    BaseModel.call(this, attrs, options);


    // Proxy filter events
    this.listenTo(this.get('filter'), {
      'all': function() {
        this.trigger('change', this);
        this.trigger('change:filter', this, this.get('filter'));
      }
    });
  };
  _.inherits(Params, BaseModel);


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

    // Must specify a place
    if (!attrs.p) {
      return new ValidationError('location parameter (\'p\') must be defined.');
    }
  };


  /**
   * @override
   */
  Params.prototype.toJSON = function() {
    var json = BaseModel.prototype.toJSON.apply(this, arguments);

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


  return Params;
});
