define(['aeris', './icon'], function(aeris) {

  /**
   * @fileoverview Representation of a Fire Icon Marker.
   */


  aeris.provide('aeris.maps.markers.FireIcon');


  /**
   * Create a Fire Icon Marker
   *
   * @constructor
   * @extends {aeris.maps.markers.Icon}
   */
  aeris.maps.markers.FireIcon = function(position, opt_options) {
    aeris.maps.markers.Icon.call(this, position,
        aeris.config.path + 'assets/map_fire_marker.png', 27, 48, opt_options);


    /**
     * @override
     */
    this.name = 'FireIcon';

  };
  aeris.inherits(aeris.maps.markers.FireIcon, aeris.maps.markers.Icon);


  return aeris.maps.markers.FireIcon;

});
