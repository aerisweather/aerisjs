define([
  'aeris/util',
  'base/markercollections/config/clusterstyles',
  'base/extension/mapobjectcollection',
  'base/extension/strategyobject',
  'base/markers/pointdatamarker'
], function(_, clusterStyles, MapObjectCollection, StrategyObject, PointDataMarker) {
  /**
   * A collection of {aeris.maps.markers.PointDataMarker} map objects.
   *
   * @class aeris.maps.markercollections.PointDataMarkerCollection
   * @extends aeris.maps.extension.MapObjectCollection
   *
   * @mixes aeris.maps.extension.StrategyObject
   *
   * @constructor
   * @override
  */
  var PointDataMarkerCollection = function(opt_models, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: PointDataMarker,
      clusterStrategy: 'markerstrategies/markerclusterstrategy',
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
     */
    this.clusterStyles_ = options.clusterStyles;


    /**
     * Options to pass to the marker cluster strategy.
     *
     * @type {Object}
     * @public
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
     * @default 'markerstrategies/markerclusterstrategy'
     */
    this.clusterStrategy_ = options.clusterStrategy;


    /**
     * Whether a clustering strategy
     * is currently active.
     *
     * @type {Boolean}
     * @private
     */
    this.isClustering_ = false;


    MapObjectCollection.call(this, opt_models, options);
    StrategyObject.call(this, { strategy: options.strategy });


    // Start up clustering
    if (options.cluster) {
      this.startClustering();
    }
  };
  _.inherits(PointDataMarkerCollection, MapObjectCollection);
  _.extend(PointDataMarkerCollection.prototype, StrategyObject.prototype);


  /**
   * Limits the number of markers.
   *
   * @param {number} limit
   */
  PointDataMarkerCollection.prototype.setLimit = function(limit) {
    this.data_.setParams('limit', limit);
  };


  /**
   * @param {Date} fromDate
   */
  PointDataMarkerCollection.prototype.setFrom = function(fromDate) {
    this.data_.setParams('from', fromDate);
  };


  /**
   * @param {Date} toDate
   */
  PointDataMarkerCollection.prototype.setTo = function(toDate) {
    this.data_.setParams('to', toDate);
  };


  /**
   * @return {aeris.api.model.Params}
   */
  PointDataMarkerCollection.prototype.getParams = function() {
    return this.data_.getParams();
  };


  /**
   * Returns a copy of the
   * cluster styles for the specified
   * cluster group.
   *
   * @param {string=} opt_group Defaults to 'default.'
   * @returns {Object} Cluster styles object.
   */
  PointDataMarkerCollection.prototype.getClusterStyle = function(opt_group) {
    var styles = this.clusterStyles_[opt_group] || this.clusterStyles_['default'];

    return styles.slice(0);
  };


  /**
   * Starts up the strategy defined
   * by this.clusterStrategy_.
   */
  PointDataMarkerCollection.prototype.startClustering = function() {
    var throwUncatchable = function(e) {
      _.defer(function() {throw e; });
    };

    if (_.isString(this.clusterStrategy_)) {
      this.loadStrategy(this.clusterStrategy_).
        fail(throwUncatchable);
    }
    else {
      this.setStrategy(this.clusterStrategy_);
    }

    this.isClustering_ = true;
  };


  /**
   * Destroys the clustering strategy
   * started up by #startClustering.
   */
  PointDataMarkerCollection.prototype.stopClustering = function() {
    if (this.isClustering_) {
      this.removeStrategy();
    }
  };


  return PointDataMarkerCollection;
});
