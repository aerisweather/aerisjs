define(function() {
  /**
   * Looks up latLon coordinates for named locations
   *
   * @class GeocodeServiceInterface
   * @namespace aeris.geocode
   * @interface
   *
   * @constructor
   */
  var GeocodeServiceInterface = function() {};

  /**
   * @param {string} location The location to geocode.
   * @return {aeris.Promise} A promise to return a lat/lon for the
   *                        geocoded location.
   * @method geocode
   */
  GeocodeServiceInterface.prototype.geocode = function(location) {};


  return GeocodeServiceInterface;
});
