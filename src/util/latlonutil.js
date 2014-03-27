define([
  'aeris/util'
], function(_) {
  /**
   * @class latLonUtil
   * @namespace aeris.util
   * @static
   */
  var latLonUtil = {
    /**
     * Converts a decimal coordinate
     * to degrees.
     *
     * eg. 45.1234567 --> [45, 7, 24.4452]
     *
     * @param {number} decimal
     * @return {Array.<number>} as [degrees, seconds, minutes].
     * @method decimalToDegrees
     */
    decimalToDegrees: function(decimal) {
      var sign = decimal >= 0 ? 1 : -1;
      var deg, min, sec;

      deg = Math.abs(decimal);
      min = (deg - Math.floor(deg)) * 60;
      sec = (min - Math.floor(min)) * 60;

      return [
        Math.floor(deg) * sign,
        Math.floor(min),
        sec
      ];
    },


    /**
     * Converts an array of [degrees, minutes, seconds]
     * to a decimal coordinate.
     *
     * eg. [45, 7, 24.4452] --> 45.1234567
     *
     * @param {Array.<number>} degrees as [degrees, minutes, seconds].
     * @return {number}
     * @method degreesToDecimal
     */
    degreesToDecimal: function(degrees) {
      var sign = degrees[0] >= 0 ? 1 : -1;

      var dec = Math.abs(degrees[0]);
      dec += degrees[1] / 60;
      dec += (degrees[2] / 60) / 60;

      return dec * sign;
    },


    /**
     * Converts a latLon coordinate to degrees, minutes, and seconds.
     *
     * eg.  [45.1234567, -90.1234567]
     * --> [[45, 7, 24.4452], [-90, 7, 24.4452]]
     *
     * @param {aeris.maps.LatLon} latLon
     * @return {aeris.maps.Bounds} Array of North and West coordinates
     *                                  as [degrees, minutes, seconds].
     * @method latLonToDegrees
     */
    latLonToDegrees: function(latLon) {
      return [
        this.decimalToDegrees(latLon[0]),
        this.decimalToDegrees(latLon[1])
      ];
    },


    /**
     * Converts a coordinate from degrees to decimal latLon.
     *
     * eg. [[45, 7, 24.4452], [-90, 7, 24.4452]]
     * --> [45.1234567, -90.1234567]
     *
     * @param {Array.<Array.<number>>} degrees
     *                                 Array of North and West coordinates
     *                                 as [degrees, minutes, seconds].
     * @return {aeris.maps.LatLon} LatLon coordinates as decimals.
     * @method degreesToLatLon
     */
    degreesToLatLon: function(degrees) {
      return [
        this.degreesToDecimal(degrees[0]),
        this.degreesToDecimal(degrees[1])
      ];
    }
  };

  return latLonUtil;
});
