define([
  'aeris/util',
  'aeris/maps/strategy/abstractstrategy',
  'gmaps-markerclusterer-plus',
  'aeris/maps/strategy/utils'
], function(_, AbstractStrategy, MarkerClusterer, mapUtil) {
  /**
   * Strategy for rendering a collection of markers in a cluster.
   *
   * @class MarkerCluster
   * @namespace aeris.maps.gmaps.markers
   * @extends aeris.maps.gmaps.AbstractStrategy
   *
   * @constructor
   * @override
   *
   * @param {aeris.Collection} object A collection of {aeris.maps.markers.Marker} objects.
   *
   * @param {Object=} opt_options
   * @param {Function=} opt_options.MarkerClusterer
  */
  var MarkerClusterStrategy = function(object, opt_options) {
    var options = _.defaults(opt_options || {}, {
      MarkerClusterer: MarkerClusterer
    });

    /**
     * A hash of MarkerClusterer objects,
     * referenced by group name.
     *
     * eg.
     *    {
     *      snow: {MarkerClusterer},
     *      rain: {MarkerClusterer}
     *    }
     *
     * @property view
     * @type {Object.<string,MarkerClusterer>}
     */

    /**
     * When a MarkerClusterer instance is created.
     *
     * @event clusterer:create
     * @param {MarkerClusterer} clusterer
     */
    /**
     * When a MarkerClusterer instance is
     * added to the view.
     *
     * @event clusterer:add
     * @param {MarkerClusterer} clusterer
     * @param {string} groupName
     */
    /**
     * When a MarkerClusterer instance is
     * removed from the view.
     *
     * @event clusterer:remove
     * @param {MarkerClusterer} clusterer
     * @param {string} groupName
     */


    /**
     * Constructor for the
     * MarkerClusterer object.
     *
     * @type {Function}
     * @private
     * @property MarkerClusterer_
     */
    this.MarkerClusterer_ = options.MarkerClusterer;

    AbstractStrategy.apply(this, arguments);


    this.bindToMarkerCollection_();


    // Proxy clusterer view events
    this.listenTo(this, {
      'clusterer:add': this.proxyClustererEvents_,
      'clusterer:remove': function(clusterer) {
        this.googleEvents_.stopListening(clusterer);
      }
    });
  };
  _.inherits(MarkerClusterStrategy, AbstractStrategy);


  /**
   * @method bindToMarkerCollection_
   * @private
   */
  MarkerClusterStrategy.prototype.bindToMarkerCollection_ = function() {
    // Debounce event handlers.
    // Resolves significant performance issues
    // when data is reset on very large collections (~500+ models)
    var resetDebounced = _.debounce(function() {
      this.resetClusters();
    }, 500);
    var repaintDebounced = _.debounce(function() {
      this.repaint();
    }, 500);

    // Bind to marker collection object
    this.listenTo(this.object_, {
      add: function(marker, obj, opts) {
        this.addMarker(marker);
      },
      remove: resetDebounced,
      reset: resetDebounced,
      'change': repaintDebounced
    });
  };


  /**
   *
   * @private
   * @return {Object}
   * @method createView_
   */
  MarkerClusterStrategy.prototype.createView_ = function() {
    this.view_ = {};

    this.addMarkers(this.object_.models);

    return this.view_;
  };


  /**
   * Sets the map on all {MarkerClusterer} objects.
   *
   * @override
   * @method setMap
   */
  MarkerClusterStrategy.prototype.setMap = function(aerisMap) {
    AbstractStrategy.prototype.setMap.apply(this, arguments);

    _.invoke(this.getView(), 'setMap', this.mapView_);
  };


  /**
   * Sets the map to null on all {MarkerClusterer} objects.
   *
   * @override
   * @method beforeRemove_
   */
  MarkerClusterStrategy.prototype.beforeRemove_ = function() {
    _.invoke(this.getView(), 'setMap', null);

    // Remove all child markers from the map.
    //
    // BUG FIX: removing child MapObjects is
    // handled by our MapObjectCollection
    // However, our MarkerClusterer is also trying to
    // add and remove child markers from the map.
    // Because of some funky timing, we always end up with
    // one marker left on the map.
    _.defer(function() {
      // Check map is really still null after call stack
      // has been resolved.
      if (!this.object_.getMap()) {
        _.invoke(this.getAllMarkers_(), 'setMap', null);
      }
    }.bind(this));
  };


  /**
   * @method destroy
   */
  MarkerClusterStrategy.prototype.destroy = function() {
    AbstractStrategy.prototype.destroy.apply(this, arguments);

    this.clearClusters();
  };


  /**
   * Add a set of markers to the
   * appropriate {MarkerClusterer} views.
   *
   * @param {Array.<aeris.maps.markers.Marker>} markers
   * @method addMarkers
   */
  MarkerClusterStrategy.prototype.addMarkers = function(markers) {
    _.each(markers, function(marker) {
      this.addMarker(marker);
    }, this);
  };


  /**
   * Add a marker to the appropriate
   * {MarkerClusterer} view.
   *
   * @fires 'clusterer:create'
   * @fires 'clusterer:add'
   *
   * @param {aeris.maps.markers.Marker} marker
   * @method addMarker
   */
  MarkerClusterStrategy.prototype.addMarker = function(marker) {
    var groupName = this.getMarkerGroup_(marker);

    // Create the clusterer, if one doesn't already
    // exist for the marker's group.
    if (!this.getClusterer(groupName)) {
      this.addClusterer_(this.createClusterer_(groupName), groupName);
    }

    // Add the marker to its group's clustere
    marker.requestView().
      done(function(markerView) {
        this.getClusterer(groupName).addMarker(markerView);
      }, this).
      fail(_.throwUncatchable);
  };


  /**
   * Remove a marker from it's clusterer.
   *
   * @param {aeris.maps.markers.Marker} marker
   * @method removeMarker
   */
  MarkerClusterStrategy.prototype.removeMarker = function(marker) {
    var groupName = this.getMarkerGroup_(marker);
    var clusterer = this.getClusterer(groupName);

    if (clusterer) {
      marker.requestView().
        done(function(markerView) {
          clusterer.removeMarker(markerView);
        }, this).
        fail(_.throwUncatchable);
    }
  };


  /**
   * Remove a set of markers from their clusterers.
   *
   * @param {Array.<aeris.maps.markers.Marker>} markers
   * @method removeMarkers
   */
  MarkerClusterStrategy.prototype.removeMarkers = function(markers) {
    _.each(markers, function(marker) {
      this.removeMarker(marker);
    }, this);
  };


  /**
   * Remove all markers from all clusterers.
   *
   * @fires 'clusterer:remove'
   * @method clearClusters
   */
  MarkerClusterStrategy.prototype.clearClusters = function() {
    var view = this.getView();

    // Clean up clusterer views
    _.each(view, function(clusterer, groupName) {
      clusterer.clearMarkers();
      clusterer.setMap(null);

      // Clean up reference to clusterer.
      delete view[groupName];
      this.trigger('clusterer:remove', clusterer, groupName);
    }, this);
  };


  /**
   * Refresh the clusters view,
   * using our object's models.
   * @method resetClusters
   */
  MarkerClusterStrategy.prototype.resetClusters = function() {
    this.clearClusters();

    this.addMarkers(this.object_.models);
  };


  /**
   * Redraws all MarkerClusterers.
   * @method repaint
   */
  MarkerClusterStrategy.prototype.repaint = function() {
    _(this.getView()).invoke('repaint');
  };


  /**
   * Get the group name for a marker,
   * using the object's 'clusterBy' setting.
   *
   * @param {aeris.maps.markers.Marker} marker
   * @return {string}
   * @private
   * @method getMarkerGroup_
   */
  MarkerClusterStrategy.prototype.getMarkerGroup_ = function(marker) {
    // Use the marker's type to separate clusters.
    // If no marker type is defined,
    // use a single default cluster name
    return marker.getType() || MarkerClusterStrategy.SINGLE_CLUSTER_GROUPNAME;
  };


  /**
   * Create a MarkerClusterer object.
   *
   * @fires 'clusterer:create'
   *
   * @param {string|undefined} groupName Required in order to set the cluster group styles.
   * @param {Array.<aeris.maps.markers.Marker>} opt_markers
   * @private
   *
   * @return {MarkerClusterer}
   * @method createClusterer_
   */
  MarkerClusterStrategy.prototype.createClusterer_ = function(groupName) {
    var clusterer;
    var clustererOptions = _.defaults({}, this.object_.getClusterOptions(), {
      clusterClass: 'aeris-cluster',
      styles: this.object_.getClusterStyle(groupName),
      averageCenter: true,
      zoomOnClick: true,
      gridSize: 60,
      maxZoom: 9,
      minimumClusterSize: 3
    });

    clusterer = new this.MarkerClusterer_(
      this.mapView_,
      [],
      clustererOptions
    );

    this.trigger('clusterer:create', clusterer);

    return clusterer;
  };


  /**
   * Adds a MarkerClusterer with the given
   * group name to the view.
   *
   * Will overwrite any existing clusterer
   * with the same group name.
   *
   * @fires 'clusterer:add'
   *
   * @param {MarkerClusterer} clusterer
   * @param {string} groupName
   * @private
   * @method addClusterer_
   */
  MarkerClusterStrategy.prototype.addClusterer_ = function(clusterer, groupName) {
    this.view_[groupName] = clusterer;
    this.trigger('clusterer:add', clusterer, groupName);
  };


  /**
   * Get a MarkerClusterer by group name.
   *
   * @param {string} groupName
   * @return {MarkerClusterer}
   * @method getClusterer
   */
  MarkerClusterStrategy.prototype.getClusterer = function(groupName) {
    return this.getView()[groupName];
  };


  /**
   * Proxy events emitted by a
   * {MarkerClusterer} object
   * over to our {aeris.maps.MapObject}
   *
   * @param {MarkerClusterer} clusterer
   * @private
   * @method proxyClustererEvents_
   */
  MarkerClusterStrategy.prototype.proxyClustererEvents_ = function(clusterer) {
    var triggerClusterMouseEvent = _.bind(function(topic, cluster) {
      var latLon = mapUtil.latLngToArray(cluster.getCenter());
      this.object_.trigger('cluster:' + topic, latLon);
    }, this);

    this.googleEvents_.listenTo(clusterer, {
      click: function(cluster) {
        triggerClusterMouseEvent('click', cluster);
      },
      mouseout: function(cluster) {
        triggerClusterMouseEvent('mouseout', cluster);
      },
      mouseover: function(cluster) {
        triggerClusterMouseEvent('mouseover', cluster);
      }
    });
  };


  /**
   * Return all marker views from all clusterers.
   *
   * @return {Array.<google.maps.Marker>}
   * @private
   * @method getAllMarkers_
   */
  MarkerClusterStrategy.prototype.getAllMarkers_ = function() {
    return _.reduce(this.getView(), function(memo, clusterer) {
      return memo.concat(clusterer.getMarkers());
    }, [], this);
  };


  /**
   * The group name used to reference
   * a MarkerClusterer, when no 'clusterBy' option
   * is set on the object.
   *
   * @static
   * @type {string}
   */
  MarkerClusterStrategy.SINGLE_CLUSTER_GROUPNAME = 'MARKERCLUSTERSTRATEGY_SINGLE_CLUSTER';


  return MarkerClusterStrategy;
});
/**
 * @for aeris.maps.markercollections.MarkerCollection
 */
/**
 * @event cluster:click
 * @param {aeris.maps.LatLon} latLon
 */
/**
 * When the mouse enters a cluster.
 *
 * @event cluster:mouseover
 * @param {aeris.maps.LatLon} latLon
 */
/**
 * When the mouse exits a cluster.
 *
 * @event cluster:mouseout
 * @param {aeris.maps.LatLon} latLon
 */
