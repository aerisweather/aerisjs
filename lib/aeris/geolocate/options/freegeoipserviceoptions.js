define([
  'aeris/util',
  'aeris/geolocate/options/geolocateserviceoptions',
  'aeris/jsonp'
], function(_, GeolocateServiceOptions, JSONP) {
  /**
   * @class FreeGeoIPServiceOptions
   * @namespace aeris.geolocate.options
   * @extends aeris.geolocate.options.GeolocateServiceOptions
   *
   * @constructor
   * @override
   *
   * @param {string=} opt_options.ip_address
   * @param {Object=} opt_options.jsonp
  */
  var FreeGeoIPServiceOptions = function(opt_options) {
    var options = _.defaults(opt_options || {}, this.getDefaultOptions());

    this.jsonp = options.jsonp;
    this.ip_address = options.ip_address;

    GeolocateServiceOptions.call(this, options);
  };
  _.inherits(FreeGeoIPServiceOptions, GeolocateServiceOptions);



  /**
   * @method getDefaultOptions
   */
  FreeGeoIPServiceOptions.prototype.getDefaultOptions = function() {
    return _.clone(FreeGeoIPServiceOptions.DEFAULT_OPTIONS);
  };


  /**
   * @override
   */
  FreeGeoIPServiceOptions.DEFAULT_OPTIONS = _.extend({},
    GeolocateServiceOptions.DEFAULT_OPTIONS,
    {
      ip_address: '',
      jsonp: JSONP
    }
  );


  return FreeGeoIPServiceOptions;
});
