define(['aeris/util'], function(_) {
  /**
   * Follows HTML5 Postion object specification,
   * except for the latLon property, which uses the aeris-standard format.
   *
   * Some position properties may be unavailable - if using
   * a IP location service, for example. In this case, their
   * values will be {null}.
   *
   * @param {Object} position Gelocated position.
   * @class aeris.geolocate.GeolocatePosition
   * @constructor
   */
  var GeolocatePosition = function(position) {
    position = _.extend({
      latLon: null,
      altitude: null,
      altitudeAccuracy: null,
      accuracy: null,
      heading: null,
      speed: null,
      timestamp: null
    }, position);

    /**
     * @member {Array.<number>} latLon
     */

    /**
     * @member {number|null} altitude
     */

    /**
     * @member {number|null} altitudeAccuracy
     */

    /**
     * @member {number|null} accuracy
     */

    /**
     * @member {number|null} heading
     */

    /**
     * @member {number|null} speed
     */

    /**
     * @member {Date|null} timestamp
     */

    return position;
  };

  return GeolocatePosition;
});
