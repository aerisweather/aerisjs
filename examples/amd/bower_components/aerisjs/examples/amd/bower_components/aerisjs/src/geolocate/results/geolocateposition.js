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
   * @publicApi
   * @class GeolocatePosition
   * @namespace aeris.geolocate.results
   * @constructor
   */
  var GeolocatePosition = function(position) {
    _.defaults(position, {
      latLon: null,
      altitude: null,
      altitudeAccuracy: null,
      accuracy: null,
      heading: null,
      speed: null,
      timestamp: null
    });

    /**
     * @property {aeris.maps.LatLon} latLon
     */

    /**
     * @property {number|null} altitude
     */

    /**
     * @property {number|null} altitudeAccuracy
     */

    /**
     * @property {number|null} accuracy
     */

    /**
     * @property {number|null} heading
     */

    /**
     * @property {number|null} speed
     */

    /**
     * @property {Date|null} timestamp
     */

    return position;
  };

  return GeolocatePosition;
});
