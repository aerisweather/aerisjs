define([
  'aeris/util',
  'aeris/maps/strategy/utils',
  'googlemaps!',
  'aeris/promise',
  'aeris/geocode/geocodeserviceresponse',
  'aeris/geocode/geocodeservicestatus'
], function(_, mapUtil, gmaps, Promise, GeocodeServiceResponse, GeocodeServiceStatus) {
  /**
   * @publicApi
   * @class GoogleGeocodeService
   * @namespace aeris.geocode
   * @implements aeris.geocode.GeocodeServiceInterface
   * @constructor
   */
  var GoogleGeocodeService = function() {
    this.googleService_ = new gmaps.Geocoder();
  };

  GoogleGeocodeService.prototype.setGoogleService = function(service) {
    this.googleService_ = service;
  };


  /**
   * @method geocode
   */
  GoogleGeocodeService.prototype.geocode = function(location) {
    var promise = new Promise();

    // Map google status codes to aeris status codes
    var statusMap = {
      'OK': 'OK',
      'OVER_QUERY_LIMIT': 'API_ERROR',
      'ZERO_RESULTS': 'NO_RESULTS',
      'REQUEST_DENIED': 'API_ERROR',
      'INVALID_REQUEST': 'INVALID_REQUEST'
    };

    var query = {
      address: location
    };

    // Query geocoding service
    this.googleService_.geocode(query, function(res, apiStatus) {
      // Map aeris status from google status
      var aerisStatus = GeocodeServiceStatus[statusMap[apiStatus]];

      // Successful response --> resolve promise
      if (aerisStatus === GeocodeServiceStatus.OK) {
        promise.resolve(new GeocodeServiceResponse({
          latLon: mapUtil.latLngToArray(res[0].geometry.location),
          status: new GeocodeServiceResponse({
            code: aerisStatus,
            apiCode: apiStatus,
            message: 'Successfully geocoded location: ' + location
          })
        }));
      }

      // Unsuccess response --> reject promise
      else {
        promise.reject({
          status: new GeocodeServiceResponse({
            code: aerisStatus,
            apiCode: apiStatus,
            message: 'Error geocoding location: ' + apiStatus
          })
        });
      }
    });

    return promise;
  };


  return _.expose(GoogleGeocodeService, 'aeris.geocode.GoogleGeocodeService');
});
