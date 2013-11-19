/**
 * A PointDataMarkerCollection
 *    - Is a collection of PointDataMarkers
 *    - Has a PointDataCollection
 *    - Creates PointDataMarkers for each model in PDCollection
 *      - Sets the markers to a map
 *    - Fetches PointDataCollection on load
 *    - Fetches PoinDataColleciton on map 'bounds_changed'
 *    - Adds and Removes markers from map on collection#add/remove events.
*/
define([
  'aeris/util',
  'base/markercollections/config/clusterstyles',
  'aeris/errors/invalidargumenterror',
  'aeris/collection',
  'base/extension/strategyobject',
  'base/markers/pointdatamarker',
  'api/endpoint/collection/pointdatacollection'
], function(_, clusterStyles, InvalidArgumentError, BaseCollection, StrategyObject, PointDataMarker, PointDataCollection) {
  /**
   * A PointDataMarkerCollection is a collection of {aeris.maps.markers.PointDataMarker} object.
   * It generates markers which correspond to {aeris.api.model.PointData} models within a
   * {aeris.api.collection.PointDataCollection}.
   *
   * Its primary job is to synchronize it's collection of markers with a
   * {aeris.api.collection.PointDataCollection}.
   *
   * It also acts as a pseudo {aeris.maps.extensions.MapExtensionObject}, in that
   * you can set the collection to a map. However, it delegates the job of rendering
   * to it's individual markers (and their strategies).
   *
   * @class aeris.maps.markercollections.PointDataMarkerCollection
   * @extends aeris.Collection
   * @mixes aeris.maps.extension.StrategyObject
   * @implements aeris.maps.MapObjectInterface
   *
   * @param {Array.<aeris.maps.markers.PointDataMarker=>} opt_markers
   *
   * @param {Object=} opt_options
   *
   * @param {aeris.maps.AbstractStrategy=} opt_options.strategy
   *        Strategy for rendering a collection of markers.
   *        By default, this class uses a marker clustering strategy.
   *        Removing this strategy will prevent clustering, though
   *        individual markers will still be rendered using their own
   *        strategy.
   *
   * @param {Boolean=} opt_options.cluster Whether to cluster markers. Default is true.
   * @param {Object=} opt_options.clusterOptions Options to pass to the marker clusterer strategy.
   * @param {Object.<Array.<Object>>=} opt_options.clusterStyles
   * @param {string|Function=} opt_options.clusterStrategy
   *
   *
   * @constructor
   */
  var PointDataMarkerCollection = function(opt_markers, opt_options) {
    /**
     * When a new request is made to
     * get point data is loaded.
     *
     * @event load:start
     */
    /**
     * When point data is loaded.
     *
     * @event load
     */


    var options = _.defaults(opt_options || {}, {
      marker: PointDataMarker,
      cluster: true,
      clusterStrategy: 'markerstrategies/markerclusterstrategy',
      clusterOptions: {},
      clusterStyles: {},
      strategy: null
    });

    // Set default styles
    options.clusterStyles = _.defaults(options.clusterStyles, {
      default: clusterStyles.default
    });


    /**
     * The data collection associated with this marker collection.
     *
     * @type {aeris.api.PointDataCollection}
     * @protected
     */
    this.data_ = options.data;

    if (!this.data_ || !(this.data_ instanceof PointDataCollection)) {
      throw new InvalidArgumentError(
        'A PointDataMarkerCollection requires ' +
        'a valid PointDataCollection'
      );
    }


    /**
     * The map on which to set
     * child markers.
     *
     * @type {aeris.maps.Map}
     */
    this.map_;


    /**
     * The url which which to create
     * child markers.
     *
     * @type {string}
     * @private
     */
    this.url_ = options.url;


    /**
     * The constructor for creating a new marker.
     * Also referenced as this.model.
     *
     * @type {*}
     * @private
     */
    this.Marker_ = options.marker;
    options.model = this.Marker_;


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


    BaseCollection.call(this, opt_markers, options);

    StrategyObject.call(this, { strategy: options.strategy });


    // Start up clustering
    if (options.cluster) {
      this.startClustering();
    }


    // Sync our data collection
    // to our marker collection
    this.listenTo(this.data_, {
      'add': this.addMarkerFromData_,
      'remove': this.removeMarkerFromData_,
      'reset': this.resetMarkersFromData_
    });


    // Sync our markers
    // to our map.
    this.listenTo(this, {
      'add': this.setMarkerToMap_,
      'remove': this.removeMarkerFromMap_,
      'reset': this.resetMarkersOnMap_
    });


    // Trigger load events
    this.listenTo(this.data_, {
      request: _.bind(this.trigger, this, 'load:start'),
      sync: _.bind(this.trigger, this, 'load')
    });


    /**
     * A hash of events to bind to the map.
     * Can be used to update data parameters
     * when map attributes change.
     *
     * Events will be bound when a map is set.
     * Handlers will also all be called immediately
     * at that time, to bind initial set of parameters
     * to the map state.
     *
     * @type {Object} Events hash.
     * @protected
     */
    this.mapEvents_ = {
      // Set the API bounds param
      // whenever the map bounds changes
      'change:bounds': function() {
        this.data_.getParams().setBounds(this.getMap().get('bounds'));
      }
    };

    // Fetch whenever data parameters changes
    this.listenTo(this.data_.getParams(), {
      'change': function() {
        if (this.hasMap()) {
          this.data_.fetch();
        }
      }
    });
  };
  _.inherits(PointDataMarkerCollection, BaseCollection);
  _.extend(PointDataMarkerCollection.prototype, StrategyObject.prototype);


  /**
   * Set the map on which to render set all child markers.
   *
   * @param {aeris.maps.Map} aerisMap
   */
  PointDataMarkerCollection.prototype.setMap = function(aerisMap) {
    // Prevent redundant actions
    if (aerisMap === this.map_) { return; }


    // If called with setMap(null),
    // treat as 'remove'
    if (!aerisMap) {
      this.removeMap();
      return;
    }

    this.map_ = aerisMap;

    // Add all children to that map
    this.each(function(marker) {
      marker.setMap(this.getMap());
    }, this);

    this.bindMapEvents_();

    this.trigger('map:set', this, aerisMap, {});
  };


  /**
   * Remove all markers from the map.
   */
  PointDataMarkerCollection.prototype.removeMap = function() {
    // Prevent redundant actions
    if (this.map_ === null) { return; }


    this.unbindMapEvents_();

    this.map_ = null;

    this.each(function(marker) {
      marker.setMap(null);
    }, this);

    this.trigger('map:remove', this, null, {});
  };


  /**
   * Listen to our map.
   *
   * @protected
   */
  PointDataMarkerCollection.prototype.bindMapEvents_ = function() {
    this.listenTo(this.getMap(), this.mapEvents_);

    // Immediately call handlers, to
    // bind parameters to initial map state.
    _.each(this.mapEvents_, function(handler, topic) {
      _.bind(handler, this)();
    }, this);
  };

  /**
   * Stop listening to our map.
   *
   * @private
   */
  PointDataMarkerCollection.prototype.unbindMapEvents_ = function() {
    // Note that if `this.getMap()` is undefined,
    // you're effectively calling `this.stopListening()`,
    // which will clear ALL listeners.
    if (this.hasMap()) {
      this.stopListening(this.getMap());
    }
  };


  /**
   * @return {Boolean}
   */
  PointDataMarkerCollection.prototype.hasMap = function() {
    return !!this.map_;
  };


  /**
   * @return {aeris.maps.Map}
   */
  PointDataMarkerCollection.prototype.getMap = function() {
    return this.map_;
  };


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


  PointDataMarkerCollection.prototype.getParams = function() {
    return this.data_.getParams();
  };


  /**
   * Sets a given marker onto our map (if we have one).
   *
   * @param {aeris.maps.markers.PointDataMarker} marker
   * @private
   */
  PointDataMarkerCollection.prototype.setMarkerToMap_ = function(marker) {
    if (!this.hasMap()) { return; }
    marker.setMap(this.getMap());
  };


  /**
   * Remove a marker from the map.
   *
   * @param {aeris.maps.markers.PointDataMarker} marker
   * @private
   */
  PointDataMarkerCollection.prototype.removeMarkerFromMap_ = function(marker) {
    marker.setMap(null);
  };


  /**
   * Remove all previous markers from the map,
   * and adds new markers.
   * Called on this#reset.
   *
   * @param {aeris.maps.markercollections.PointDataMarkerCollection} collection This collection.
   * @param {Object} options
   * @private
   */
  PointDataMarkerCollection.prototype.resetMarkersOnMap_ = function(collection, options) {
    // Remove old markers
    _.each(options.previousModels, this.removeMarkerFromMap_, this);

    if (this.hasMap()) {
      this.each(function(marker) {
        marker.setMap(this.getMap());
      }, this);
    }
  };


  /**
   * Convert a PointData model object into a PointDataMarker object.
   *
   * @param {aeris.api.model.PointData} dataModel
   * @return {aeris.maps.markers.PointDataMarker}
   * @private
   */
  PointDataMarkerCollection.prototype.createMarkerFromData_ = function(dataModel) {
    var options = {
      position: dataModel.get('latLon'),
      data: dataModel
    };

    // Only set the url if it's defined
    // Otherwise, we're going to end up overwriting
    // our url attr with 'undefined'
    if (this.url_) {
      options.url = this.url_;
    }

    return new this.model(options);
  };


  /**
   * Finds the marker which is associated with the
   * specified {aeris.api.model.PointData} model.
   *
   * @type {aeris.api.model.PointData}
   * @private
   * @return {aeris.maps.markers.PointDataMarker|undefined}
   */
  PointDataMarkerCollection.prototype.getMarkerFromData_ = function(dataModel) {
    // Search for a marker with a matching data model
    var matches = this.filter(function(marker) {
      return marker.get('data').id === dataModel.id;
    });

    return matches[0];
  };


  /**
   * Add a marker from to the collection,
   * from a given PointData model.
   *
   * @param {aeris.api.model.PointData} dataModel
   * @private
   */
  PointDataMarkerCollection.prototype.addMarkerFromData_ = function(dataModel) {
    var marker = this.createMarkerFromData_(dataModel);
    this.add(marker);
  };


  /**
   * Remove a marker from the collection,
   * which is associated with a given PointData model.
   *
   * @param {aeris.api.model.PointData} dataModel
   * @private
   */
  PointDataMarkerCollection.prototype.removeMarkerFromData_ = function(dataModel) {
    var marker = this.getMarkerFromData_(dataModel);

    if (marker) {
      this.remove(marker);
    }
  };


  /**
   * Reset all markers in the collection,
   * using new PointDataCollection data.
   *
   * @private
   */
  PointDataMarkerCollection.prototype.resetMarkersFromData_ = function() {
    var markers = [];
    this.data_.each(function(dataModel) {
      var marker = this.createMarkerFromData_(dataModel);
      markers.push(marker);
    }, this);

    this.reset(markers);
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
