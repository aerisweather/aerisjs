define([
    'ai/util',
    'ai/config',
    'ai/jsonp',
    'ai/maps/strategy/utils',
    'ai/promise',
    'ai/geocode/geocodeserviceresponse',
    'ai/geocode/geocodeservicestatus'
], function(_, AerisConfig, JSONP, mapUtil, Promise, GeocodeServiceResponse, GeocodeServiceStatus) {
    /**
     * @class aeris.geocode.AerisGeocodeService
     * @implements aeris.geocode.GeocodeServiceInterface
     * @constructor
     */
    var AerisGeocodeService = function(opt_options) {
        var options = _.defaults(opt_options || {}, {

        });

        this.serviceUrl_ = 'http://api.aerisapi.com/places';

        this.jsonp_ = JSONP;
    };

    AerisGeocodeService.prototype.geocode = function(location) {
        var promise = new Promise();
        var uri = this.getAerisUri();
        var query = {
            client_id: AerisConfig.get('apiId'),
            client_secret: AerisConfig.get('apiSecret'),
            p: location
        };

        this.jsonp_.get(uri, query, _.bind(function(res) {
            if (!res || res.error || !res.success) {
                console.log(res.error);
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

    AerisGeocodeService.prototype.checkApiKeys = function() {
        AerisConfig.set({
          apiId: 'wgE96YE3scTQLKjnqiMsv',
          apiSecret: 'DGCTq4z2xxttTBwTiimwlWyxmx5IDwK0VZ7T2WMS'
        });
        var apiId = AerisConfig.get('apiId');
        return apiId.length > 0 && apiId !== 'STUB_API_ID';
    };

    AerisGeocodeService.prototype.getAerisUri = function() {
        return this.serviceUrl_;
    };

    /**
     * @private
     * @param {Object} res
     * @return {aeris.geocode.GeocodeServiceResponse}
     */
    AerisGeocodeService.prototype.createGeocodeResponse_ = function(res) {
        console.log(res);
        var geocodedLocation = res.response.loc;

        return new GeocodeServiceResponse({
            latLon: [
                parseFloat(geocodedLocation.lat),
                parseFloat(geocodedLocation.long)
            ],
            status: {
                code: GeocodeServiceStatus.OK,
                apiCode: res.success
            }
        });
    };

    /**
     * @private
     * @param {Object} res
     * @return {aeris.geocode.GeocodeServiceResponse}
     */
    AerisGeocodeService.prototype.createUnexpectedResultsError_ = function(res) {
        return new GeocodeServiceResponse({
            latLon: [],
            status: {
                code: GeocodeServiceStatus.API_ERROR,
                apiCode: '',
                message: 'The Aeris Geolocation API returned an unexpected response.'
            }
        });
    };


    /**
     * @private
     * @param {Object} res
     * @return {aeris.geocode.GeocodeServiceResponse}
     */
    AerisGeocodeService.prototype.createStatusCodeError_ = function(res) {
        var statusMap = {
            0: GeocodeServiceStatus.OK,
            400: GeocodeServiceStatus.INVALID_REQUEST,
            403: GeocodeServiceStatus.API_ERROR,
            500: GeocodeServiceStatus.API_ERROR
        };

        console.log(res);

        return new GeocodeServiceResponse({
            latLon: [],
            status: {
                code: statusMap[res.status.code] || GeocodeServiceStatus.API_ERROR,
                apiCode: res.status.code
//                message: res.info.messages.join('; ')
            }
        });
    };


    /**
     * @private
     * @param {Object} res
     * @return {aeris.geocode.GeocodeServiceResponse}
     */
    AerisGeocodeService.prototype.createNoResultsError_ = function(res) {
        return new GeocodeServiceResponse({
            latLon: [],
            status: {
                code: GeocodeServiceStatus.NO_RESULTS,
                apiCode: res.status.code,
                message: res.info.messages.join('; ')
            }
        });
    };

    /**
     * @private
     * @param {Object} res
     * @return {Boolean}
     */
    AerisGeocodeService.prototype.isStatusCodeErrorResponse_ = function(res) {
        var isResDefined = res && res.info;
        var statusCode = isResDefined ? parseInt(res.status.code) : null;

        return !_.isNumeric(statusCode) || statusCode >= 400;
    };

    return _.expose(AerisGeocodeService, 'aeris.geocode.AerisGeocodeService');
});
