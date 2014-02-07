define([
    'ai/util',
    'ai/maps/strategy/utils',
    'ai/promise',
    'ai/geocode/geocodeserviceresponse',
    'ai/geocode/geocodeservicestatus'
], function(_, mapUtil, Promise, GeocodeServiceResponse, GeocodeServiceStatus) {
    /**
     * @class aeris.geocode.AerisGeocodeService
     * @implements aeris.geocode.GeocodeServiceInterface
     * @constructor
     */
    var AerisGeocodeService = function(opt_options) {
        var options = _.defaults(opt_options || {}, {

        });

        this.serviceUrl_ = 'http://api.aerisapi.com/places';

        /**
         * JSONP service.
         *
         * @type {Object} See {aeris.JSONP} for expected behavior.
         * @property {Function} get
         * @protected
         */
        this.jsonp_ = JSONP;
    };

    AerisGeocodeService.prototype.geocode = function(location) {
        var promise = new Promise();
        var uri = this.getAerisUri_();
        var query = { location: location };

        this.jsonp_.get(uri, query, _.bind(function(res) {
            // promise results processing
        }, this));

        return promise;
    };

    AerisGeocodeService.prototype.getAerisUri_ = function() {
        return this.serviceUrl_;
    };

    describe('The AerisGeocodeService', function(){
        it('should query the Aeris places api', function() {
            var aerisService = 
        });
    });

    return _.expose(AerisGeocodeService, 'aeris.geocode.AerisGeocodeService');
});
