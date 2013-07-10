define(['aeris', 'aeris/promise', 'aeris/events', 'base/extension/mapextensionobject', 'base/markers/icon'], function(aeris) {
  /**
   * @fileoverview Defines an interface of a MarkerCollection object.
   */

  aeris.provide('aeris.maps.markers.MarkerCollection');


  /**
   * A collection of icon markers ({aeris.maps.markers.Icon})
   *
   * @abstract
   * @param {Object} opt_markerOptions Options to pass on to {aeris.maps.markers.Icon}.
   * @constructor
   */
  aeris.maps.MarkerCollection = function(opt_markerOptions) {
    opt_markerOptions || (opt_markerOptions = {});

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
    this.markerOptions_ = aeris.extend({
      url: '/assets/wx-details-marker.png',
      width: 20,
      height: 20
    }, opt_markerOptions);


    /**
     * @type {aeris.Promise} Promise to fetch marker data from the AerisAPI. Resolves with marker data.
     */
    this.initialized = new aeris.Promise();
  };

  // Extend from MapExtensionObject
  aeris.inherits(
      aeris.maps.MarkerCollection,
      aeris.maps.extension.MapExtensionObject
  );

  // Mixin events
  aeris.extend(
    aeris.maps.MarkerCollection.prototype,
    aeris.Events.prototype
  );


  /**
   * Load marker data, then add the markers to the map
   *
   * @override
   */
  aeris.maps.MarkerCollection.prototype.setMap = function(aerisMap) {
    var self = this;

    aeris.maps.extension.MapExtensionObject.prototype.setMap.apply(this, arguments);

    // Load data from API, then add markers to map
    this.fetchMarkerData_().done(function(data) {
      self.processMarkers_(data);
      self.renderMarkers();

      self.initialized.resolve(data);
    }).fail(function(error) {
      self.initialized.reject(error);
    });
  };


  /**
   * Add each marker in the collection to the map
   *
   * @param {Array<aeris.maps.markers.Icon>} opt_markers Optional collection of markers to render.
   *                                                     Defaults to this.markers_.
   */
  aeris.maps.MarkerCollection.prototype.renderMarkers = function(opt_markers) {
    var markers = opt_markers || this.markers_;

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(this.aerisMap);
    }
  };


  /**
   * Creates {aeris.map.Marker} instances from AerisAPI response data
   *
   * @param {Object} data Response data from the AerisAPI.
   */
  aeris.maps.MarkerCollection.prototype.processMarkers_ = function(data) {
    // Enforce data format
    if (!data.response) {
      throw new Error('Unable to process marker data: unexpected data format');
    }

    for (var i = 0; i < data.response.length; i++) {
      var fireData = data.response[i];
      var latLon = [fireData.loc.lat, fireData.loc.long];
      var marker = new aeris.maps.markers.Icon(
        latLon,
        this.markerOptions_.url,
        this.markerOptions_.width,
        this.markerOptions_.height
      );

      marker.click = this.getOnClick_(marker, fireData);

      this.markers_.push(marker);
    }
  };


  /**
   * Fetch data associated with markers from AerisAPI.
   *
   * @method
   * @abstract
   * @private
   * @return {aeris.Promise} A promise to fetch marker data. Resolves with marker data.
   */
  aeris.maps.MarkerCollection.prototype.fetchMarkerData_ = aeris.abstractMethod;


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

  return aeris.maps.MarkerCollection;
});
