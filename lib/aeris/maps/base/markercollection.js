define([
  'aeris/promise',
  'aeris/aerisapi',
  'aeris/errors/apiresponseerror',
  'aeris/util',
  'aeris/promise',
  'aeris/events',
  'base/extension/mapextensionobject'
], function(Promise, AerisAPI, APIResponseError, _) {

  /**
   * @fileoverview Defines an interface of a MarkerCollection object.
   */

  _.provide('aeris.maps.markers.MarkerCollection');


  /**
   * A collection of icon markers ({aeris.maps.markers.Icon})
   *
   * @abstract
   * @param {Object} opt_markerOptions Options to pass on to {aeris.maps.markers.Icon}.
   * @extends {aeris.maps.extension.MapExtensionObject}
   * @constructor
   */
  aeris.maps.MarkerCollection = function(opt_markerOptions) {

    // Call parent class constructor
    aeris.maps.extension.MapExtensionObject.call(this);
    aeris.Events.call(this);

    /**
     * @type {Array.<aeris.maps.markers.Icon>} Markers belonging to this collection.
     * @private
     */
    this.markers_ = [];


    /**
     * Options to use when instantiating each {aeris.maps.markers.Icon}
     *
     * @type {Object}
     * @protected
     */
    this.markerOptions_ = opt_markerOptions || {};


    /**
     * @type {aeris.Promise} Promise to fetch marker data from the AerisAPI. Resolves with marker data.
     */
    this.initialized = new aeris.Promise();


    /**
     * The AerisAPI endpoint associated
     * with this marker collection
     *
     * @type {string}
     * @protected
     */
    this.endpoint_ = null;


    /**
     * The AerisAPI action associated
     * with this marker collection
     *
     * @type {string}
     * @protected
     */
    this.action_ = 'within';
  };

  // Extend from MapExtensionObject
  _.inherits(
      aeris.maps.MarkerCollection,
      aeris.maps.extension.MapExtensionObject
  );

  // Mixin events
  _.extend(
    aeris.maps.MarkerCollection.prototype,
    aeris.Events.prototype
  );


  /**
   * Load marker data, then add the markers to the map
   *
   * @override
   */
  aeris.maps.MarkerCollection.prototype.setMap = function(_Map) {
    aeris.maps.extension.MapExtensionObject.prototype.setMap.apply(this, arguments);

    this.delegateEvents();
  };


  /**
   * Clear, fetch, and redraw markers
   */
  aeris.maps.MarkerCollection.prototype.refresh = function() {
    // Tear down
    this.undelegateEvents();

    // And rebuild
    this.fetch().done(function() {
      this.renderMarkers();
      this.delegateEvents();
    }, this);

    this.initialized.resolve();
  };


  /**
   * Add each marker in the collection to the map
   *
   * @param {Array<aeris.maps.markers.Icon>} opt_markers Optional collection of markers to render.
   *                                                     Defaults to this.markers_.
   * @private
   */
  aeris.maps.MarkerCollection.prototype.renderMarkers = function(opt_markers) {
    var markers = opt_markers || this.markers_;

    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i];

      // Pass markers through filter, before rendering
      if (this.filterMarker(marker)) {
        marker.setMap(this.aerisMap);
      }
    }
  };


  /**
   * Remove each marker in the collection from the map.
   *
   * @param {Array<aeris.maps.Marker>=} opt_markers
   */
  aeris.maps.MarkerCollection.prototype.clearMarkers = function(opt_markers) {
    var markers = opt_markers || this.markers_;
    for (var i = 0, length = markers.length; i < length; i++) {
      var marker = this.markers_[i];
      marker.remove();
    }

    this.undelegateEvents();
  };


  /**
   * Get data associated with markers from AerisAPI.
   *
   * @fires aeris.maps.MarkerCollection#reset
   * @return {aeris.Promise} A promise to fetch marker data. Resolves with marker data.
   */
  aeris.maps.MarkerCollection.prototype.fetch = function() {
    var promise = new Promise();
    var params = {
      limit: 100,
      p: AerisAPI.serializeBounds(this.getBounds())
    };

    if (this.getParams_) {
      _.extend(params, this.getParams_());
    }

    AerisAPI.getInstance().fetch(this.endpoint_, this.action_, params).
    done(function(data) {
      this.clearMarkers();

      // Pass the marker data through the parse method
      // to get real Markers
      this.markers_ = this.parse_(data);

      this.trigger('reset', this.markers_);
        promise.resolve();
    }, this).
    fail(function() {
      promise.reject();
    }, this);

    return promise;
  };


  /**
   * Converts AerisAPI response data to {aeris.map.Marker} instances.
   *
   * @param {Object} data Response data from the AerisAPI.
   * @return {Array<aeris.map.Marker>}
   * @protected
   */
  aeris.maps.MarkerCollection.prototype.parse_ = function(data) {
    var markers = [];

    // Enforce data format
    if (!data.response) {
      throw new APIResponseError('Unable to process marker data: unexpected data format');
    }

    for (var i = 0; i < data.response.length; i++) {
      var point = data.response[i];
      var marker = this.generateMarker_(point, this.markerOptions_);

      marker.on('click', this.getOnClick_(marker, point));
        marker.on('click', function() {
          console.log('clicked');
        });

      markers.push(marker);
    }

    return markers;
  };


  /**
   * Generate a new marker for the collection using the point information and
   * options.
   *
   * @protected
   *
   * @param {Object} point Point data from the AerisAPI.
   * @param {Object} options Additional marker options.
   * @return {aeris.maps.Marker}
   */
  aeris.maps.MarkerCollection.prototype.generateMarker_ = _.abstractMethod;


  /**
   * Returns the handler method for a marker's `click` event
   *
   * @param {aeris.maps.markers.Icon} marker Bound marker.
   * @param {Object} data Data associated with marker.
   * @return {Function} onClick Handler.
   * @private
   */
  aeris.maps.MarkerCollection.prototype.getOnClick_ = function(marker, data) {
    var self = this;
    return function() {
      self.trigger('marker:click', marker, data);
    }
  };


  /**
   * Delegate marker collection events
   */
  aeris.maps.MarkerCollection.prototype.delegateEvents = function() {
    // Refresh marker data when parameters change
    this.listenTo(this.getMap().options, 'change:bounds', this.refresh);
    this.listenTo(this, 'filter', this.refresh);
  };


  /**
   * Unbind all bound events.
   */
  aeris.maps.MarkerCollection.prototype.undelegateEvents = function() {
    this.stopListening();
  };


  /**
   * Get the map bounds.
   *
   * @param {Array.<Array>} bounds
   */
  aeris.maps.MarkerCollection.prototype.getBounds = function(bounds) {
    return this.getMap().options.getBounds();
  };

  /*
   * Filter a marker to determine if it should be displayed on the map.
   *
   * @param {aeris.maps.Marker} marker The marker to filter.
   * @return {boolean}
   */
  aeris.maps.MarkerCollection.prototype.filterMarker = function(marker) {
    return true;
  };


  return aeris.maps.MarkerCollection;
});
