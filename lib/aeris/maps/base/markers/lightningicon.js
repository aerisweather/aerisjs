define(['aeris/util', 'base/markers/icon'], function(_) {

  /**
   * @fileoverview Representation of a Lightning Icon Marker.
   */


  _.provide('aeris.maps.markers.LightningIcon');


  /**
   * Create a Lightning Icon Marker
   *
   * @param {number} timestamp Time of the lightning strike.
   * @constructor
   * @extends {aeris.maps.markers.Icon}
   */
  aeris.maps.markers.LightningIcon = function(position, timestamp, opt_options) {

    aeris.maps.markers.Icon.call(this, position,
        _.config.path + 'assets/lightning_white.png', 15, 34, opt_options);


    /**
     * @override
     */
    this.name = 'LightningIcon';


    /**
     * The time of the lightning strike.
     *
     * @type {number}
     * @private
     */
    this.timestamp_ = null;


    /**
     * The age of the lightning strike.
     * e.g. '15', '30', '45', '60', and '60+'
     *
     * @type {string}
     * @private
     */
    this.age_ = null;


    this.setTimestamp(timestamp);

  };
  _.inherits(aeris.maps.markers.LightningIcon, aeris.maps.markers.Icon);


  /**
   * Url helper for the ages of the lightning strike.
   *
   * @private
   */
  aeris.maps.markers.LightningIcon.prototype.urlAges_ = {
    '15': 'lightning_white',
    '30': 'lightning_yellow',
    '45': 'lightning_red',
    '60': 'lightning_orange',
    '60+': 'lightning_blue'
  };


  /**
   * Set the time of the lightning strike.
   *
   * @param {number} timestamp Time of the lightning strike.
   */
  aeris.maps.markers.LightningIcon.prototype.setTimestamp =
      function(timestamp) {

    var now = Math.round((new Date()).getTime() / 1000);

    this.timestamp_ = timestamp;

    var diff = now - timestamp;
    if (diff <= 15 * 60)
      this.age_ = '15';
    else if (diff <= 30 * 60)
      this.age_ = '30';
    else if (diff <= 45 * 60)
      this.age_ = '45'
    else if (diff <= 60 * 60)
      this.age_ = '60'
    else
      this.age_ = '60+';

    this.url = _.config.path + 'assets/' + this.urlAges_[this.age_] + '.png';
  };


  /**
   * Get the time of the lightning strike.
   *
   * @return {number}
   */
  aeris.maps.markers.LightningIcon.prototype.getTimestamp = function() {
    return this.timestamp_;
  };


  /**
   * Get the age of the lightning strike.
   *
   * @return {string}
   */
  aeris.maps.markers.LightningIcon.prototype.getAge = function() {
    return this.age_;
  };


  return aeris.maps.markers.LightningIcon;

});
