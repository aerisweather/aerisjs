define(['aeris', './icon'], function(aeris) {

  /**
   * @fileoverview Representation of a Earthquake Icon Marker.
   */


  aeris.provide('aeris.maps.markers.EarthquakeIcon');


  /**
   * Create an Earthquake Icon Marker
   *
   * @param {string} type Type of the earthquake.
   * @constructor
   * @extends {aeris.maps.markers.Icon}
   */
  aeris.maps.markers.EarthquakeIcon = function(position, type, opt_options) {

    aeris.maps.markers.Icon.call(this, position,
        aeris.config.path + 'assets/default-marker.png', 20, 20, opt_options);


    /**
     * @override
     */
    this.name = 'EarthquakeIcon';


    /**
     * Type of the earthquake.
     *
     * @type {string}
     * @private
     */
    this.type_ = null;


    this.setType(type);

  };
  aeris.inherits(aeris.maps.markers.EarthquakeIcon, aeris.maps.markers.Icon);


  aeris.maps.markers.EarthquakeIcon.prototype.iconDimensions_ = {
    'mini': 18,
    'minor': 31,
    'light': 45,
    'moderate': 58,
    'strong': 86,
    'major': 100,
    'great': 100
  };


  /**
   * Set the type of the earthquake.
   *
   * @param {string} type Type of the earthquake.
   */
  aeris.maps.markers.EarthquakeIcon.prototype.setType = function(type) {
    this.type_ = type;
    this.url = aeris.config.path + 'assets/quake_' + this.type_ + '.png';
    this.width = this.iconDimensions_[this.type_];
    this.height = this.iconDimensions_[this.type_];
  };


  /**
   * Get the type of the earthquake.
   *
   * @return {string}
   */
  aeris.maps.markers.EarthquakeIcon.prototype.getType = function() {
    return this.type_;
  };


  return aeris.maps.markers.EarthquakeIcon;

});


