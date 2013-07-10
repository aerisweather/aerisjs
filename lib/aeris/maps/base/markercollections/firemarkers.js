define(['aeris', 'base/markercollection'], function(aeris) {
  /**
   * @fileoverview Defines the {aeris.maps.markerCollections.FireMarkers} class.
   */

  aeris.provide('aeris.maps.markerCollections.FireMarkers');


  /**
   * A collection of markers associated with fire data.
   * Data provided by the Aeris API `fires` endpoint
   * @see {@link http://www.hamweather.com/support/documentation/aeris/endpoints/fires|Aeris API Documentation}
   *
   * @param {Object} opt_options Options to pass to the {aeris.maps.markers.Icon} object.
   * @extends aeris.maps.MarkerCollection
   * @constructor
   */
  aeris.maps.markerCollections.FireMarkers = function(opt_options) {
    aeris.maps.MarkerCollection.apply(this, arguments);

    // Set fire icon
    aeris.extend(this.markerOptions_, {
      url: aeris.config.path + 'assets/map_fire_marker.png',
      width: 27,
      height: 48
    });
  };

  // Extend from MarkerCollection
  aeris.inherits(
    aeris.maps.markerCollections.FireMarkers,
    aeris.maps.MarkerCollection
  );

  /**
   * @override
   */
  aeris.maps.markerCollections.FireMarkers.prototype.fetchMarkerData_ = function() {
    return aeris.AerisAPI.getInstance().getFireData();
  };

  return aeris.maps.markerCollections.FireMarkers;
});
