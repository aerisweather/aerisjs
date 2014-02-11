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
   * @class PointDataMarkerCollection
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.extensions.MapObjectCollection
   *
   * @mixes aeris.maps.extensions.StrategyObject
   *
   * @constructor
   * @override
  */
  var PointDataMarkerCollection = function(opt_models, opt_options) {
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
  _.inherits(PointDataMarkerCollection, MapObjectCollection);
  _.extend(PointDataMarkerCollection.prototype, StrategyObject.prototype);


  /**
   * Limits the number of markers.
   *
   * @param {number} limit
   * @method setLimit
   */
  PointDataMarkerCollection.prototype.setLimit = function(limit) {
    this.data_.setParams('limit', limit);
  };


  /**
   * @param {Date} fromDate
   * @method setFrom
   */
  PointDataMarkerCollection.prototype.setFrom = function(fromDate) {
    this.data_.setParams('from', fromDate);
  };


  /**
   * @param {Date} toDate
   * @method setTo
   */
  PointDataMarkerCollection.prototype.setTo = function(toDate) {
    this.data_.setParams('to', toDate);
  };


  /**
   * @return {aeris.api.params.models.Params}
   * @method getParams
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
   * @method getClusterStyle
   */
  PointDataMarkerCollection.prototype.getClusterStyle = function(opt_group) {
    var styles = this.clusterStyles_[opt_group] || this.clusterStyles_['default'];

    return styles.slice(0);
  };


  /**
   * Starts up the strategy defined
   * by this.clusterStrategy_.
   * @method startClustering
   */
  PointDataMarkerCollection.prototype.startClustering = function() {
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
  PointDataMarkerCollection.prototype.stopClustering = function() {
    if (this.isClustering_) {
      this.removeStrategy();
    }
  };


  return PointDataMarkerCollection;
});
