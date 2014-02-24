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

<<<<<<< HEAD
=======
        /**
         * JSONP service.
         *
         * @type {Object} See {aeris.JSONP} for expected behavior.
         * @property {Function} get
         * @protected
         */
>>>>>>> Beginnings of stubbed out specs and functions.
        this.jsonp_ = JSONP;
    };

    AerisGeocodeService.prototype.geocode = function(location) {
        var promise = new Promise();
<<<<<<< HEAD
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
=======
        var uri = this.getAerisUri_();
        var query = { location: location };

        this.jsonp_.get(uri, query, _.bind(function(res) {
            // promise results processing
>>>>>>> Beginnings of stubbed out specs and functions.
        }, this));

        return promise;
    };

<<<<<<< HEAD
=======
    AerisGeocodeService.prototype.getAerisUri_ = function() {
        return this.serviceUrl_;
    };

    describe('The AerisGeocodeService', function(){
        it('should query the Aeris places api', function() {
            var aerisService = 
        });
    });

>>>>>>> Beginnings of stubbed out specs and functions.
    return _.expose(AerisGeocodeService, 'aeris.geocode.AerisGeocodeService');
});
