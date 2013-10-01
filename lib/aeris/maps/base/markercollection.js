define([
  'base/extension/mapextensionobject',
  'aeris/promise',
  'aeris/aerisapi',
  'aeris/errors/apiresponseerror',
  'aeris/util',
  'aeris/promise',
  'aeris/events'
], function(MapExtensionObject, Promise, AerisAPI, APIResponseError, _) {

  /**
   * @fileoverview Defines an interface of a MarkerCollection object.
   */

  _.provide('aeris.maps.MarkerCollection');


  /**
   * A collection of markers ({aeris.maps.Marker})
   *
   * @extends {aeris.maps.extension.MapExtensionObject}
   * @param {Object} opt_markerOptions
   *
   * @class aeris.maps.MarkerCollection
   * @constructor
   */
  aeris.maps.MarkerCollection = function(opt_markerOptions) {

    // Call parent class constructor
    MapExtensionObject.call(this);
    aeris.Events.call(this);

    /**
     * @type {Array.<aeris.maps.Marker>} Markers belonging to this collection.
     * @private
     */
    this.markers_ = [];

  };

  // Extend from MapExtensionObject
  _.inherits(
      aeris.maps.MarkerCollection,
      MapExtensionObject
  );

  // Mixin events
  _.extend(
    aeris.maps.MarkerCollection.prototype,
    aeris.Events.prototype
  );


  /**
   * Add the markers to the map.
   *
   * @override
   */
  aeris.maps.MarkerCollection.prototype.setMap = function(aerisMap) {
    MapExtensionObject.prototype.setMap.
        call(this, aerisMap);
    this.renderMarkers_();
  };


  /**
   * Add each marker in the collection to the map
   *
   * @param {Array<aeris.maps.Marker>} opt_markers Optional array of
   *     markers to render. Defaults to this.getMarkers().
   * @private
   */
  aeris.maps.MarkerCollection.prototype.renderMarkers_ =
      function(opt_markers) {
    var markers = opt_markers || this.getMarkers();

    _.each(markers, function(marker) {
      marker.setMap(this.aerisMap);
    }, this);
  };


  /**
   * Remove each marker in the collection from the map.
   *
   * @param {Array<aeris.maps.Marker>=} opt_markers Optional array of markers
   *     to remove. Defaults to this.getMarkers().
   */
  aeris.maps.MarkerCollection.prototype.clear = function(opt_markers) {
    var markers = opt_markers || this.getMarkers();

    _.each(markers, function(marker) {
      marker.remove();
    }, this);
  };


  /**
   * Add a marker to the collection.
   *
   * @param {aeris.maps.Marker} marker The marker to add to the collection.
   */
  aeris.maps.MarkerCollection.prototype.add = function(marker) {
    this.markers_.push(marker);
  };


  /**
   * Remove a marker from the collection.
   *
   * @param {aeris.maps.Marker} marker The marker to remove from the collection.
   */
  aeris.maps.MarkerCollection.prototype.remove = function(marker) {
    this.markers_ = _.without(this.markers, marker);
  };


  /**
   * Get the markers in the collection.
   *
   * @return {Array.<aeris.maps.Marker>}
   */
  aeris.maps.MarkerCollection.prototype.getMarkers = function() {
    return this.markers_;
  };


  return aeris.maps.MarkerCollection;

});
