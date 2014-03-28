define([
  'aeris/util',
  'aeris/maps/abstractstrategy',
  'aeris/maps/strategy/util',
  'leaflet',
  'leaflet-markercluster',
  'hbars!aeris/maps/strategy/markers/clustericon.html'
], function(_, AbstractStrategy, mapUtil, Leaflet, MarkerClusterGroup, clusterTemplate) {
  /**
   * A strategy for rendering clusters of markers
   * using Leaflet.
   *
   * @class MarkerCluster
   * @namespace aeris.maps.leaflet
   * @extends aeris.maps.AbstractStrategy
   *
   * @constructor
   */
  var MarkerCluster = function(markerCollection) {
    /**
     * A hash of MarkerClusterer objects,
     * referenced by group name.
     *
     * eg.
     *    {
     *      snow: {L.MarkerClusterGroup},
     *      rain: {L.MarkerClusterGroup}
     *    }
     *
     * @property view
     * @type {Object.<string,L.MarkerClusterGroup>}
     */

    AbstractStrategy.call(this, markerCollection);

    this.bindObjectToView_();
    this.addBulkMarkers_(this.object_.models);
  };
  _.inherits(MarkerCluster, AbstractStrategy);


  /**
   * @method createView_
   * @private
   */
  MarkerCluster.prototype.createView_ = function() {
    var view = {};

    // Create default cluster group
    view[MarkerCluster.SINGLE_CLUSTER_GROUPNAME_] = this.createCluster_(MarkerCluster.SINGLE_CLUSTER_GROUPNAME_);

    return view;
  };


  /**
   * @method setMap
   */
  MarkerCluster.prototype.setMap = function(map) {
    AbstractStrategy.prototype.setMap.call(this, map);

    _.invoke(this.view_, 'addTo', this.mapView_);
  };


  /**
   * @method beforeRemove_
   * @private
   */
  MarkerCluster.prototype.beforeRemove_ = function() {
    _.each(this.view_, this.mapView_.removeLayer,
      this.mapView_);
  };


  /**
   * @method createCluster_
   * @private
   * @param {string} type
   * @return {L.MarkerClusterGroup}
   */
  MarkerCluster.prototype.createCluster_ = function(type) {
    var cluster = new MarkerClusterGroup({
      iconCreateFunction: function(cluster) {
        return this.createIconForCluster_(cluster, type);
      }.bind(this)
    });

    this.proxyMouseEventsForCluster_(cluster);

    if (this.mapView_) {
      cluster.addTo(this.mapView_);
    }

    return cluster;
  };


  /**
   * @method createIconForCluster_
   * @private
   *
   * @param {L.MarkerCluster} cluster
   * @param {string} type Icon type category
   * @return {L.Icon}
   */
  MarkerCluster.prototype.createIconForCluster_ = function(cluster, type) {
    var clusterStyle = this.object_.getClusterStyle(type);

    return new L.DivIcon({
      html: this.createHtmlForCluster_(cluster, type),
      iconSize: new Leaflet.Point(clusterStyle.width, clusterStyle.height),
      className: MarkerCluster.CLUSTER_CSS_CLASS_
    });
  };


  /**
   * @method createClusterHtml_
   * @private
   * @param {L.MarkerCluster} cluster
   * @param {string} type Icon type category
   * @return {string}
   */
  MarkerCluster.prototype.createHtmlForCluster_ = function(cluster, type) {
    var clusterStyle = this.getClusterStyle_(cluster, type);

    return clusterTemplate(_.extend({}, clusterStyle, {
      count: cluster.getChildCount()
    }));
  };


  /**
   * Chooses a cluster style based on the specified
   * cluster type, and the size of the cluster.
   *
   * @method getClusterStyle_
   * @private
   *
   * @param {L.MarkerCluster} cluster
   * @param {string} type
   * @return {Object=} Style options
   */
  MarkerCluster.prototype.getClusterStyle_ = function(cluster, type) {
    var clusterStyles = this.object_.getClusterStyle(type);
    var count = cluster.getChildCount();
    var index = -1;

    while (count !== 0) {
      count = parseInt(count / 10, 10);
      index++;
    }

    // Index resolves to:
    //      size < 10    ==>   0
    // 10 < size < 100   ==>   1
    // 100 < size < 1000 ==>   2
    // etc..
    index = Math.min(index, clusterStyles.length - 1);

    return clusterStyles[index];
  };


  /**
   * @method addMarker_
   * @private
   * @param {aeris.maps.Marker} marker
   */
  MarkerCluster.prototype.addMarker_ = function(marker) {
    var type = this.getMarkerType_(marker);

    this.hideMarkerView_(marker);

    this.ensureClusterGroup_(type);

    this.view_[type].addLayer(marker.getView());
  };


  /**
   * @method addBulkMarkers_
   * @param {Array.<aeris.maps.Marker>} markers
   * @private
   */
  MarkerCluster.prototype.addBulkMarkers_ = function(markers) {
    var markersByGroup = _.groupBy(markers, this.getMarkerType_, this);

    _.each(markersByGroup, function(markersInGroup, type) {
      var markerViews = markersInGroup.map(function(marker) {
        return marker.getView();
      });

      this.ensureClusterGroup_(type);

      markersInGroup.forEach(this.hideMarkerView_, this);

      this.view_[type].addLayers(markerViews);
    }, this);
  };


  /**
   * @method removeMarker_
   * @private
   * @param {aeris.maps.Marker} marker
   */
  MarkerCluster.prototype.removeMarker_ = function(marker) {
    this.getClusterForMarker_(marker).removeLayer(marker.getView());
  };


  /**
   * @method resetMarkers_
   * @private
   * @param {Array.<aeris.maps.Marker>=} opt_replacementMarkers
   */
  MarkerCluster.prototype.resetMarkers_ = function(opt_replacementMarkers) {
    _.invoke(this.view_, 'clearLayers');

    if (opt_replacementMarkers) {
      this.addBulkMarkers_(opt_replacementMarkers);
    }
  };


  /**
   * Hide a marker's view from the map,
   * without effecting the state of the marker object.
   *
   * @method hideMarkerView_
   * @private
   * @param {aeris.maps.Marker} marker
   */
  MarkerCluster.prototype.hideMarkerView_ = function(marker) {
    if (this.mapView_) {
      this.mapView_.removeLayer(marker.getView());
    }
  };


  /**
   * @method ensureClusterGroup_
   * @private
   * @param {string} type
   */
  MarkerCluster.prototype.ensureClusterGroup_ = function(type) {
    if (!this.view_[type]) {
      this.view_[type] = this.createCluster_(type);
    }
  };


  /**
   * @method getClusterForMarker_
   * @private
   * @param {aeris.maps.Marker} marker
   * @return {L.MarkerClusterGroup}
   */
  MarkerCluster.prototype.getClusterForMarker_ = function(marker) {
    var type = this.getMarkerType_(marker);
    return this.view_[type];
  };


  /**
   * @method getMarkerType_
   * @private
   * @param {aeris.maps.Marker} marker
   * @return {string} Marker group type
   */
  MarkerCluster.prototype.getMarkerType_ = function(marker) {
    return marker.getType() || MarkerCluster.SINGLE_CLUSTER_GROUPNAME_;
  };


  /**
   * @method bindObjectToView_
   * @private
   */
  MarkerCluster.prototype.bindObjectToView_ = function() {
    this.listenTo(this.object_, {
      'add': this.addMarker_,
      'remove': this.removeMarker_,
      'reset': function() {
        this.resetMarkers_(this.object_.models);
      }
    });
  };


  /**
   * @method proxyMouseEvents_
   * @private
   * @param {L.MarkerClusterGroup} cluster
   */
  MarkerCluster.prototype.proxyMouseEventsForCluster_ = function(cluster) {
    cluster.on({
      'clusterclick': this.triggerMouseEvent_.bind(this, 'cluster:click'),
      'clustermouseover': this.triggerMouseEvent_.bind(this, 'cluster:mouseover'),
      'clustermouseout': this.triggerMouseEvent_.bind(this, 'cluster:mouseout')
    }, this);
  };


  /**
   * Trigger a click event on the {aeris.maps.markercollections.MarkerCollection}
   * object, by transforming a {L.MouseEvent} object.
   *
   * @method triggerMouseEvent_
   * @private
   * @param {string} eventName The event to fire on the MarkerCollection.
   * @param {L.MouseEvent} eventObj
   */
  MarkerCluster.prototype.triggerMouseEvent_ = function(eventName, eventObj) {
    var latLon = mapUtil.toAerisLatLon(eventObj.latlng);

    this.object_.trigger(eventName, latLon);
  };


  /**
   * @property SINGLE_CLUSTER_GROUP_NAME_
   * @constant
   * @type {string}
   * @private
   */
  MarkerCluster.SINGLE_CLUSTER_GROUPNAME_ = 'MARKERCLUSTERSTRATEGY_SINGLE_CLUSTER';


  /**
   * @property CLUSTER_CSS_CLASS_
   * @type {string}
   * @private
   */
  MarkerCluster.CLUSTER_CSS_CLASS_ = 'aeris-cluster aeris-leaflet';


  return MarkerCluster;
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
