define(['aeris', './icon'], function(aeris) {

  /**
   * @fileoverview Representation of a Storm Report Icon Marker.
   */


  aeris.provide('aeris.maps.markers.StormReportIcon');


  /**
   * Create a Storm Report Icon Marker
   *
   * @param {string} code Code of the storm report.
   * @constructor
   * @extends {aeris.maps.markers.Icon}
   */
  aeris.maps.markers.StormReportIcon = function(position, code, opt_options) {

    aeris.maps.markers.Icon.call(this, position,
        aeris.config.path + 'assets/marker_grey.png', 20, 20, opt_options);


    /**
     * @override
     */
    this.name = 'StormReportIcon';


    /**
     * Code of the storm report.
     *
     * @type {string}
     * @private
     */
    this.code_ = null;


    /**
     * Type of the storm report.
     *
     * @type {string}
     * @private
     */
    this.type_ = null;


    this.setCode(code);

  };
  aeris.inherits(aeris.maps.markers.StormReportIcon, aeris.maps.markers.Icon);


  /**
   * Url helper for the codes storm reports.
   *
   * @private
   */
  aeris.maps.markers.StormReportIcon.prototype.urlCodes_ = {
    'T': 'tornado', // tornado
    'C': 'tornado', // funnel cloud
    'W': 'tornado', // water spout

    'O': 'highwind', // non tstorm wind damage
    'D': 'highwind', // tstorm wind damage
    'N': 'highwind', // high wind speed
    'G': 'highwind', // high wind gust
    'A': 'highwind', // high sustained winds
    'M': 'highwind', // marine thunderstorm winds

    'H': 'hail', // hail

    'E': 'flood', // flood
    'F': 'flood', // flash flood

    'R': 'rain', // heavy rain
    'L': 'lightning', // lightning

    '4': 'highsurf', // tides
    'P': 'highsurf', // rip currents

    '2': 'dust', // dust storm
    'A': 'avalanche', // avalanche
    'U': 'wildfire', // wildfire
    'S': 'snow' // snow
  };


  /**
   * Set the code of the storm report.
   *
   * @param {string} code Code of the storm report.
   */
  aeris.maps.markers.StormReportIcon.prototype.setCode = function(code) {
    this.code_ = code;
    if (this.urlCodes_[this.code_]) {
      this.url = aeris.config.path + 'assets/stormrep_marker_' +
                  this.urlCodes_[this.code_] + '.png';
      this.width = 25;
      this.height = 25;
    }
    this.type_ = this.urlCodes_[this.getCode()];
  };


  /**
   * Get the code of the storm report.
   *
   * @return {string}
   */
  aeris.maps.markers.StormReportIcon.prototype.getCode = function() {
    return this.code_;
  };


  /**
   * Get the type of the storm report.
   *
   * @return {string}
   */
  aeris.maps.markers.StormReportIcon.prototype.getType = function() {
    return this.type_;
  };


  return aeris.maps.markers.StormReportIcon;

});

