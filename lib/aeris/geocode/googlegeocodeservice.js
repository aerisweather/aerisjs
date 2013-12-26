define([
  'aeris/util',
  'strategy/utils',
  'aeris/promise',
  'geocode/abstractgeocodeservice',
  'geocode/geocodeserviceresponse',
  'geocode/geocodeservicestatus'
], function(_, mapUtil, Promise, AbstractGeocodeService, GeocodeServiceResponse, GeocodeServiceStatus) {
  /**
   * @class aeris.geocode.GoogleGeocodeService
   * @extends aeris.geocode.AbstractGeocodeService
   * @constructor
   */
  var GoogleGeocodeService = function() {
    AbstractGeocodeService.apply(this, arguments);

    this.googleService_ = new google.maps.Geocoder();
  };
  _.inherits(GoogleGeocodeService, AbstractGeocodeService);


  /**
   * For dependency injection
   * @param {Object} service
   */
  GoogleGeocodeService.prototype.setGoogleService = function(service) {
    this.googleService_ = service;
  };


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
            message: 'Succesfully geocoded location: ' + location
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
