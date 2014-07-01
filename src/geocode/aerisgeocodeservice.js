define([
  'aeris/util',
  'aeris/api/models/place',
  'aeris/promise',
  'aeris/geocode/geocodeserviceresponse',
  'aeris/geocode/geocodeservicestatus'
], function(_, Place, Promise, GeocodeServiceResponse, GeocodeServiceStatus) {
  /**
   * Uses the Aeris API /places endpoint to lookup
   * a lat/lon coordinate from a place name.
   *
   * @class AerisGeocodeService
   * @namespace aeris.geocode
   * @implements aeris.geocode.GeocodeServiceInterface
   *
   * @constructor
   *
   * @param {function():aeris.api.models.Place} opt_options.PlaceApi
   *        aeris.api model used to query the Aeris API.
   */
  var AerisGeocodeService = function(opt_options) {
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
   * @method geocode
   * @param {string} location
   */
  AerisGeocodeService.prototype.geocode = function(location) {
    var promiseToGeocode = new Promise();
    var place = new this.PlaceApi_(null, {
      params: {
        p: location
      }
    });

    place.fetch().
      done(_.compose(
        promiseToGeocode.resolve.
          bind(promiseToGeocode),
        this.createGeocodeSuccessResponse_
      )).
      fail(_.compose(
        promiseToGeocode.reject.
          bind(promiseToGeocode),
        this.createGeocodeErrorResponse_
      ));

    return promiseToGeocode;
  };


  /**
   * @method createGeocodeSuccessResponse_
   * @private
   * @param {Object} apiResponseData
   */
  AerisGeocodeService.prototype.createGeocodeSuccessResponse_ = function(apiResponseData) {
    var latLon = [apiResponseData.response.loc.lat, apiResponseData.response.loc.long];

    return new GeocodeServiceResponse({
      latLon: latLon,
      status: {
        code: GeocodeServiceStatus.OK,
        message: 'Successfully geocoded location at ' + latLon.toString()
      }
    });
  };


  /**
   * @method createGeocodeErrorResponse_
   * @private
   * @param {aeris.errors.ApiResponseError} apiResponseError
   */
  AerisGeocodeService.prototype.createGeocodeErrorResponse_ = function(apiResponseError) {
    var apiCodeLookup = {
      'invalid_location': GeocodeServiceStatus.NO_RESULTS,
      'invalid_client': GeocodeServiceStatus.API_ERROR
    };

    return new GeocodeServiceResponse({
      latLon: undefined,
      status: {
        code: apiCodeLookup[apiResponseError.code] || GeocodeServiceStatus.API_ERROR,
        apiCode: apiResponseError.code,
        message: apiResponseError.message
      }
    });
  };

  return _.expose(AerisGeocodeService, 'aeris.geocode.AerisGeocodeService');
});

