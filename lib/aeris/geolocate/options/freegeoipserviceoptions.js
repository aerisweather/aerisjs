define([
  'ai/util',
  'ai/geolocate/options/geolocateserviceoptions',
  'ai/jsonp'
], function(_, GeolocateServiceOptions, JSONP) {
  /**
   * @class aeris.geolocate.options.FreeGeoIPServiceOptions
   * @extends aeris.geolocate.options.GeolocateServiceOptions
   *
   * @constructor
   * @override
   *
   * @param {string=} opt_options.ip_address
   * @param {Object=} opt_options.jsonp
  */
  var FreeGeoIPServiceOptions = function(opt_options) {
    GeolocateServiceOptions.call(this, opt_options);
  };
  _.inherits(FreeGeoIPServiceOptions, GeolocateServiceOptions);



  /** @override */
  FreeGeoIPServiceOptions.prototype.getDefaultOptions = function() {
    return _.clone(FreeGeoIPServiceOptions.DEFAULT_OPTIONS);
  };


  /** @override */
  FreeGeoIPServiceOptions.DEFAULT_OPTIONS = _.extend({},
    GeolocateServiceOptions.DEFAULT_OPTIONS,
    {
      ip_address: '',
      jsonp: JSONP
    }
  );


  return FreeGeoIPServiceOptions;
});
