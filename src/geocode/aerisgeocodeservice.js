define([
    'aeris/util',
    'aeris/config',
    'aeris/jsonp',
    'aeris/maps/strategy/utils',
    'aeris/promise',
    'aeris/geocode/geocodeserviceresponse',
    'aeris/geocode/geocodeservicestatus'
], function(_, AerisConfig, JSONP, mapUtil, Promise, GeocodeServiceResponse, GeocodeServiceStatus) {
    /**
     * @class aeris.geocode.AerisGeocodeService
     * @implements aeris.geocode.GeocodeServiceInterface
     * @constructor
     */
    var AerisGeocodeService = function(opt_options) {
        var options = _.defaults(opt_options || {}, {
            jsonp: JSONP
        });
        this.serviceUrl_ = 'http://api.aerisapi.com/places';
        this.jsonp_ = options.jsonp;
    };

    AerisGeocodeService.prototype.geocode = function(location) {
        var promise = new Promise();
        var query = {
            client_id: AerisConfig.get('apiId'),
            client_secret: AerisConfig.get('apiSecret'),
            p: location
        };

        this.jsonp_.get(this.serviceUrl_, query, _.bind(function(res) {
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
