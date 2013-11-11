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
  'aeris/errors/invalidargumenterror',
  'aeris/collection',
  'base/markers/pointdatamarker',
  'api/endpoint/collection/pointdatacollection'
], function(_, InvalidArgumentError, BaseCollection, PointDataMarker, PointDataCollection) {
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
   *
   * @param {Array.<aeris.maps.markers.PointDataMarker=>} opt_markers
   * @param {Object=} opt_options
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


    var options = _.extend({
      marker: PointDataMarker
    }, opt_options);


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



    BaseCollection.call(this, opt_markers, options);


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
      'all': function() {
        if (this.hasMap()) {
          this.data_.fetch();
        }
      }
    });
  };
  _.inherits(PointDataMarkerCollection, BaseCollection);


  /**
   * Set the map on which to render set all child markers.
   *
   * @param {aeris.maps.Map} aerisMap
   */
  PointDataMarkerCollection.prototype.setMap = function(aerisMap) {
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

    // Fetch data, to display on map
    this.data_.fetch();
  };


  /**
   * Remove all markers from the map.
   */
  PointDataMarkerCollection.prototype.removeMap = function() {
    this.unbindMapEvents_();

    this.map_ = null;

    this.each(function(marker) {
      marker.setMap(null);
    }, this);
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

    // Fetch new data when map viewport changes
    this.listenTo(this.getMap(), {
      'change:bounds': function() {
        this.data_.fetch();
      }
    });
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
   * Return possible filters to use on the marker collection.
   *
   * @return {Array.<string>}
   */
  PointDataMarkerCollection.prototype.getValidFilters = function() {
    return this.data_.getValidFilters();
  };


  return PointDataMarkerCollection;
});
