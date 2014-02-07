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

        /**
         * JSONP service.
         *
         * @type {Object} See {aeris.JSONP} for expected behavior.
         * @property {Function} get
         * @protected
         */
        this.jsonp_ = JSONP;
    };

    return _.expose(AerisGeocodeService, 'aeris.geocode.AerisGeocodeService');
});
