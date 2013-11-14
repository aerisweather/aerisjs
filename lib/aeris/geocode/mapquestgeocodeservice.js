define([
  'aeris/util',
  'aeris/promise',
  'aeris/aerisapi',
  'aeris/jsonp',
  'geocode/abstractgeocodeservice',
  'geocode/geocodeserviceresponse',
  'geocode/geocodeservicestatus'
], function(_, Promise, AerisAPI, JSONP, AbstractGeocodeService, GeocodeServiceResponse, GeocodeServiceStatus) {
  /**
   * MapQuest Geocoding Service
   * See http://open.mapquestapi.com/geocoding
   *
   * @class aeris.geocode.MapQuestGeocodeService
   * @extends {aeris.geocode.AbstractGeocodeService}
   * @constructor
   */
  var MapQuestGeocodeService = function() {
    AbstractGeocodeService.apply(this, arguments);

    // Check that we have an apiId
    if (!this.config_.apiId) {
      throw new InvalidConfigError('Geocoding service requires an apiId');
    }

    /**
     * Base URL for MapQuest Geocoding service.
     * @type {string}
     * @private
     */
    this.serviceUrl_ = 'http://open.mapquestapi.com/geocoding/v1/address';


    /**
     * JSONP service.
     *
     * @type {Object} See {aeris.JSONP} for expected behavior.
     * @property {Function} get
     * @protected
     */
    this.jsonp_ = JSONP;
  };

  _.inherits(MapQuestGeocodeService, AbstractGeocodeService);


  /**
   * @override
   */
  MapQuestGeocodeService.prototype.geocode = function(location) {
    var resLocation;
    var promise = new Promise();

    var query = {
      location: location
    };
    // Tack on api key, so it doesn't get encoded
    // by jsonp service
    var url = this.serviceUrl_ + '?key=' + this.config_.apiId;

    // Map MapQuest status codes to Aeris status codes
    var statusMap = {
      0: GeocodeServiceStatus.OK,
      400: GeocodeServiceStatus.INVALID_REQUEST,
      403: GeocodeServiceStatus.API_ERROR,
      500: GeocodeServiceStatus.API_ERROR
    };

    this.jsonp_.get(url, query, function(res) {
      // Keep away those pesky reference errors...
      res = _.extend({}, {
        info: {
          statuscode: '',
          messages: []
        }
      }, res);

      // API returns error
      if (_.isNaN(parseInt(res.info.statuscode)) || parseInt(res.info.statuscode) >= 400) {
        promise.reject(new GeocodeServiceResponse({
          latLon: [],
          status: {
            code: statusMap[res.info.statuscode] || GeocodeServiceStatus.API_ERROR,
            apiCode: res.info.statuscode,
            message: res.info.messages.join('; ')
          }
        }));

        return;
      }

      // API returns no results
      if (
        !res.results || !res.results.length ||
        !res.results[0].locations || !res.results[0].locations.length
      ) {
        promise.reject(new GeocodeServiceResponse({
          latLon: [],
          status: {
            code: GeocodeServiceStatus.NO_RESULTS,
            apiCode: res.info.statusCode,
            message: res.info.messages.join('; ')
          }
        }));

        return;
      }

      // We're all good..
      resLocation = res.results[0].locations[0];
      promise.resolve(new GeocodeServiceResponse({
        latLon: [
          parseFloat(resLocation.latLng.lat),
          parseFloat(resLocation.latLng.lng)
        ],
        status: {
          code: GeocodeServiceStatus.OK,
          apiCode: res.info.statuscode,
          message: res.info.messages.join('; ')
        }
      }));
    });

    return promise;
  };


  /**
   * Set jsonp service
   *
   * @param {Object} jsonp
   */
  MapQuestGeocodeService.prototype.setJSONP = function(jsonp) {
    this.jsonp_ = jsonp;
  };


  return _.expose(MapQuestGeocodeService, 'aeris.geocode.MapQuestGeocodeService');
});
