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
            console.log(res);
            if (!res || res.error || !res.success) {
                promise.reject(res);
            }
            else {
                promise.resolve(res);
            }
        }, this));

        return promise;
    };

    return _.expose(AerisGeocodeService, 'aeris.geocode.AerisGeocodeService');
});
