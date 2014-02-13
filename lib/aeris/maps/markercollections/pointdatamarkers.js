define([
  'ai/util',
  'ai/maps/markercollections/config/clusterstyles',
  'ai/maps/extensions/mapobjectcollection',
  'ai/maps/extensions/strategyobject',
  'ai/maps/markers/pointdatamarker'
], function(_, clusterStyles, MapObjectCollection, StrategyObject, PointDataMarker) {
  /**
   * A collection of {aeris.maps.markers.PointDataMarker} map objects.
   *
   * @class PointDataMarkers
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.extensions.MapObjectCollection
   *
   * @mixes aeris.maps.extensions.StrategyObject
   *
   * @constructor
   * @override
  */
  var PointDataMarkers = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: PointDataMarker,
      clusterStrategy: 'markers/markercluster',
      clusterOptions: {},
      clusterStyles: {},
      cluster: true,
      strategy: null
    });

    // Set default styles
    options.clusterStyles = _.defaults(options.clusterStyles, {
      default: clusterStyles.default
    });


    /**
     * Style setting for marker clusters,
     * organized by group name.
     *
     * Example:
     *  {
     *    snow: [
     *      {url: 'snow1.png', height: 10, width: 10},
     *      {url: 'snow2.png', height: 20, width: 20},
     *    ],
     *    rain: [
     *      {url: 'rain1.png', height: 10, width: 10},
     *      {url: 'rain2.png', height: 20, width: 20},
     *    ]
     *  }
     *
     * See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
     *  "class ClusterIconStyle" for acceptable style options.
     *
     * @type {Array.<Object>}
     * @private
     * @property clusterStyles_
     */
    this.clusterStyles_ = options.clusterStyles;


    /**
     * Options to pass to the marker cluster strategy.
     *
     * @type {Object}
     * @public
     * @property clusterOptions
     */
    this.clusterOptions = options.clusterOptions;


    /**
     * The {aeris.maps.AbstractStrategy} to use for
     * clustering the markers.
     *
     * You must call #startClustering in order to initialize
     * this strategy.
     *
     * @type {string|Function} Strategy constructor, or AMD path.
     * @private
     * @default 'markers/markercluster'
     * @property clusterStrategy_
     */
    this.clusterStrategy_ = options.clusterStrategy;


    /**
     * Whether a clustering strategy
     * is currently active.
     *
     * @type {Boolean}
     * @private
     * @property isClustering_
     */
    this.isClustering_ = false;


    MapObjectCollection.call(this, opt_models, options);
    StrategyObject.call(this, { strategy: options.strategy });


    // Start up clustering
    if (options.cluster) {
      this.startClustering();
    }
  };
  _.inherits(PointDataMarkers, MapObjectCollection);
  _.extend(PointDataMarkers.prototype, StrategyObject.prototype);


  // Dynamically proxy {aeris.api.collections.AerisApiCollection}
  // params-interface methods
  _.each([
    'getParams',
    'setParams',
    'setFrom',
    'setTo',
    'setLimit',
    'setBounds',
    'addFilter',
    'removeFilter',
    'resetFilter',
    'addQuery',
    'removeQuery',
    'resetQuery',
    'getQuery'
  ], function(methodName) {
    PointDataMarkers.prototype[methodName] = function(var_args) {
      return this.data_[methodName].apply(this.data_, arguments);
    }
  });
  /**
   * Return params used to query the Aeris API.
   *
   * @method getParams
   * @return {aeris.api.params.models.Params}
   */
  /**
   * Set params used to query the Aeris API.
   *
   * @method setParams
   * @param {Object} params
   */
  /**
   * Set the `from` parameter for querying the Aeris API.
   *
   * @method setFrom
   * @param {Date} from
   */
  /**
   * Set the `to` parameter for querying the Aeris API.
   *
   * @method setTo
   * @param {Date} to
   */
  /**
   * Set the latLon bounds for querying the Aeris API.
   *
   * @method setBounds
   * @param {Array.<Array.<number>>} bounds
   */
  /**
   * Add a filter to the Aeris API request.
   *
   * @method addFilter
   * @param {string|Array.<string>} filter
   */
  /**
   * Remove a filter from the Aeris API request.
   *
   * @method removeFilter
   * @param {string|Array.<string>} filter
   */
  /**
   * Reset a filter from the Aeris API request.
   *
   * @method resetFilter
   * @param {string|Array.<string>=} opt_filter
   */
  /**
   * Add a query term to Aeris API request.
   *
   * @method addQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>} query
   */
  /**
   * Remove a query from the Aeris API request
   *
   * @method removeQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>|string|Array.<string>} Query model(s), or property (key).
   */
  /**
   * Resets the query for the Aeris API request.
   *
   * @method resetQuery
   * @param {aeris.api.params.models.Query|Array.<aeris.api.params.models.Query>=} opt_replacementQuery
   */
  /**
   * Returns the query for the Aeris API request.
   *
   * @method getQuery
   * @return {aeris.api.params.collections.ChainedQueries}
   */


  /**
   * Returns a copy of the
   * cluster styles for the specified
   * cluster group.
   *
   * @param {string=} opt_group Defaults to 'default.'
   * @returns {Object} Cluster styles object.
   * @method getClusterStyle
   */
  PointDataMarkers.prototype.getClusterStyle = function(opt_group) {
    var styles = this.clusterStyles_[opt_group] || this.clusterStyles_['default'];

    return styles.slice(0);
  };


  /**
   * Starts up the strategy defined
   * by this.clusterStrategy_.
   * @method startClustering
   */
  PointDataMarkers.prototype.startClustering = function() {
    var throwUncatchable = function(e) {
      _.defer(function() {throw e; });
    };

    if (_.isString(this.clusterStrategy_)) {
      this.loadStrategy_(this.clusterStrategy_).
        fail(throwUncatchable);
    }
    else {
      this.setStrategy_(this.clusterStrategy_);
    }

    this.isClustering_ = true;
  };


  /**
   * Destroys the clustering strategy
   * started up by #startClustering.
   * @method stopClustering
   */
  PointDataMarkers.prototype.stopClustering = function() {
    if (this.isClustering_) {
      this.removeStrategy();
    }
  };


  return PointDataMarkers;
});
