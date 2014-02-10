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
            location: location
        };

        this.jsonp_.get(uri, query, _.bind(function(res) {
            // promise results processing
            promise.resolve(function(res) {
                return res;
            });
        }, this));

        return promise;
    };

    AerisGeocodeService.prototype.checkApiKeys = function() {
        AerisConfig.set({
          apiId: 'ezHWL0MiLsxwlN2ik8U4c',
          apiSecret: 'uCDMeSj91lBfIKCmeQkpeZjsAwUUQJHuKesCvqTm'
        });
        var apiId = AerisConfig.get('apiId');
        return apiId.length > 0 && apiId !== 'STUB_API_ID';
    };

    AerisGeocodeService.prototype.getAerisUri = function() {
        return this.serviceUrl_;
    };

    return _.expose(AerisGeocodeService, 'aeris.geocode.AerisGeocodeService');
});
