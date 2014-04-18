define([
  'aeris/util',
  'aeris/maps/extensions/mapobjectcollection',
  'aeris/togglecollectionbehavior',
  'aeris/maps/extensions/strategyobject',
  'aeris/maps/markers/marker',
  'aeris/maps/markercollections/config/clusterstyles'
], function(_, MapObjectCollection, ToggleCollectionBehavior, StrategyObject, Marker, clusterStyles) {
  /**
   * A collection of {aeris.maps.markers.Marker} objects.
   *
   * By default, marker collections are rendered using a clustering strategy (eg MarkerClustererPlus for google maps).
   *
   * A MarkerCollection is a type of {aeris.ViewCollection}, which means that it can bind its attributes to a data collection ({aeris.Collection} or {Backbone.Collection}). Any changes, additions, or deletions to the bound data collection will be reflected in the marker collection.
   *
   * See {aeris.maps.markers.Marker} documentation for more information on transforming raw data into marker attributes. Note that `attributeTransforms` can be set directly on the MarkerCollection object using the `modelOptions` option:
   *
   * <code class="example">
   *    var markers = new aeris.maps.markercollections.MarkerCollection(null, {
   *      modelOptions: {
   *        attributeTransforms: {
   *          // ...
   *        }
   *      }
   *    });
   * </code>
   *
   * @class MarkerCollection
   * @namespace aeris.maps.markercollections
   * @extends aeris.maps.extensions.MapObjectCollection
   * @publicApi
   *
   * @uses aeris.maps.extensions.StrategyObject
   * @uses aeris.ToggleCollectionBehavior
   *
   * @constructor
   *
   * @param {Array.<aeris.maps.markers.Marker>=} opt_markers Markers to add to the collection.
   *
   * @param {Object=} opt_options
   * @param {Function=} opt_options.model Constructor for an {aeris.maps.markers.Marker} object.
   *                                  to use as a model for the collection.
   * @param {string|aeris.maps.AbstractStrategy=} opt_options.clusterStrategy Strategy for rendering marker clusters.
   * @param {aeris.maps.markercollections.options.ClusterStyles=} opt_options.clusterStyles
   * @param {Object=} opt_options.clusterOptions Options to pass onto the marker clusterer view.
   * @param {Boolean=} opt_options.cluster Whether to cluster markers. Default is true.
   * @param {string|aeris.maps.AbstractStrategy=} opt_options.strategy
  */
  var MarkerCollection = function(opt_markers, opt_options) {
    var options = _.defaults(opt_options || {}, {
      model: Marker,
      clusterStrategy: 'markers/markercluster',
      clusterStyles: {},
      clusterOptions: {},
      cluster: true,
      strategy: null
    });

    // Set default styles
    options.clusterStyles = _.defaults(options.clusterStyles, {
      defaultStyles: clusterStyles.defaultStyles
    });

    /**
     * @property clusterStyles_
     * @private
     * @type {aeris.maps.markercollections.options.ClusterStyles}
    */
    this.clusterStyles_ = options.clusterStyles;

    /**
     * @property clusterStrategy_
     * @private
     * @type {aeris.maps.AbstractStrategy}
    */
    this.clusterStrategy_ = options.clusterStrategy;

    /**
     * @property clusterOptions_
     * @private
     * @type {Object}
    */
    this.clusterOptions_ = options.clusterOptions;


    /**
     * Whether a clustering strategy
     * is currently active.
     *
     * @property isClustering_
     * @private
     * @type {Boolean}
    */
    this.isClustering_ = false;

    MapObjectCollection.call(this, opt_markers, options);
    ToggleCollectionBehavior.call(this);
    StrategyObject.call(this, {
      strategy: options.strategy
    });

    // Start up clustering
    if (options.cluster) {
      this.startClustering();
    }
  };
  _.inherits(MarkerCollection, MapObjectCollection);
  _.extend(MarkerCollection.prototype, StrategyObject.prototype);
  _.extend(MarkerCollection.prototype, ToggleCollectionBehavior.prototype);

  /**
   * Returns a copy of the
   * cluster styles for the specified
   * cluster group.
   *
   * @param {string=} opt_group Defaults to 'defaultStyles.'.
   * @return {Object} Cluster styles object.
   * @method getClusterStyle
   */
  MarkerCollection.prototype.getClusterStyle = function(opt_group) {
    var styles = this.clusterStyles_[opt_group] || this.clusterStyles_['defaultStyles'];

    return styles.slice(0);
  };


  /**
   * @method getClusterOptions
   * @return {Object}
   */
  MarkerCollection.prototype.getClusterOptions = function() {
    return _.clone(this.clusterOptions_);
  };


  /**
   * Starts up the strategy defined
   * by this.clusterStrategy_.
   * @method startClustering
   */
  MarkerCollection.prototype.startClustering = function() {
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
  MarkerCollection.prototype.stopClustering = function() {
    if (this.isClustering_) {
      this.removeStrategy();
    }
  };


  return _.expose(MarkerCollection, 'aeris.maps.markercollections.MarkerCollection');
});
/**
 * Style setting for marker clusters,
 * organized by marker type.
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
 *
 *    // Default styles for markers which do not implement
 *    // a getType method.
 *    defaultStyles: [ ... ]
 *
 *  }
 *
 * In order for markers to be clustered by type, each marker must
 * implement a `getType` method. Otherwise, markers will be styled using the
 * `defaultStyles` styles.
 *
 * See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html
 *  "class ClusterIconStyle" for acceptable style options.
 *
 * @class ClusterStyles
 * @namespace aeris.maps.markercollections.options
 * @static
*/
