define([
  'aeris/util', 'aeris/aerisapi', 'base/markercollections/aerisendpoint', 'base/markers/fireicon'
], function(_) {

  /**
   * @fileoverview Defines the {aeris.maps.markerCollections.FireMarkers} class.
   */

  _.provide('aeris.maps.markerCollections.FireMarkers');


  /**
   * A collection of markers associated with fire data.
   * Data provided by the Aeris API `fires` endpoint
   * @see {@link http://www.hamweather.com/support/documentation/aeris/endpoints/fires|Aeris API Documentation}
   *
   * @param {Object} opt_options Options to pass to the {aeris.maps.markers.Icon} object.
   * @extends aeris.maps.markercollections.AerisEndpoint
   * @constructor
   * @class aeris.maps.markercollections.FireMarkers
   */
  aeris.maps.markerCollections.FireMarkers = function(opt_options) {
    aeris.maps.markercollections.AerisEndpoint.apply(this, arguments);


    /**
     * @override
     */
    this.endpoint_ = 'fires';


    /**
     * @override
     */
    this.action_ = 'search';
  };

  // Extend from MarkerCollection
  _.inherits(
    aeris.maps.markerCollections.FireMarkers,
    aeris.maps.markercollections.AerisEndpoint
  );


  /**
   * @override
   */
  aeris.maps.markerCollections.FireMarkers.prototype.generateMarker_ =
      function(point, options) {
    var latLon = [point.loc.lat, point.loc.long];
    var marker = new aeris.maps.markers.FireIcon(latLon, options);
    return marker;
  };


  aeris.maps.markerCollections.FireMarkers.prototype.getParams_ = function() {
    return {
      limit: 500,
      query: 'type:L'
    };
  };


  return aeris.maps.markerCollections.FireMarkers;

});
