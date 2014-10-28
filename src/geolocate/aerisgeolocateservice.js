define([
  'aeris/util',
  'aeris/api/models/place',
  'aeris/promise',
  'aeris/errors/unsupportedfeatureerror',
  'aeris/geolocate/results/geolocateposition',
  'aeris/geolocate/errors/geolocateserviceerror'
], function(_, Place, Promise, UnsupportedFeatureError, GeolocatePosition, GeolocateServiceError) {
  /**
   * Uses the Aeris API /places endpoint to lookup
   * a lat/lon coordinate from a place name.
   *
   * @class aeris.geolocate.AerisGeolocateService
   * @implements aeris.geolocate.GeolocateServiceInterface
   *
   * @constructor
   *
   * @param {function():aeris.api.models.Place} opt_options.PlaceApi
   *        aeris.api model used to query the Aeris API.
   */
  var AerisGeolocateService = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      PlaceApi: Place
    });

    /**
     * @property PlaceApi_
     * @private
     * @type {function():aeris.api.models.Place}
     */
    this.PlaceApi_ = options.PlaceApi;
  };


  /**
   * @method geolocate
   * @param {string} location
   */
  AerisGeolocateService.prototype.getCurrentPosition = function() {
    var promiseToGeolocate = new Promise();
    var place = new this.PlaceApi_(null, {
      params: {
        p: ':auto'
      }
    });

    place.fetch().
      done(_.compose(
        promiseToGeolocate.resolve.
          bind(promiseToGeolocate),
        this.createGeolocateSuccessResponse_
      )).
      fail(_.compose(
        promiseToGeolocate.reject.
          bind(promiseToGeolocate),
        this.createGeolocateErrorResponse_
      ));

    return promiseToGeolocate;
  };


  /**
   * Not currently supported.
   *
   * @method watchPosition
   */
  AerisGeolocateService.prototype.watchPosition = function() {
    throw new UnsupportedFeatureError('The AerisGeolocationService does not currently support #watchPosition.');
  };


  /**
   * @method createGeolocateSuccessResponse_
   * @private
   * @param {Object} apiResponseData
   */
  AerisGeolocateService.prototype.createGeolocateSuccessResponse_ = function(apiResponseData) {
    return new GeolocatePosition({
      latLon: [apiResponseData.response.loc.lat, apiResponseData.response.loc.long]
    });
  };


  /**
   * @method createGeolocateErrorResponse_
   * @private
   * @param {aeris.errors.ApiResponseError} apiResponseError
   */
  AerisGeolocateService.prototype.createGeolocateErrorResponse_ = function(apiResponseError) {
    var errorCodeLookup = {
      invalid_client: GeolocateServiceError.PERMISSION_DENIED,
      invalid_location: GeolocateServiceError.POSITION_UNAVAILABLE
    };

    return new GeolocateServiceError({
      code: errorCodeLookup[apiResponseError.code] || GeolocateServiceError.POSITION_UNAVAILABLE,
      message: apiResponseError.message
    });
  };

  return _.expose(AerisGeolocateService, 'aeris.geolocate.AerisGeolocateService');
});

