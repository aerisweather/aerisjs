define([
  'aeris/util',
  'aeris/promise',
  'aeris/jsonp',
  'aeris/geocode/config',
  'aeris/errors/invalidconfigerror',
  'aeris/geocode/geocodeserviceresponse',
  'aeris/geocode/geocodeservicestatus'
], function(_, Promise, JSONP, geocodeConfig, InvalidConfigError, GeocodeServiceResponse, GeocodeServiceStatus) {
  /**
   * MapQuest Geocoding Service
   * See http://open.mapquestapi.com/geocoding
   *
   * @publicApi
   * @class MapQuestGeocodeService
   * @namespace aeris.geocode
   * @implements aeris.geocode.GeocodeServiceInterface
   *
   * @constructor
   * @param {Object=} opt_options
   * @param {string} opt_options.apiId
   *                 Mapquest apiId can alternatively be configured in 'aeris/geocode/config'
   *                 via RequireJS `config` option.
   */
  var MapQuestGeocodeService = function(opt_options) {
    var options = _.defaults(opt_options || {}, {
      apiId: geocodeConfig.get('apiId')
    });


    /**
     * The MapQuest API id.
     *
     * @property apiId_
     * @type {*|options.apiId}
     * @private
     */
    this.apiId_ = options.apiId;

    /**
     * Base URL for MapQuest Geocoding service.
     * @type {string}
     * @private
     * @property serviceUrl_
     */
    this.serviceUrl_ = '//open.mapquestapi.com/geocoding/v1/address';


    /**
     * JSONP service.
     *
     * @type {Object} See {aeris.JSONP} for expected behavior.
     * @property {Function} get
     * @protected
     * @property jsonp_
     */
    this.jsonp_ = JSONP;
  };


  /**
   * @throws {aeris.errors.InvalidConfigError} If no Mapquest apiId is provided
   * @override
   * @method geocode
   */
  MapQuestGeocodeService.prototype.geocode = function(location) {
    var promise = new Promise();
    var uri = this.getMapQuestUri_();
    var query = { location: location };

    this.jsonp_.get(uri, query, _.bind(function(res) {
      if (!res || !res.info || _.isUndefined(res.info.statuscode)) {
        promise.reject(this.createUnexpectedResultsError_(res));
      }
      else if (this.isStatusCodeErrorResponse_(res)) {
        promise.reject(this.createStatusCodeError_(res));
      }
      else if (this.isNoResultsErrorResponse_(res)) {
        promise.reject(this.createNoResultsError_(res));
      }
      else {
        promise.resolve(this.createGeocodeResponse_(res));
      }
    }, this));

    return promise;
  };


  /**
   * @private
   * @return {string}
   * @method getMapQuestUri_
   */
  MapQuestGeocodeService.prototype.getMapQuestUri_ = function() {
    this.ensureApiId_();
    return this.serviceUrl_ + '?key=' + this.apiId_;
  };


  /**
   * @throws {aeris.errors.InvalidConfigError}
   * @private
   * @method ensureApiId_
   */
  MapQuestGeocodeService.prototype.ensureApiId_ = function() {
    this.apiId_ = this.apiId_ || geocodeConfig.get('apiId');

    if (!this.apiId_) {
      throw new InvalidConfigError('The MapQuestGeocodeService requires an apiId');
    }
  };


  /**
   * @private
   * @param {Object} res
   * @return {Boolean}
   * @method isStatusCodeErrorResponse_
   */
  MapQuestGeocodeService.prototype.isStatusCodeErrorResponse_ = function(res) {
    var isResDefined = res && res.info;
    var statusCode = isResDefined ? parseInt(res.info.statuscode) : null;

    return !_.isNumeric(statusCode) || statusCode >= 400;
  };


  /**
   * @private
   * @param {Object} res
   * @return {Boolean}
   * @method isNoResultsErrorResponse_
   */
  MapQuestGeocodeService.prototype.isNoResultsErrorResponse_ = function(res) {
    var isResDefined = res && res.results;
    return isResDefined &&
      (!res.results.length || !res.results[0].locations || !res.results[0].locations.length);
  };


  /**
   * @private
   * @param {Object} res
   * @return {aeris.geocode.GeocodeServiceResponse}
   * @method createUnexpectedResultsError_
   */
  MapQuestGeocodeService.prototype.createUnexpectedResultsError_ = function(res) {
    return new GeocodeServiceResponse({
      latLon: [],
      status: {
        code: GeocodeServiceStatus.API_ERROR,
        apiCode: '',
        message: 'The MapQuest Geolocation API returned an unexpected response.'
      }
    });
  };


  /**
   * @private
   * @param {Object} res
   * @return {aeris.geocode.GeocodeServiceResponse}
   * @method createStatusCodeError_
   */
  MapQuestGeocodeService.prototype.createStatusCodeError_ = function(res) {
    var statusMap = {
      0: GeocodeServiceStatus.OK,
      400: GeocodeServiceStatus.INVALID_REQUEST,
      403: GeocodeServiceStatus.API_ERROR,
      500: GeocodeServiceStatus.API_ERROR
    };

    return new GeocodeServiceResponse({
      latLon: [],
      status: {
        code: statusMap[res.info.statuscode] || GeocodeServiceStatus.API_ERROR,
        apiCode: res.info.statuscode,
        message: res.info.messages.join('; ')
      }
    });
  };


  /**
   * @private
   * @param {Object} res
   * @return {aeris.geocode.GeocodeServiceResponse}
   * @method createNoResultsError_
   */
  MapQuestGeocodeService.prototype.createNoResultsError_ = function(res) {
    return new GeocodeServiceResponse({
      latLon: [],
      status: {
        code: GeocodeServiceStatus.NO_RESULTS,
        apiCode: res.info.statuscode,
        message: res.info.messages.join('; ')
      }
    });
  };


  /**
   * @private
   * @param {Object} res
   * @return {aeris.geocode.GeocodeServiceResponse}
   * @method createGeocodeResponse_
   */
  MapQuestGeocodeService.prototype.createGeocodeResponse_ = function(res) {
    var geocodedLocation = res.results[0].locations[0];

    return new GeocodeServiceResponse({
      latLon: [
        parseFloat(geocodedLocation.latLng.lat),
        parseFloat(geocodedLocation.latLng.lng)
      ],
      status: {
        code: GeocodeServiceStatus.OK,
        apiCode: res.info.statuscode,
        message: res.info.messages.join('; ')
      }
    });
  };


  /**
   * Set jsonp service
   *
   * @param {Object} jsonp
   * @method setJSONP
   */
  MapQuestGeocodeService.prototype.setJSONP = function(jsonp) {
    this.jsonp_ = jsonp;
  };


  return _.expose(MapQuestGeocodeService, 'aeris.geocode.MapQuestGeocodeService');
});
