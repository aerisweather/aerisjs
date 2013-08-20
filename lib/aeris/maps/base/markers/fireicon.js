define(['aeris/util', './icon'], function(_) {

  /**
   * @fileoverview Representation of a Fire Icon Marker.
   */


  _.provide('aeris.maps.markers.FireIcon');


  /**
   * Create a Fire Icon Marker
   *
   * @constructor
   * @extends {aeris.maps.markers.Icon}
   */
  aeris.maps.markers.FireIcon = function(position, opt_options) {
    aeris.maps.markers.Icon.call(this, position,
        _.config.path + 'assets/map_fire_marker.png', 27, 48, opt_options);


    /**
     * @override
     */
    this.name = 'FireIcon';

  };
  _.inherits(aeris.maps.markers.FireIcon, aeris.maps.markers.Icon);


  return aeris.maps.markers.FireIcon;

});
