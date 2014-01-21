define(function() {
  /**
   * @class aeris.geocode.GeocodeServiceInterface
   * @interface
   *
   * @constructor
   */
  var GeocodeServiceInterface = function() {};

  /**
   * @param {string} location The location to geocode.
   * @return {aeris.Promise} A promise to return a lat/lon for the
   *                        geocoded location.
   */
  GeocodeServiceInterface.prototype.geocode = function(location) {};


  return GeocodeServiceInterface;
});
