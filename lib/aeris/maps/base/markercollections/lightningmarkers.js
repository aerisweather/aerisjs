define([
  'aeris/util',
  'aeris/aerisapi',
  'base/markercollections/aerisendpoint',
  'base/markers/lightningicon'
], function(_) {

  /**
   * @fileoverview Defines the {aeris.maps.markerCollections.LightningMarkers} class.
   */

  _.provide('aeris.maps.markerCollections.LightningMarkers');


  /**
   * A collection of markers associated with lightning data.
   * Data provided by the Aeris API `lightning` endpoint
   *
   * @param {Object} opt_options Options to pass to the
   *     {aeris.maps.markers.Icon} object.
   * @extends aeris.maps.markercollections.AerisEndpoint
   * @constructor
   */
  aeris.maps.markerCollections.LightningMarkers = function(opt_options) {

    aeris.maps.markercollections.AerisEndpoint.apply(this, arguments);


    /**
     * @override
     */
    this.endpoint_ = 'lightning';
  };

  // Extend from MarkerCollection
  _.inherits(
    aeris.maps.markerCollections.LightningMarkers,
    aeris.maps.markercollections.AerisEndpoint
  );


  /**
   * @override
   */
  aeris.maps.markerCollections.LightningMarkers.prototype.getParams_ = function() {
    return {
      limit: 1000,
      sort: 'dt:-1'
    };
  };


  /**
   * @override
   */
  aeris.maps.markerCollections.LightningMarkers.prototype.generateMarker_ =
      function(point, options) {
    var latLon = [point.loc.lat, point.loc.long];
    var timestamp = point.ob.timestamp;
    var marker = new aeris.maps.markers.LightningIcon(latLon, timestamp,
                                                      options);
    return marker;
  };


  return aeris.maps.markerCollections.LightningMarkers;

});
